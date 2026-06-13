import type { Tool } from '../types.ts'
import { store } from '../state.ts'
import { toLevelString, toJSExport, parseLevelJS, validateLevel } from '../levelFormat.ts'

export class Toolbar {
  readonly el: HTMLElement
  private unsub: () => void
  private gridCanvas: { fitToGrid: () => void } | null = null

  constructor(container: HTMLElement) {
    this.el = document.createElement('div')
    this.el.className = 'toolbar'
    container.appendChild(this.el)
    this.build()
    this.unsub = store.subscribe(() => this.sync())
    this.setupKeyboard()
  }

  setGridCanvas(gc: { fitToGrid: () => void }) { this.gridCanvas = gc }

  destroy() { this.unsub(); this.el.remove() }

  private build() {
    this.el.innerHTML = `
      <div class="tb-group">
        <input class="tb-name" id="level-name" type="text" placeholder="level-name" spellcheck="false">
      </div>
      <div class="tb-sep"></div>
      <div class="tb-group">
        <button class="tb-btn" id="btn-new" title="New level (Ctrl+N)">New</button>
        <button class="tb-btn" id="btn-import" title="Import level">Import</button>
        <button class="tb-btn tb-btn--accent" id="btn-export" title="Export level">Export</button>
      </div>
      <div class="tb-sep"></div>
      <div class="tb-group">
        <button class="tb-btn" id="btn-undo" title="Undo (Ctrl+Z)">↩ Undo</button>
        <button class="tb-btn" id="btn-redo" title="Redo (Ctrl+Y)">↪ Redo</button>
      </div>
      <div class="tb-sep"></div>
      <div class="tb-group">
        <button class="tb-btn tool-btn" data-tool="paint"      title="Paint (B)">✏ Paint</button>
        <button class="tb-btn tool-btn" data-tool="erase"      title="Erase (E)">⌫ Erase</button>
        <button class="tb-btn tool-btn" data-tool="fill"       title="Fill (F)">◼ Fill</button>
        <button class="tb-btn tool-btn" data-tool="eyedropper" title="Pick (I)">💧 Pick</button>
      </div>
      <div class="tb-sep"></div>
      <div class="tb-group tb-group--resize">
        <span class="tb-label">Grid</span>
        <button class="tb-btn tb-btn--icon" id="btn-row-dec" title="Remove row">−R</button>
        <button class="tb-btn tb-btn--icon" id="btn-row-inc" title="Add row">+R</button>
        <button class="tb-btn tb-btn--icon" id="btn-col-dec" title="Remove col">−C</button>
        <button class="tb-btn tb-btn--icon" id="btn-col-inc" title="Add col">+C</button>
      </div>
      <div class="tb-sep"></div>
      <div class="tb-group">
        <button class="tb-btn" id="btn-fit" title="Fit view to grid">⊞ Fit</button>
      </div>
      <div class="tb-spacer"></div>
      <div class="tb-group tb-group--badges" id="validation-badges"></div>
    `

    const q = (sel: string) => this.el.querySelector(sel)!

    q('#level-name').addEventListener('input', e =>
      store.setLevelName((e.target as HTMLInputElement).value)
    )
    q('#btn-new').addEventListener('click', () => this.handleNew())
    q('#btn-import').addEventListener('click', () => this.handleImport())
    q('#btn-export').addEventListener('click', () => this.handleExport())
    q('#btn-undo').addEventListener('click', () => store.undo())
    q('#btn-redo').addEventListener('click', () => store.redo())
    q('#btn-fit').addEventListener('click', () => this.gridCanvas?.fitToGrid())

    q('#btn-row-dec').addEventListener('click', () => {
      const { grid } = store.get().level
      store.resizeGrid(Math.max(1, grid.length - 1), grid[0]?.length ?? 1)
    })
    q('#btn-row-inc').addEventListener('click', () => {
      const { grid } = store.get().level
      store.resizeGrid(grid.length + 1, grid[0]?.length ?? 1)
    })
    q('#btn-col-dec').addEventListener('click', () => {
      const { grid } = store.get().level
      store.resizeGrid(grid.length, Math.max(1, (grid[0]?.length ?? 1) - 1))
    })
    q('#btn-col-inc').addEventListener('click', () => {
      const { grid } = store.get().level
      store.resizeGrid(grid.length, (grid[0]?.length ?? 0) + 1)
    })

    this.el.querySelectorAll('.tool-btn').forEach(btn =>
      btn.addEventListener('click', () =>
        store.setTool((btn as HTMLElement).dataset['tool'] as Tool)
      )
    )

    this.sync()
  }

  private sync() {
    const state = store.get()

    const nameInput = this.el.querySelector<HTMLInputElement>('#level-name')!
    if (document.activeElement !== nameInput) nameInput.value = state.level.name

    this.el.querySelectorAll('.tool-btn').forEach(btn => {
      btn.classList.toggle('tool-btn--active', (btn as HTMLElement).dataset['tool'] === state.tool)
    })

    const undoBtn = this.el.querySelector<HTMLButtonElement>('#btn-undo')!
    const redoBtn = this.el.querySelector<HTMLButtonElement>('#btn-redo')!
    undoBtn.disabled = state.historyIndex <= 0
    redoBtn.disabled = state.historyIndex >= state.history.length - 1

    const v = validateLevel(state.level)
    const badges = this.el.querySelector('#validation-badges')!
    badges.innerHTML = [
      ...v.errors.map(e => `<span class="badge badge--error" title="${e}">⚠ ${clip(e, 22)}</span>`),
      ...v.warnings.map(w => `<span class="badge badge--warn" title="${w}">⚡ ${clip(w, 22)}</span>`),
    ].join('')
  }

  private handleNew() {
    if (store.get().isDirty && !confirm('Discard unsaved changes?')) return
    const rowStr = prompt('Rows:', '8')
    const colStr = prompt('Columns:', '8')
    const rows = Math.max(1, parseInt(rowStr ?? '8', 10) || 8)
    const cols = Math.max(1, parseInt(colStr ?? '8', 10) || 8)
    store.newLevel(rows, cols)
    this.gridCanvas?.fitToGrid()
  }

  private handleImport() {
    showModal(`
      <h3>Import Level</h3>
      <p>Paste a level string or the JS export from <code>levels.js</code>:</p>
      <textarea id="import-text" rows="12" spellcheck="false"
        placeholder="Gren/Plyr Gren/None Gren/TreW&#10;GrDi/None GrDi/Lfdk Wood/None"></textarea>
      <p id="import-err" class="err-msg"></p>
      <div class="modal-actions">
        <button id="btn-cancel" class="tb-btn">Cancel</button>
        <button id="btn-ok" class="tb-btn tb-btn--accent">Import</button>
      </div>
    `, modal => {
      modal.querySelector('#btn-cancel')!.addEventListener('click', hideModal)
      modal.querySelector('#btn-ok')!.addEventListener('click', () => {
        const text = modal.querySelector<HTMLTextAreaElement>('#import-text')!.value
        const result = parseLevelJS(text)
        if (!result.level) {
          modal.querySelector('#import-err')!.textContent = result.error ?? 'Parse failed'
          return
        }
        store.loadLevel(result.level)
        this.gridCanvas?.fitToGrid()
        hideModal()
      })
    })
  }

  private handleExport() {
    const state = store.get()
    const js = toJSExport(state.level)
    const raw = toLevelString(state.level)
    const v = validateLevel(state.level)
    const issues = [...v.errors, ...v.warnings]
      .map(m => `<div class="issue-item">${m}</div>`).join('')

    showModal(`
      <h3>Export Level</h3>
      ${issues ? `<div class="issues-box">${issues}</div>` : ''}
      <div class="export-tabs">
        <button class="tab-btn tab-btn--active" data-tab="js">JS Export</button>
        <button class="tab-btn" data-tab="raw">Raw String</button>
      </div>
      <textarea id="export-js"  class="export-area"        rows="14" readonly spellcheck="false">${esc(js)}</textarea>
      <textarea id="export-raw" class="export-area hidden" rows="14" readonly spellcheck="false">${esc(raw)}</textarea>
      <div class="modal-actions">
        <button id="btn-copy"  class="tb-btn tb-btn--accent">Copy to clipboard</button>
        <button id="btn-close" class="tb-btn">Close</button>
      </div>
    `, modal => {
      modal.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          modal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('tab-btn--active'))
          btn.classList.add('tab-btn--active')
          const tab = (btn as HTMLElement).dataset['tab']
          modal.querySelectorAll('.export-area').forEach(a => a.classList.add('hidden'))
          modal.querySelector(`#export-${tab}`)!.classList.remove('hidden')
        })
      })

      modal.querySelector('#btn-copy')!.addEventListener('click', async () => {
        const area = modal.querySelector<HTMLTextAreaElement>('.export-area:not(.hidden)')!
        try {
          await navigator.clipboard.writeText(area.value)
          const btn = modal.querySelector<HTMLButtonElement>('#btn-copy')!
          btn.textContent = '✓ Copied!'
          setTimeout(() => { btn.textContent = 'Copy to clipboard' }, 2000)
        } catch {
          area.select()
        }
      })

      modal.querySelector('#btn-close')!.addEventListener('click', hideModal)
    })
  }

  private setupKeyboard() {
    document.addEventListener('keydown', e => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const ctrl = e.ctrlKey || e.metaKey
      if (ctrl && e.key === 'z') { e.preventDefault(); store.undo() }
      else if (ctrl && e.key === 'y') { e.preventDefault(); store.redo() }
      else if (ctrl && e.key === 'n') { e.preventDefault(); this.handleNew() }
      else if (!ctrl) {
        if (e.key === 'b') store.setTool('paint')
        else if (e.key === 'e') store.setTool('erase')
        else if (e.key === 'f') store.setTool('fill')
        else if (e.key === 'i') store.setTool('eyedropper')
      }
    })
  }
}

function clip(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function showModal(html: string, setup: (el: HTMLElement) => void) {
  const backdrop = document.getElementById('modal-backdrop')!
  const content  = document.getElementById('modal-content')!
  content.innerHTML = html
  backdrop.classList.remove('hidden')
  setup(content)

  // Close on backdrop click
  const close = (e: MouseEvent) => {
    if (e.target === backdrop) { hideModal(); backdrop.removeEventListener('click', close) }
  }
  backdrop.addEventListener('click', close)
}

function hideModal() {
  document.getElementById('modal-backdrop')!.classList.add('hidden')
}
