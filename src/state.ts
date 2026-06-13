import type { AppState, BaseTile, Level, Tile, Tool, VariantTile } from './types.ts'
import { DEFAULT_LEVEL } from './levelFormat.ts'

type Listener = (state: Readonly<AppState>) => void

class Store {
  private s: AppState
  private listeners = new Set<Listener>()
  private inStroke = false

  constructor() {
    const grid = this.cloneGrid(DEFAULT_LEVEL.grid)
    this.s = {
      level: { name: DEFAULT_LEVEL.name, grid },
      selectedBase: 'Gren',
      selectedVariant: 'None',
      tool: 'paint',
      camera: { x: 0, y: 0, scale: 0.5 },
      history: [this.cloneGrid(grid)],
      historyIndex: 0,
      isDirty: false,
    }
  }

  get(): Readonly<AppState> { return this.s }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  private emit() { this.listeners.forEach(fn => fn(this.s)) }

  private cloneGrid(grid: Tile[][]): Tile[][] {
    return grid.map(row => row.map(t => ({ ...t })))
  }

  private pushCurrent() {
    this.s.history = this.s.history.slice(0, this.s.historyIndex + 1)
    this.s.history.push(this.cloneGrid(this.s.level.grid))
    if (this.s.history.length > 101) this.s.history.shift()
    this.s.historyIndex = this.s.history.length - 1
  }

  beginStroke() { this.inStroke = true }

  endStroke() {
    if (!this.inStroke) return
    this.inStroke = false
    this.pushCurrent()
  }

  setTile(row: number, col: number, base: BaseTile, variant: VariantTile) {
    const { grid } = this.s.level
    if (row < 0 || row >= grid.length || col < 0 || col >= (grid[0]?.length ?? 0)) return
    if (grid[row][col].base === base && grid[row][col].variant === variant) return
    grid[row][col] = { base, variant }
    this.s.isDirty = true
    if (!this.inStroke) this.pushCurrent()
    this.emit()
  }

  fill(startRow: number, startCol: number, base: BaseTile, variant: VariantTile) {
    const { grid } = this.s.level
    const rows = grid.length
    const cols = grid[0]?.length ?? 0
    if (startRow < 0 || startRow >= rows || startCol < 0 || startCol >= cols) return

    const target = grid[startRow][startCol]
    if (target.base === base && target.variant === variant) return

    const visited = new Uint8Array(rows * cols)
    const queue: number[] = [startRow * cols + startCol]

    while (queue.length > 0) {
      const idx = queue.pop()!
      if (visited[idx]) continue
      visited[idx] = 1

      const r = (idx / cols) | 0
      const c = idx % cols
      const t = grid[r][c]
      if (t.base !== target.base || t.variant !== target.variant) continue

      grid[r][c] = { base, variant }

      if (r > 0)      queue.push((r - 1) * cols + c)
      if (r < rows-1) queue.push((r + 1) * cols + c)
      if (c > 0)      queue.push(r * cols + c - 1)
      if (c < cols-1) queue.push(r * cols + c + 1)
    }

    this.pushCurrent()
    this.s.isDirty = true
    this.emit()
  }

  selectBase(b: BaseTile) { this.s.selectedBase = b; this.emit() }
  selectVariant(v: VariantTile) { this.s.selectedVariant = v; this.emit() }
  setTool(t: Tool) { this.s.tool = t; this.emit() }

  setCamera(patch: Partial<{ x: number; y: number; scale: number }>) {
    Object.assign(this.s.camera, patch)
    this.emit()
  }

  undo() {
    if (this.s.historyIndex <= 0) return
    this.s.historyIndex--
    this.s.level.grid = this.cloneGrid(this.s.history[this.s.historyIndex])
    this.emit()
  }

  redo() {
    if (this.s.historyIndex >= this.s.history.length - 1) return
    this.s.historyIndex++
    this.s.level.grid = this.cloneGrid(this.s.history[this.s.historyIndex])
    this.emit()
  }

  setLevelName(name: string) {
    this.s.level.name = name
    this.s.isDirty = true
    this.emit()
  }

  loadLevel(level: Level) {
    const grid = this.cloneGrid(level.grid)
    this.s.level = { name: level.name, grid }
    this.s.history = [this.cloneGrid(grid)]
    this.s.historyIndex = 0
    this.s.isDirty = false
    this.emit()
  }

  newLevel(rows: number, cols: number) {
    const grid: Tile[][] = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c): Tile => ({
        base: 'Gren',
        variant: r === 0 && c === 0 ? 'Plyr' : 'None',
      }))
    )
    this.loadLevel({ name: 'new-level', grid })
  }

  resizeGrid(newRows: number, newCols: number) {
    const { grid } = this.s.level
    const oldRows = grid.length
    const oldCols = grid[0]?.length ?? 0
    this.s.level.grid = Array.from({ length: newRows }, (_, r) =>
      Array.from({ length: newCols }, (_, c): Tile =>
        r < oldRows && c < oldCols
          ? { ...grid[r][c] }
          : { base: 'Gren', variant: 'None' }
      )
    )
    this.pushCurrent()
    this.s.isDirty = true
    this.emit()
  }

  markSaved() { this.s.isDirty = false; this.emit() }
}

export const store = new Store()
