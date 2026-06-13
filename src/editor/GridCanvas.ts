import type { Camera, Tile } from '../types.ts'
import { store } from '../state.ts'
import { getImage } from '../imageLoader.ts'
import { BASE_TILE_MAP, VARIANT_TILE_MAP } from '../tiles.ts'

const TILE_W = 188
const TILE_H = 141
const ISO_X = (TILE_W + 40) / 2    // 114
const ISO_Y = (TILE_H + 40) / 2 - 45 / 2  // 68

const CURSOR: Record<string, string> = {
  paint:      'crosshair',
  erase:      'cell',
  fill:       'copy',
  eyedropper: 'zoom-in',
}

function gridToScreen(col: number, row: number, cam: Camera): [number, number] {
  return [
    (col - row) * ISO_X * cam.scale + cam.x,
    (col + row) * ISO_Y * cam.scale + cam.y,
  ]
}

function screenToGrid(sx: number, sy: number, cam: Camera): [number, number] {
  const wx = (sx - cam.x) / cam.scale
  const wy = (sy - cam.y) / cam.scale
  return [
    Math.round((wx / ISO_X + wy / ISO_Y) / 2),
    Math.round((wy / ISO_Y - wx / ISO_X) / 2),
  ]
}

export class GridCanvas {
  readonly el: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private raf = 0
  private dirty = true

  private painting = false
  private panning = false
  private lastPan = { x: 0, y: 0 }
  private hovered: [number, number] | null = null
  private strokeTouched = new Set<string>()

  private unsub: () => void

  constructor(container: HTMLElement) {
    this.el = document.createElement('canvas')
    this.el.className = 'grid-canvas'
    container.appendChild(this.el)
    this.ctx = this.el.getContext('2d')!

    const ro = new ResizeObserver(() => this.onResize())
    ro.observe(this.el)
    this.onResize()

    this.el.addEventListener('mousedown', this.onDown)
    this.el.addEventListener('mousemove', this.onMove)
    this.el.addEventListener('mouseup', this.onUp)
    this.el.addEventListener('mouseleave', this.onLeave)
    this.el.addEventListener('wheel', this.onWheel, { passive: false })
    this.el.addEventListener('contextmenu', e => e.preventDefault())

    this.unsub = store.subscribe(state => {
      this.el.style.cursor = CURSOR[state.tool] ?? 'crosshair'
      this.dirty = true
      this.scheduleRender()
    })

    this.scheduleRender()
  }

  destroy() {
    this.unsub()
    cancelAnimationFrame(this.raf)
    this.el.remove()
  }

  fitToGrid() {
    const { grid } = store.get().level
    const rows = grid.length
    const cols = grid[0]?.length ?? 0
    if (!rows || !cols) return

    const W = this.el.offsetWidth || 800
    const H = this.el.offsetHeight || 600

    const gridW = ((cols - 1) + (rows - 1)) * ISO_X + TILE_W
    const gridH = (cols - 1 + rows - 1) * ISO_Y + TILE_H
    const scale = Math.min((W * 0.85) / gridW, (H * 0.85) / gridH, 1.5)

    const centerX = ((cols - 1) - (rows - 1)) * ISO_X * scale / 2
    const centerY = (cols - 1 + rows - 1) * ISO_Y * scale / 2
    store.setCamera({ scale, x: W / 2 - centerX, y: H / 2 - centerY })
  }

  private onResize() {
    const dpr = devicePixelRatio || 1
    this.el.width = this.el.offsetWidth * dpr
    this.el.height = this.el.offsetHeight * dpr
    this.ctx = this.el.getContext('2d')!
    this.ctx.scale(dpr, dpr)
    this.dirty = true
    this.scheduleRender()
  }

  private scheduleRender() {
    if (this.raf) return
    this.raf = requestAnimationFrame(() => {
      this.raf = 0
      if (this.dirty) { this.render(); this.dirty = false }
    })
  }

  private getGridPos(e: MouseEvent): [number, number] {
    const r = this.el.getBoundingClientRect()
    return screenToGrid(e.clientX - r.left, e.clientY - r.top, store.get().camera)
  }

  private onDown = (e: MouseEvent) => {
    e.preventDefault()
    if (e.button === 1) {
      this.panning = true
      this.lastPan = { x: e.clientX, y: e.clientY }
      return
    }
    const [col, row] = this.getGridPos(e)
    const state = store.get()

    if (e.button === 2) {
      store.setTile(row, col, 'Empt', 'None')
      return
    }

    if (e.button === 0) {
      if (state.tool === 'eyedropper') { this.pick(row, col); return }
      if (state.tool === 'fill') { store.fill(row, col, state.selectedBase, state.selectedVariant); return }
      store.beginStroke()
      this.painting = true
      this.strokeTouched.clear()
      this.applyBrush(row, col)
    }
  }

  private onMove = (e: MouseEvent) => {
    if (this.panning) {
      const cam = store.get().camera
      store.setCamera({ x: cam.x + e.clientX - this.lastPan.x, y: cam.y + e.clientY - this.lastPan.y })
      this.lastPan = { x: e.clientX, y: e.clientY }
      return
    }
    const [col, row] = this.getGridPos(e)
    this.hovered = [row, col]
    if (this.painting) this.applyBrush(row, col)
    this.dirty = true
    this.scheduleRender()
  }

  private onUp = () => {
    if (this.painting) store.endStroke()
    this.painting = false
    this.panning = false
  }

  private onLeave = () => {
    if (this.painting) store.endStroke()
    this.painting = false
    this.panning = false
    this.hovered = null
    this.dirty = true
    this.scheduleRender()
  }

  private onWheel = (e: WheelEvent) => {
    e.preventDefault()
    const cam = store.get().camera
    const factor = e.deltaY < 0 ? 1.12 : 0.88
    const newScale = Math.max(0.15, Math.min(3, cam.scale * factor))
    const r = this.el.getBoundingClientRect()
    const mx = e.clientX - r.left
    const my = e.clientY - r.top
    store.setCamera({
      scale: newScale,
      x: mx - (mx - cam.x) * (newScale / cam.scale),
      y: my - (my - cam.y) * (newScale / cam.scale),
    })
  }

  private applyBrush(row: number, col: number) {
    const key = `${row},${col}`
    if (this.strokeTouched.has(key)) return
    this.strokeTouched.add(key)
    const s = store.get()
    if (s.tool === 'erase') {
      store.setTile(row, col, 'Empt', 'None')
    } else {
      store.setTile(row, col, s.selectedBase, s.selectedVariant)
    }
  }

  private pick(row: number, col: number) {
    const { grid } = store.get().level
    if (row < 0 || row >= grid.length || col < 0 || col >= (grid[0]?.length ?? 0)) return
    const t = grid[row][col]
    store.selectBase(t.base)
    store.selectVariant(t.variant)
    store.setTool('paint')
  }

  private render() {
    const state = store.get()
    const { grid } = state.level
    const cam = state.camera
    const ctx = this.ctx
    const W = this.el.offsetWidth
    const H = this.el.offsetHeight

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#0d1117'
    ctx.fillRect(0, 0, W, H)

    const rows = grid.length
    const cols = grid[0]?.length ?? 0

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const hovered = this.hovered?.[0] === r && this.hovered?.[1] === c
        this.renderTile(ctx, grid[r][c], c, r, cam, state.tool, hovered)
      }
    }
  }

  private renderTile(
    ctx: CanvasRenderingContext2D,
    tile: Tile,
    col: number,
    row: number,
    cam: Camera,
    tool: string,
    hovered: boolean,
  ) {
    const [sx, sy] = gridToScreen(col, row, cam)
    const sc = cam.scale
    const tw = TILE_W * sc
    const th = TILE_H * sc

    ctx.save()
    ctx.translate(sx, sy)

    if (tile.base === 'Empt') {
      this.drawEmptyDiamond(ctx, sc)
    } else {
      const def = BASE_TILE_MAP.get(tile.base)
      if (def?.sprite) {
        const img = getImage(def.sprite)
        if (img) ctx.drawImage(img, -tw / 2, -th / 2, tw, th)
        else this.drawLoadingTile(ctx, sc)
      }
    }

    if (tile.variant === 'Plyr') {
      this.drawPlayerMarker(ctx, sc)
    } else if (tile.variant !== 'None') {
      const def = VARIANT_TILE_MAP.get(tile.variant)
      if (def?.sprite) {
        const img = getImage(def.sprite)
        if (img) {
          const k = 0.7 * sc
          const vw = img.naturalWidth * k
          const vh = img.naturalHeight * k
          ctx.drawImage(img, -vw / 2, -(img.naturalHeight / 2.2) * 0.7 * sc - vh / 2, vw, vh)
        }
      }
    }

    if (hovered) this.drawHover(ctx, sc, tool)

    ctx.restore()
  }

  private drawEmptyDiamond(ctx: CanvasRenderingContext2D, sc: number) {
    const hw = TILE_W * sc / 2
    const hh = TILE_H * sc / 4
    ctx.beginPath()
    ctx.moveTo(0, -hh)
    ctx.lineTo(hw, 0)
    ctx.lineTo(0, hh)
    ctx.lineTo(-hw, 0)
    ctx.closePath()
    ctx.fillStyle = 'rgba(20,20,35,0.6)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(70,80,120,0.5)'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  private drawLoadingTile(ctx: CanvasRenderingContext2D, sc: number) {
    ctx.fillStyle = '#1c2333'
    ctx.fillRect(-TILE_W * sc / 2, -TILE_H * sc / 2, TILE_W * sc, TILE_H * sc)
  }

  private drawPlayerMarker(ctx: CanvasRenderingContext2D, sc: number) {
    const r = Math.max(6, 14 * sc)
    const cy = -r * 2.5
    ctx.beginPath()
    ctx.arc(0, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = '#fde68a'
    ctx.fill()
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = Math.max(1, 2 * sc)
    ctx.stroke()
    ctx.fillStyle = '#1a1a2e'
    ctx.font = `bold ${Math.max(8, 11 * sc)}px monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('P', 0, cy)
  }

  private drawHover(ctx: CanvasRenderingContext2D, sc: number, tool: string) {
    const hw = TILE_W * sc / 2
    const hh = TILE_H * sc / 4
    ctx.beginPath()
    ctx.moveTo(0, -hh)
    ctx.lineTo(hw, 0)
    ctx.lineTo(0, hh)
    ctx.lineTo(-hw, 0)
    ctx.closePath()

    const fills: Record<string, string> = {
      erase:      'rgba(239,68,68,0.25)',
      fill:       'rgba(56,139,253,0.2)',
      eyedropper: 'rgba(251,191,36,0.2)',
    }
    const strokes: Record<string, string> = {
      erase:      'rgba(239,68,68,0.85)',
      fill:       'rgba(56,139,253,0.85)',
      eyedropper: 'rgba(251,191,36,0.85)',
    }

    ctx.fillStyle = fills[tool] ?? 'rgba(255,255,255,0.15)'
    ctx.fill()
    ctx.strokeStyle = strokes[tool] ?? 'rgba(255,255,255,0.75)'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }
}
