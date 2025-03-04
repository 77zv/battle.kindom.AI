export enum BuildingType {
  CASTLE = 'castle',
  HOUSE = 'house',
  FARM = 'farm',
  BLACKSMITH = 'blacksmith',
  MARKET = 'market',
  TAVERN = 'tavern',
  CHURCH = 'church',
  BARRACKS = 'barracks',
  WALL = 'wall',
  TOWER = 'tower',
  MINE = 'mine',
  MILL = 'mill',
  STABLE = 'stable',
}

export interface BuildingData {
  type: BuildingType;
  name: string;
  description: string;
  cost: {
    gold: number;
    wood?: number;
    stone?: number;
    iron?: number;
  };
  size: {
    width: number;
    length: number;
  };
  income?: number;
  upkeep?: number;
  buildTime: number;
  unlockLevel: number;
  provides?: {
    housing?: number;
    happiness?: number;
    defense?: number;
    food?: number;
    resources?: {
      wood?: number;
      stone?: number;
      iron?: number;
    };
  };
  requires?: {
    buildings?: BuildingType[];
    resources?: {
      wood?: number;
      stone?: number;
      iron?: number;
    };
  };
}

export const BUILDINGS: Record<BuildingType, BuildingData> = {
  [BuildingType.CASTLE]: {
    type: BuildingType.CASTLE,
    name: 'Castle',
    description: 'The center of your kingdom',
    cost: {
      gold: 1000,
      stone: 500,
      wood: 300,
    },
    size: {
      width: 5,
      length: 5,
    },
    buildTime: 60,
    unlockLevel: 1,
    provides: {
      housing: 10,
      happiness: 20,
      defense: 50,
    },
  },
  [BuildingType.HOUSE]: {
    type: BuildingType.HOUSE,
    name: 'House',
    description: 'Basic housing for your peasants',
    cost: {
      gold: 50,
      wood: 20,
    },
    size: {
      width: 1,
      length: 1,
    },
    buildTime: 5,
    unlockLevel: 1,
    provides: {
      housing: 5,
    },
  },
  [BuildingType.FARM]: {
    type: BuildingType.FARM,
    name: 'Farm',
    description: 'Produces food for your kingdom',
    cost: {
      gold: 100,
      wood: 30,
    },
    size: {
      width: 2,
      length: 2,
    },
    income: 10,
    buildTime: 10,
    unlockLevel: 1,
    provides: {
      food: 20,
    },
  },
  [BuildingType.BLACKSMITH]: {
    type: BuildingType.BLACKSMITH,
    name: 'Blacksmith',
    description: 'Crafts weapons and tools',
    cost: {
      gold: 200,
      wood: 50,
      stone: 30,
      iron: 20,
    },
    size: {
      width: 2,
      length: 2,
    },
    income: 15,
    buildTime: 15,
    unlockLevel: 2,
    provides: {
      happiness: 5,
    },
    requires: {
      buildings: [BuildingType.HOUSE],
    },
  },
  [BuildingType.MARKET]: {
    type: BuildingType.MARKET,
    name: 'Market',
    description: 'Trade goods and increase income',
    cost: {
      gold: 300,
      wood: 100,
    },
    size: {
      width: 3,
      length: 3,
    },
    income: 30,
    buildTime: 20,
    unlockLevel: 2,
    provides: {
      happiness: 10,
    },
    requires: {
      buildings: [BuildingType.HOUSE, BuildingType.FARM],
    },
  },
  [BuildingType.TAVERN]: {
    type: BuildingType.TAVERN,
    name: 'Tavern',
    description: 'Keeps your citizens happy',
    cost: {
      gold: 250,
      wood: 80,
    },
    size: {
      width: 2,
      length: 2,
    },
    income: 20,
    buildTime: 15,
    unlockLevel: 2,
    provides: {
      happiness: 15,
    },
    requires: {
      buildings: [BuildingType.HOUSE],
    },
  },
  [BuildingType.CHURCH]: {
    type: BuildingType.CHURCH,
    name: 'Church',
    description: 'Provides spiritual guidance',
    cost: {
      gold: 400,
      stone: 200,
      wood: 100,
    },
    size: {
      width: 3,
      length: 4,
    },
    buildTime: 30,
    unlockLevel: 3,
    provides: {
      happiness: 20,
    },
    requires: {
      buildings: [BuildingType.HOUSE, BuildingType.MARKET],
    },
  },
  [BuildingType.BARRACKS]: {
    type: BuildingType.BARRACKS,
    name: 'Barracks',
    description: 'Trains soldiers to defend your kingdom',
    cost: {
      gold: 350,
      wood: 150,
      stone: 50,
    },
    size: {
      width: 3,
      length: 3,
    },
    upkeep: 20,
    buildTime: 25,
    unlockLevel: 3,
    provides: {
      defense: 30,
    },
    requires: {
      buildings: [BuildingType.BLACKSMITH],
    },
  },
  [BuildingType.WALL]: {
    type: BuildingType.WALL,
    name: 'Wall',
    description: 'Defends your kingdom from invaders',
    cost: {
      gold: 100,
      stone: 50,
    },
    size: {
      width: 1,
      length: 1,
    },
    buildTime: 5,
    unlockLevel: 2,
    provides: {
      defense: 10,
    },
  },
  [BuildingType.TOWER]: {
    type: BuildingType.TOWER,
    name: 'Tower',
    description: 'Provides lookout and defense',
    cost: {
      gold: 200,
      stone: 100,
      wood: 50,
    },
    size: {
      width: 1,
      length: 1,
    },
    buildTime: 15,
    unlockLevel: 3,
    provides: {
      defense: 20,
    },
    requires: {
      buildings: [BuildingType.WALL],
    },
  },
  [BuildingType.MINE]: {
    type: BuildingType.MINE,
    name: 'Mine',
    description: 'Extracts stone and iron',
    cost: {
      gold: 300,
      wood: 100,
    },
    size: {
      width: 2,
      length: 2,
    },
    buildTime: 20,
    unlockLevel: 2,
    provides: {
      resources: {
        stone: 10,
        iron: 5,
      },
    },
  },
  [BuildingType.MILL]: {
    type: BuildingType.MILL,
    name: 'Mill',
    description: 'Processes grain into flour',
    cost: {
      gold: 200,
      wood: 80,
      stone: 30,
    },
    size: {
      width: 2,
      length: 2,
    },
    income: 15,
    buildTime: 15,
    unlockLevel: 2,
    provides: {
      food: 10,
    },
    requires: {
      buildings: [BuildingType.FARM],
    },
  },
  [BuildingType.STABLE]: {
    type: BuildingType.STABLE,
    name: 'Stable',
    description: 'Houses horses for knights and transportation',
    cost: {
      gold: 250,
      wood: 100,
    },
    size: {
      width: 2,
      length: 3,
    },
    buildTime: 20,
    unlockLevel: 3,
    provides: {
      happiness: 5,
    },
    requires: {
      buildings: [BuildingType.FARM],
    },
  },
}; 