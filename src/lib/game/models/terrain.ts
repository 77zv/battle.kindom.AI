export enum TerrainType {
  GRASSLAND = 'grassland',
  DIRT_ROAD = 'dirt_road',
  RIVER = 'river',
  FOREST = 'forest',
  HILLS = 'hills',
  FARMLAND = 'farmland',
  MOUNTAINS = 'mountains',
  STONE_PATH = 'stone_path',
}

export interface TerrainData {
  type: TerrainType;
  name: string;
  description: string;
  buildable: boolean;
  movementCost: number;
  resourceYield?: {
    data_tokens?: number;
  };
  color: string; // For simple rendering
}

export const TERRAIN: Record<TerrainType, TerrainData> = {
  [TerrainType.GRASSLAND]: {
    type: TerrainType.GRASSLAND,
    name: 'Grassland',
    description: 'Flat green space, perfect for building',
    buildable: true,
    movementCost: 1,
    color: '#4CAF50',
  },
  [TerrainType.DIRT_ROAD]: {
    type: TerrainType.DIRT_ROAD,
    name: 'Dirt Road',
    description: 'Basic path for travel',
    buildable: true,
    movementCost: 1,
    color: '#8B4513',
  },
  [TerrainType.RIVER]: {
    type: TerrainType.RIVER,
    name: 'River',
    description: 'Water bodies for fishing and transport',
    buildable: false,
    movementCost: 5,
    color: '#2196F3',
  },
  [TerrainType.FOREST]: {
    type: TerrainType.FOREST,
    name: 'Forest',
    description: 'Dense woodland with timber resources',
    buildable: false,
    movementCost: 2,
    resourceYield: {
      data_tokens: 3,
    },
    color: '#1B5E20',
  },
  [TerrainType.HILLS]: {
    type: TerrainType.HILLS,
    name: 'Hills',
    description: 'Rolling hills with stone and ore',
    buildable: false,
    movementCost: 3,
    resourceYield: {
      data_tokens: 1,
    },
    color: '#757575',
  },
  [TerrainType.FARMLAND]: {
    type: TerrainType.FARMLAND,
    name: 'Farmland',
    description: 'Fertile soil for growing crops',
    buildable: true,
    movementCost: 2,
    color: '#FDD835',
  },
  [TerrainType.MOUNTAINS]: {
    type: TerrainType.MOUNTAINS,
    name: 'Mountains',
    description: 'Rugged terrain with valuable minerals',
    buildable: true,
    movementCost: 2,
    color: '#ECEFF1',
  },
  [TerrainType.STONE_PATH]: {
    type: TerrainType.STONE_PATH,
    name: 'Stone Path',
    description: 'Well-maintained road for faster travel',
    buildable: false,
    movementCost: 0.5,
    color: '#795548',
  },
}; 