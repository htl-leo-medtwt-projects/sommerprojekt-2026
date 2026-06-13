import type { BaseTile, Level, Tile, VariantTile } from './types.ts'
import { BASE_TILE_MAP, VARIANT_TILE_MAP } from './tiles.ts'

export const DEFAULT_LEVEL: Level = {
  name: 'level1',
  grid: Array.from({ length: 8 }, (_, r) =>
    Array.from({ length: 8 }, (_, c): Tile => ({
      base: 'Gren',
      variant: r === 0 && c === 0 ? 'Plyr' : 'None',
    }))
  ),
}

export interface ParseResult {
  level?: Level
  error?: string
}

export function parseRawLevelString(raw: string): ParseResult {
  const rows = raw
    .trim()
    .split('\n')
    .map(r => r.trim())
    .filter(r => r.length > 0)

  if (rows.length === 0) return { error: 'Empty level string' }

  const grid: Tile[][] = []

  for (const row of rows) {
    const cells = row.split(/\s+/)
    const tileRow: Tile[] = []

    for (const cell of cells) {
      const slash = cell.indexOf('/')
      if (slash === -1) return { error: `Invalid tile format: "${cell}" — expected BASE/VARIANT` }

      const base = cell.slice(0, slash) as BaseTile
      const variant = cell.slice(slash + 1) as VariantTile

      if (!BASE_TILE_MAP.has(base)) return { error: `Unknown base tile: "${base}"` }
      if (!VARIANT_TILE_MAP.has(variant)) return { error: `Unknown variant: "${variant}"` }

      tileRow.push({ base, variant })
    }

    grid.push(tileRow)
  }

  const colCount = grid[0].length
  for (let i = 1; i < grid.length; i++) {
    if (grid[i].length !== colCount)
      return { error: `Row ${i + 1} has ${grid[i].length} tiles, expected ${colCount}` }
  }

  return { level: { name: 'imported', grid } }
}

export function parseLevelJS(input: string): ParseResult {
  const match = input.match(/name:\s*['"`]([^'"`]+)['"`][\s\S]*?string:\s*`([\s\S]+?)`/)
  if (match) {
    const result = parseRawLevelString(match[2])
    if (result.level) result.level.name = match[1]
    return result
  }
  return parseRawLevelString(input)
}

export function toLevelString(level: Level): string {
  return level.grid
    .map(row => row.map(t => `${t.base}/${t.variant}`).join(' '))
    .join('\n')
}

export function toJSExport(level: Level): string {
  const str = toLevelString(level)
  const indented = str.split('\n').map(l => `            ${l}`).join('\n')
  return `export default [\n    {\n        name: '${level.name}',\n        string: \`\n${indented}\n        \`,\n    },\n]`
}

export interface ValidationResult {
  errors: string[]
  warnings: string[]
}

export function validateLevel(level: Level): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  const { grid } = level
  const rows = grid.length
  const cols = grid[0]?.length ?? 0

  if (rows < 2) errors.push('Level needs at least 2 rows')
  if (cols < 2) errors.push('Level needs at least 2 columns')
  if (rows > 30) warnings.push(`${rows} rows — may affect performance`)
  if (cols > 30) warnings.push(`${cols} columns — may affect performance`)

  let playerCount = 0
  for (const row of grid) {
    for (const tile of row) {
      if (tile.variant === 'Plyr') playerCount++
    }
  }

  if (playerCount === 0) warnings.push('No player start (Plyr) defined')
  if (playerCount > 1) errors.push(`${playerCount} player starts found — only 1 allowed`)

  return { errors, warnings }
}
