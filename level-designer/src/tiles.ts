import type { BaseTile, VariantTile } from './types.ts'

export interface BaseTileDef {
  key: BaseTile
  label: string
  sprite: string | null
  walkable: boolean
}

export interface VariantTileDef {
  key: VariantTile
  label: string
  sprite: string | null
  walkable: boolean
  isPlayerStart: boolean
}

export const BASE_TILES: BaseTileDef[] = [
  { key: 'Empt', label: 'Empty',             sprite: null,                              walkable: false },
  { key: 'Gren', label: 'Green Ground',      sprite: '/assets/winter/winter (26).png',  walkable: true  },
  { key: 'GrSu', label: 'Green Sunken',      sprite: '/assets/winter/winter (27).png',  walkable: true  },
  { key: 'GrDi', label: 'Green w/ Dirt',     sprite: '/assets/winter/winter (28).png',  walkable: true  },
  { key: 'Snow', label: 'Snow Ground',        sprite: '/assets/winter/winter (31).png',  walkable: true  },
  { key: 'SnSu', label: 'Snow Sunken',        sprite: '/assets/winter/winter (32).png',  walkable: true  },
  { key: 'SnPa', label: 'Snow w/ Path',       sprite: '/assets/winter/winter (33).png',  walkable: true  },
  { key: 'SnRo', label: 'Snow Round Stone',   sprite: '/assets/winter/winter (34).png',  walkable: true  },
  { key: 'SnQu', label: 'Snow Square Stone',  sprite: '/assets/winter/winter (35).png',  walkable: true  },
  { key: 'Wood', label: 'Wood',               sprite: '/assets/winter/winter (36).png',  walkable: true  },
  { key: 'Brdg', label: 'Bridge',             sprite: '/assets/winter/winter (37).png',  walkable: true  },
]

export const VARIANT_TILES: VariantTileDef[] = [
  { key: 'None', label: 'None',           sprite: null,                              walkable: true,  isPlayerStart: false },
  { key: 'Plyr', label: 'Player Start',   sprite: null,                              walkable: true,  isPlayerStart: true  },
  { key: 'SgnX', label: 'Sign (Skull)',   sprite: '/assets/winter/winter (1).png',   walkable: true,  isPlayerStart: false },
  { key: 'SgnF', label: 'Sign (Fwd)',     sprite: '/assets/winter/winter (2).png',   walkable: true,  isPlayerStart: false },
  { key: 'SgnR', label: 'Sign (Right)',   sprite: '/assets/winter/winter (3).png',   walkable: true,  isPlayerStart: false },
  { key: 'SgnL', label: 'Sign (Left)',    sprite: '/assets/winter/winter (4).png',   walkable: true,  isPlayerStart: false },
  { key: 'Plrd', label: 'Pole (Red)',     sprite: '/assets/winter/winter (5).png',   walkable: true,  isPlayerStart: false },
  { key: 'Plbl', label: 'Pole (Blue)',    sprite: '/assets/winter/winter (6).png',   walkable: true,  isPlayerStart: false },
  { key: 'Spar', label: 'Spear',          sprite: '/assets/winter/winter (7).png',   walkable: true,  isPlayerStart: false },
  { key: 'Lfdk', label: 'Leaf (Dark)',    sprite: '/assets/winter/winter (10).png',  walkable: true,  isPlayerStart: false },
  { key: 'Lflt', label: 'Leaf (Light)',   sprite: '/assets/winter/winter (11).png',  walkable: true,  isPlayerStart: false },
  { key: 'Skll', label: 'Skull',          sprite: '/assets/winter/winter (12).png',  walkable: true,  isPlayerStart: false },
  { key: 'Flr1', label: 'Flower White',   sprite: '/assets/winter/winter (13).png',  walkable: true,  isPlayerStart: false },
  { key: 'Flr2', label: 'Flower Yellow',  sprite: '/assets/winter/winter (14).png',  walkable: true,  isPlayerStart: false },
  { key: 'Flr3', label: 'Flower Plain',   sprite: '/assets/winter/winter (15).png',  walkable: true,  isPlayerStart: false },
  { key: 'Flr4', label: 'Flower Red',     sprite: '/assets/winter/winter (16).png',  walkable: true,  isPlayerStart: false },
  { key: 'Flr5', label: 'Flower White 2', sprite: '/assets/winter/winter (17).png',  walkable: true,  isPlayerStart: false },
  { key: 'Path', label: 'Stone Path',     sprite: '/assets/winter/winter (18).png',  walkable: true,  isPlayerStart: false },
  { key: 'Stne', label: 'Big Stone',      sprite: '/assets/winter/winter (21).png',  walkable: false, isPlayerStart: false },
  { key: 'TreW', label: 'Winter Tree',    sprite: '/assets/winter/winter (22).png',  walkable: false, isPlayerStart: false },
  { key: 'TreS', label: 'Summer Tree',    sprite: '/assets/winter/winter (23).png',  walkable: false, isPlayerStart: false },
]

export const BASE_TILE_MAP = new Map<BaseTile, BaseTileDef>(BASE_TILES.map(t => [t.key, t]))
export const VARIANT_TILE_MAP = new Map<VariantTile, VariantTileDef>(VARIANT_TILES.map(t => [t.key, t]))

export function getAllSpritePaths(): string[] {
  const paths: string[] = []
  for (const t of BASE_TILES) if (t.sprite) paths.push(t.sprite)
  for (const t of VARIANT_TILES) if (t.sprite) paths.push(t.sprite)
  return paths
}
