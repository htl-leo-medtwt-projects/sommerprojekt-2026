# Level Designer

A browser-based isometric tile map editor for building game levels. Paint tiles on an isometric grid, place objects and decorations, then export the level as a JavaScript module ready for use in a game.

## Getting started

Either use VS Code's launch configuration or run the following commands:

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:5173` in your browser.

## How it works

The editor uses an isometric grid where each cell holds two layers:

- **Base tile** — the ground type (green grass, snow, wood, bridge, etc.)
- **Variant** — an object placed on top (trees, signs, flowers, stones, the player start marker, etc.)

Levels are serialised as a compact text format where each cell is written as `BASE/VARIANT`, rows are newline-separated, and columns are space-separated:

```text
Gren/Plyr Gren/None Gren/TreW
GrDi/None GrDi/Lfdk Wood/None
Snow/Stne SnPa/None Brdg/None
```

## Tools

| Key         | Tool  | Description                                |
| ----------- | ----- | ------------------------------------------ |
| `B`         | Paint | Draw tiles by clicking or dragging         |
| `E`         | Erase | Reset cells to empty                       |
| `F`         | Fill  | Flood-fill a region with the selected tile |
| `I`         | Pick  | Sample a tile from the canvas              |
| Right-click | —     | Quick-erase a single cell                  |
| Middle-drag | —     | Pan the camera                             |
| Scroll      | —     | Zoom in/out                                |

Other shortcuts: `Ctrl+Z` undo, `Ctrl+Y` redo, `Ctrl+N` new level.

## Toolbar

- **New** — create a blank grid (prompts for dimensions)
- **Import** — paste a raw level string or a JS export block
- **Export** — copy the level as a JS module or as a raw string
- **+R / −R / +C / −C** — add or remove rows and columns
- **Fit** — zoom and centre the camera to fit the grid

Validation badges appear in the toolbar when the level has issues (e.g. missing player start, duplicate player starts, grid too small).

## Export format

Clicking **Export → JS Export** produces a module like:

```js
export default [
    {
        name: 'level1',
        string: `
            Gren/Plyr Gren/None Gren/TreW
            GrDi/None GrDi/Lfdk Wood/None
        `,
    },
]
```

Import this file in your game and parse the `string` field to reconstruct the tile grid.

## Building

```bash
pnpm build      # type-check + Vite production build → dist/
pnpm preview    # serve the production build locally
```

## Tech stack

- **TypeScript** + **Vite** — no runtime framework
- Canvas 2D API for rendering (HiDPI-aware, RAF-scheduled)
- Tiny hand-rolled reactive store for state management
