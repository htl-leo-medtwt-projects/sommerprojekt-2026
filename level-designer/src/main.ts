import './style.css'
import { store } from './state.ts'
import { GridCanvas } from './editor/GridCanvas.ts'
import { Palette } from './editor/Palette.ts'
import { Toolbar } from './editor/Toolbar.ts'
import { preloadAll } from './imageLoader.ts'
import { getAllSpritePaths } from './tiles.ts'

const toolbar = new Toolbar(document.getElementById('toolbar')!)
new Palette(document.getElementById('palette-panel')!)
const gridCanvas = new GridCanvas(document.getElementById('canvas-container')!)

toolbar.setGridCanvas(gridCanvas)

preloadAll(getAllSpritePaths()).then(() => gridCanvas.fitToGrid())
requestAnimationFrame(() => gridCanvas.fitToGrid())

const statusbar = document.getElementById('statusbar')!
store.subscribe(state => {
  const rows = state.level.grid.length
  const cols = state.level.grid[0]?.length ?? 0
  statusbar.innerHTML = `
    <span>Tool: <b>${state.tool}</b></span>
    <span class="sep">|</span>
    <span>Brush: <b>${state.selectedBase}/${state.selectedVariant}</b></span>
    <span class="sep">|</span>
    <span>Grid: <b>${cols}×${rows}</b></span>
    <span class="sep">|</span>
    <span>Zoom: <b>${Math.round(state.camera.scale * 100)}%</b></span>
    ${state.isDirty ? '<span class="sep">|</span><span class="dirty">● unsaved</span>' : ''}
  `
})
