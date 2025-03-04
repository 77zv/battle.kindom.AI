export enum TerrainType {
  GRASS = 'grass',
  DIRT = 'dirt',
  WATER = 'water',
  FOREST = 'forest',
  MOUNTAIN = 'mountain',
  SAND = 'sand',
  SNOW = 'snow',
  ROAD = 'road',
}

export interface TerrainData {
  type: TerrainType;
  name: string;
  description: string;
  buildable: boolean;
  movementCost: number;
  resourceYield?: {
    wood?: number;
    stone?: number;
    food?: number;
    gold?: number;
  };
  color: string; // For simple rendering
}

export const TERRAIN: Record<TerrainType, TerrainData> = {
  [TerrainType.GRASS]: {
    type: TerrainType.GRASS,
    name: 'Grass',
    description: 'Flat grassland, perfect for building',
    buildable: true,
    movementCost: 1,
    resourceYield: {
      food: 1,
    },
    color: '#4CAF50',
  },
  [TerrainType.DIRT]: {
    type: TerrainType.DIRT,
    name: 'Dirt',
    description: 'Basic dirt terrain',
    buildable: true,
    movementCost: 1,
    color: '#8B4513',
  },
  [TerrainType.WATER]: {
    type: TerrainType.WATER,
    name: 'Water',
    description: 'Water bodies like lakes and rivers',
    buildable: false,
    movementCost: 5,
    color: '#2196F3',
  },
  [TerrainType.FOREST]: {
    type: TerrainType.FOREST,
    name: 'Forest',
    description: 'Dense forest with trees',
    buildable: false,
    movementCost: 2,
    resourceYield: {
      wood: 3,
      food: 1,
    },
    color: '#1B5E20',
  },
  [TerrainType.MOUNTAIN]: {
    type: TerrainType.MOUNTAIN,
    name: 'Mountain',
    description: 'Tall mountains with resources',
    buildable: false,
    movementCost: 3,
    resourceYield: {
      stone: 3,
      gold: 1,
    },
    color: '#757575',
  },
  [TerrainType.SAND]: {
    type: TerrainType.SAND,
    name: 'Sand',
    description: 'Sandy terrain',
    buildable: true,
    movementCost: 2,
    color: '#FDD835',
  },
  [TerrainType.SNOW]: {
    type: TerrainType.SNOW,
    name: 'Snow',
    description: 'Snow-covered terrain',
    buildable: true,
    movementCost: 2,
    color: '#ECEFF1',
  },
  [TerrainType.ROAD]: {
    type: TerrainType.ROAD,
    name: 'Road',
    description: 'Paved road for faster movement',
    buildable: false,
    movementCost: 0.5,
    color: '#795548',
  },
}; 