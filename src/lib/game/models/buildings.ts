export enum BuildingType {
  HEADQUARTERS = 'headquarters',
  HOUSE = 'house',
  FARM = 'farm',
  BLACKSMITH = 'blacksmith',
  MARKET = 'market',
  TAVERN = 'tavern',
  CHURCH = 'church',
  BARRACKS = 'barracks',
  WALL = 'wall',
  WATCHTOWER = 'watchtower',
  MINE = 'mine',
  STOREHOUSE = 'storehouse',
  CASTLE = 'castle',
}

export interface BuildingData {
  type: BuildingType;
  name: string;
  description: string;
  cost: {
    cash: number;
    data_tokens?: number;
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
    employees?: number;
    satisfaction?: number;
    security?: number;
  };
  requires?: {
    buildings?: BuildingType[];
  };
}

export const BUILDINGS: Record<BuildingType, BuildingData> = {
  [BuildingType.HEADQUARTERS]: {
    type: BuildingType.HEADQUARTERS,
    name: 'Town Hall',
    description: 'The center of your medieval town. Upgrades as your settlement grows.',
    cost: {
      cash: 0,
      data_tokens: 1000,
    },
    size: {
      width: 5,
      length: 5,
    },
    buildTime: 60,
    unlockLevel: 1,
    provides: {
      employees: 10,
      satisfaction: 20,
      security: 50,
    },
  },
  [BuildingType.HOUSE]: {
    type: BuildingType.HOUSE,
    name: 'Peasant House',
    description: 'Basic housing for your villagers',
    cost: {
      cash: 500,
      data_tokens: 50,
    },
    size: {
      width: 1,
      length: 1,
    },
    buildTime: 5,
    unlockLevel: 1,
    provides: {
      employees: 5,
    },
  },
  [BuildingType.FARM]: {
    type: BuildingType.FARM,
    name: 'Farm',
    description: 'Produces food for your villagers',
    cost: {
      cash: 1000,
      data_tokens: 100,
    },
    size: {
      width: 2,
      length: 2,
    },
    income: 10,
    buildTime: 10,
    unlockLevel: 1,
    provides: {
    },
  },
  [BuildingType.BLACKSMITH]: {
    type: BuildingType.BLACKSMITH,
    name: 'Blacksmith',
    description: 'Crafts tools and weapons for your town',
    cost: {
      cash: 2000,
      data_tokens: 200,
    },
    size: {
      width: 2,
      length: 2,
    },
    income: 15,
    buildTime: 15,
    unlockLevel: 2,
    provides: {
      satisfaction: 5,
    },
    requires: {
      buildings: [BuildingType.HOUSE],
    },
  },
  [BuildingType.MARKET]: {
    type: BuildingType.MARKET,
    name: 'Market',
    description: 'Trade goods and increase town income',
    cost: {
      cash: 3000,
      data_tokens: 300,
    },
    size: {
      width: 3,
      length: 3,
    },
    income: 30,
    buildTime: 20,
    unlockLevel: 2,
    provides: {
      satisfaction: 10,
    },
    requires: {
      buildings: [BuildingType.HOUSE, BuildingType.FARM],
    },
  },
  [BuildingType.TAVERN]: {
    type: BuildingType.TAVERN,
    name: 'Tavern',
    description: 'Keeps your villagers happy with food and drink',
    cost: {
      cash: 2500,
      data_tokens: 250,
    },
    size: {
      width: 2,
      length: 2,
    },
    income: 20,
    buildTime: 15,
    unlockLevel: 2,
    provides: {
      satisfaction: 15,
    },
    requires: {
      buildings: [BuildingType.HOUSE],
    },
  },
  [BuildingType.CHURCH]: {
    type: BuildingType.CHURCH,
    name: 'Church',
    description: 'Provides spiritual guidance and community gathering',
    cost: {
      cash: 5000,
      data_tokens: 400,
    },
    size: {
      width: 3,
      length: 4,
    },
    buildTime: 30,
    unlockLevel: 3,
    provides: {
      satisfaction: 20,
    },
    requires: {
      buildings: [BuildingType.HOUSE, BuildingType.MARKET],
    },
  },
  [BuildingType.BARRACKS]: {
    type: BuildingType.BARRACKS,
    name: 'Barracks',
    description: 'Trains soldiers to defend your town',
    cost: {
      cash: 4000,
      data_tokens: 350,
    },
    size: {
      width: 3,
      length: 3,
    },
    upkeep: 20,
    buildTime: 25,
    unlockLevel: 3,
    provides: {
      security: 30,
    },
    requires: {
      buildings: [BuildingType.BLACKSMITH],
    },
  },
  [BuildingType.WALL]: {
    type: BuildingType.WALL,
    name: 'Stone Wall',
    description: 'Protects your town from invaders',
    cost: {
      cash: 1500,
      data_tokens: 100,
    },
    size: {
      width: 1,
      length: 1,
    },
    buildTime: 5,
    unlockLevel: 2,
    provides: {
      security: 10,
    },
  },
  [BuildingType.WATCHTOWER]: {
    type: BuildingType.WATCHTOWER,
    name: 'Watchtower',
    description: 'Provides visibility and additional security',
    cost: {
      cash: 2000,
      data_tokens: 200,
    },
    size: {
      width: 1,
      length: 1,
    },
    buildTime: 10,
    unlockLevel: 2,
    provides: {
      security: 15,
    },
  },
  [BuildingType.MINE]: {
    type: BuildingType.MINE,
    name: 'Mine',
    description: 'Extracts valuable resources from the ground',
    cost: {
      cash: 3000,
      data_tokens: 300,
    },
    size: {
      width: 2,
      length: 2,
    },
    income: 25,
    buildTime: 20,
    unlockLevel: 2,
    provides: {
    },
    requires: {
      buildings: [BuildingType.FARM],
    },
  },
  [BuildingType.STOREHOUSE]: {
    type: BuildingType.STOREHOUSE,
    name: 'Storehouse',
    description: 'Stores food and resources for your town',
    cost: {
      cash: 2500,
      data_tokens: 250,
    },
    size: {
      width: 2,
      length: 2,
    },
    buildTime: 15,
    unlockLevel: 3,
    provides: {
    },
    requires: {
      buildings: [BuildingType.FARM],
    },
  },
  [BuildingType.CASTLE]: {
    type: BuildingType.CASTLE,
    name: 'Castle',
    description: 'Massive fortification and symbol of your power',
    cost: {
      cash: 10000,
      data_tokens: 500,
    },
    size: {
      width: 4,
      length: 4,
    },
    income: 40,
    buildTime: 30,
    unlockLevel: 4,
    provides: {
    },
    requires: {
      buildings: [BuildingType.BLACKSMITH, BuildingType.MINE],
    },
  },
}; 