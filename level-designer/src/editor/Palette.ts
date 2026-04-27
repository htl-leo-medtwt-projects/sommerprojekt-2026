import type { BaseTile, VariantTile } from '../types.ts'
import { store } from '../state.ts'
import { BASE_TILES, VARIANT_TILES } from '../tiles.ts'

function encodePath(src: string): string {
  return src.split('/').map(s => encodeURIComponent(s)).join('/')
}

export class Palette {
  readonly el: HTMLElement
  private unsub: () => void

  constructor(container: HTMLElement) {
    this.el = document.createElement('div')
    this.el.className = 'palette'
    container.appendChild(this.el)
    this.build()
    this.unsub = store.subscribe(() => this.updateSelection())
  }

  destroy() {
    this.unsub()
    this.el.remove()
  }

  private build() {
    this.el.innerHTML = `
      <div class="palette-section">
        <div class="palette-label">Base Tile</div>
        <div class="palette-grid" id="base-grid"></div>
      </div>
      <div class="palette-section">
        <div class="palette-label">Variant</div>
        <div class="palette-grid" id="variant-grid"></div>
      </div>
    `

    const baseGrid = this.el.querySelector('#base-grid')!
    for (const tile of BASE_TILES) {
      const btn = this.makeBtn(
        tile.key,
        tile.label,
        tile.sprite ? `<img src="${encodePath(tile.sprite)}" alt="${tile.label}" loading="lazy">` : `<span class="tile-symbol">∅</span>`,
        false,
      )
      btn.addEventListener('click', () => store.selectBase(tile.key as BaseTile))
      baseGrid.appendChild(btn)
    }

    const varGrid = this.el.querySelector('#variant-grid')!
    for (const tile of VARIANT_TILES) {
      let inner: string
      if (tile.isPlayerStart) {
        inner = `<span class="tile-symbol tile-symbol--player">P</span>`
      } else if (tile.sprite) {
        inner = `<img src="${encodePath(tile.sprite)}" alt="${tile.label}" loading="lazy">`
      } else {
        inner = `<span class="tile-symbol">—</span>`
      }
      const btn = this.makeBtn(tile.key, tile.label, inner, !tile.walkable)
      btn.addEventListener('click', () => store.selectVariant(tile.key as VariantTile))
      varGrid.appendChild(btn)
    }

    this.updateSelection()
  }

  private makeBtn(key: string, label: string, inner: string, impassable: boolean): HTMLButtonElement {
    const btn = document.createElement('button')
    btn.className = 'tile-btn' + (impassable ? ' tile-btn--impassable' : '')
    btn.dataset['key'] = key
    btn.title = `${label} (${key})`
    btn.innerHTML = inner
    return btn
  }

  private updateSelection() {
    const { selectedBase, selectedVariant } = store.get()
    this.el.querySelectorAll('.tile-btn').forEach(btn =>
      btn.classList.remove('tile-btn--selected')
    )
    this.el.querySelector(`#base-grid [data-key="${selectedBase}"]`)
      ?.classList.add('tile-btn--selected')
    this.el.querySelector(`#variant-grid [data-key="${selectedVariant}"]`)
      ?.classList.add('tile-btn--selected')
  }
}
