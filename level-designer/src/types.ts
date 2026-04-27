export type BaseTile =
  | 'Empt' | 'Gren' | 'GrSu' | 'GrDi'
  | 'Snow' | 'SnSu' | 'SnPa' | 'SnRo' | 'SnQu'
  | 'Wood' | 'Brdg'

export type VariantTile =
  | 'None' | 'Plyr'
  | 'SgnX' | 'SgnF' | 'SgnR' | 'SgnL'
  | 'Plrd' | 'Plbl' | 'Spar'
  | 'Lfdk' | 'Lflt' | 'Skll'
  | 'Flr1' | 'Flr2' | 'Flr3' | 'Flr4' | 'Flr5'
  | 'Path' | 'Stne' | 'TreW' | 'TreS'

export interface Tile {
  base: BaseTile
  variant: VariantTile
}

export interface Level {
  name: string
  grid: Tile[][]
}

export interface Camera {
  x: number
  y: number
  scale: number
}

export type Tool = 'paint' | 'erase' | 'fill' | 'eyedropper'

export interface AppState {
  level: Level
  selectedBase: BaseTile
  selectedVariant: VariantTile
  tool: Tool
  camera: Camera
  history: Tile[][][]
  historyIndex: number
  isDirty: boolean
}
