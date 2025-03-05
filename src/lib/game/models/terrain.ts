export enum TerrainType {
  CAMPUS_LAWN = 'campus_lawn',
  CONCRETE = 'concrete',
  LAKE = 'lake',
  TECH_PARK = 'tech_park',
  SILICON_HILLS = 'silicon_hills',
  SOLAR_FIELD = 'solar_field',
  SERVER_FARM = 'server_farm',
  FIBER_OPTIC = 'fiber_optic',
}

export interface TerrainData {
  type: TerrainType;
  name: string;
  description: string;
  buildable: boolean;
  movementCost: number;
  resourceYield?: {
    silicon?: number;
    hardware?: number;
    computing_power?: number;
    data_tokens?: number;
  };
  color: string; // For simple rendering
}

export const TERRAIN: Record<TerrainType, TerrainData> = {
  [TerrainType.CAMPUS_LAWN]: {
    type: TerrainType.CAMPUS_LAWN,
    name: 'Campus Lawn',
    description: 'Flat green space, perfect for building tech campuses',
    buildable: true,
    movementCost: 1,
    resourceYield: {
      computing_power: 1,
    },
    color: '#4CAF50',
  },
  [TerrainType.CONCRETE]: {
    type: TerrainType.CONCRETE,
    name: 'Concrete',
    description: 'Basic urban terrain',
    buildable: true,
    movementCost: 1,
    color: '#8B4513',
  },
  [TerrainType.LAKE]: {
    type: TerrainType.LAKE,
    name: 'Lake',
    description: 'Water bodies for cooling data centers',
    buildable: false,
    movementCost: 5,
    color: '#2196F3',
  },
  [TerrainType.TECH_PARK]: {
    type: TerrainType.TECH_PARK,
    name: 'Tech Park',
    description: 'Dense area with startup offices',
    buildable: false,
    movementCost: 2,
    resourceYield: {
      silicon: 3,
      computing_power: 1,
    },
    color: '#1B5E20',
  },
  [TerrainType.SILICON_HILLS]: {
    type: TerrainType.SILICON_HILLS,
    name: 'Silicon Hills',
    description: 'Hills rich with silicon and resources',
    buildable: false,
    movementCost: 3,
    resourceYield: {
      hardware: 3,
      data_tokens: 1,
    },
    color: '#757575',
  },
  [TerrainType.SOLAR_FIELD]: {
    type: TerrainType.SOLAR_FIELD,
    name: 'Solar Field',
    description: 'Area with solar panels for energy generation',
    buildable: true,
    movementCost: 2,
    color: '#FDD835',
  },
  [TerrainType.SERVER_FARM]: {
    type: TerrainType.SERVER_FARM,
    name: 'Server Farm',
    description: 'Cold area ideal for server cooling',
    buildable: true,
    movementCost: 2,
    color: '#ECEFF1',
  },
  [TerrainType.FIBER_OPTIC]: {
    type: TerrainType.FIBER_OPTIC,
    name: 'Fiber Optic Network',
    description: 'High-speed network for faster data transfer',
    buildable: false,
    movementCost: 0.5,
    color: '#795548',
  },
}; 