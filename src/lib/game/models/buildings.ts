export enum BuildingType {
  HEADQUARTERS = 'headquarters',
  OFFICE = 'office',
  DATA_CENTER = 'data_center',
  RESEARCH_LAB = 'research_lab',
  TECH_HUB = 'tech_hub',
  CAFETERIA = 'cafeteria',
  INNOVATION_CENTER = 'innovation_center',
  NETWORKING_EVENT = 'networking_event',
  FIREWALL = 'firewall',
  SERVER_TOWER = 'server_tower',
  DATA_MINE = 'data_mine',
  CLOUD_STORAGE = 'cloud_storage',
  TESLA_GIGAFACTORY = 'tesla_gigafactory',
}

export interface BuildingData {
  type: BuildingType;
  name: string;
  description: string;
  cost: {
    data_tokens: number;
    silicon?: number;
    hardware?: number;
    energy?: number;
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
    computing_power?: number;
    resources?: {
      silicon?: number;
      hardware?: number;
      energy?: number;
    };
  };
  requires?: {
    buildings?: BuildingType[];
    resources?: {
      silicon?: number;
      hardware?: number;
      energy?: number;
    };
  };
}

export const BUILDINGS: Record<BuildingType, BuildingData> = {
  [BuildingType.HEADQUARTERS]: {
    type: BuildingType.HEADQUARTERS,
    name: 'Startup Incubator',
    description: 'The humble beginnings of your tech empire. Upgrades to a full company HQ as you grow.',
    cost: {
      data_tokens: 1000,
      hardware: 500,
      silicon: 300,
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
  [BuildingType.OFFICE]: {
    type: BuildingType.OFFICE,
    name: 'Open Office Space',
    description: 'Basic workspace for your employees',
    cost: {
      data_tokens: 50,
      silicon: 20,
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
  [BuildingType.DATA_CENTER]: {
    type: BuildingType.DATA_CENTER,
    name: 'Data Center',
    description: 'Processes data and increases computing power',
    cost: {
      data_tokens: 100,
      silicon: 30,
    },
    size: {
      width: 2,
      length: 2,
    },
    income: 10,
    buildTime: 10,
    unlockLevel: 1,
    provides: {
      computing_power: 20,
    },
  },
  [BuildingType.RESEARCH_LAB]: {
    type: BuildingType.RESEARCH_LAB,
    name: 'Research Lab',
    description: 'Develops new technologies and algorithms',
    cost: {
      data_tokens: 200,
      silicon: 50,
      hardware: 30,
      energy: 20,
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
      buildings: [BuildingType.OFFICE],
    },
  },
  [BuildingType.TECH_HUB]: {
    type: BuildingType.TECH_HUB,
    name: 'Tech Hub',
    description: 'Exchange innovations and increase income',
    cost: {
      data_tokens: 300,
      silicon: 100,
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
      buildings: [BuildingType.OFFICE, BuildingType.DATA_CENTER],
    },
  },
  [BuildingType.CAFETERIA]: {
    type: BuildingType.CAFETERIA,
    name: 'Gourmet Cafeteria',
    description: 'Keeps your employees happy with free food',
    cost: {
      data_tokens: 250,
      silicon: 80,
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
      buildings: [BuildingType.OFFICE],
    },
  },
  [BuildingType.INNOVATION_CENTER]: {
    type: BuildingType.INNOVATION_CENTER,
    name: 'Innovation Center',
    description: 'Fosters creativity and breakthrough ideas',
    cost: {
      data_tokens: 400,
      hardware: 200,
      silicon: 100,
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
      buildings: [BuildingType.OFFICE, BuildingType.TECH_HUB],
    },
  },
  [BuildingType.NETWORKING_EVENT]: {
    type: BuildingType.NETWORKING_EVENT,
    name: 'Networking Event Center',
    description: 'Recruits and trains new talent for your company',
    cost: {
      data_tokens: 350,
      silicon: 150,
      hardware: 50,
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
      buildings: [BuildingType.RESEARCH_LAB],
    },
  },
  [BuildingType.FIREWALL]: {
    type: BuildingType.FIREWALL,
    name: 'Firewall',
    description: 'Protects your network from cyber attacks',
    cost: {
      data_tokens: 100,
      hardware: 50,
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
  [BuildingType.SERVER_TOWER]: {
    type: BuildingType.SERVER_TOWER,
    name: 'Server Tower',
    description: 'Provides additional computing power and security',
    cost: {
      data_tokens: 200,
      hardware: 100,
      energy: 30,
    },
    size: {
      width: 1,
      length: 1,
    },
    buildTime: 10,
    unlockLevel: 2,
    provides: {
      security: 15,
      computing_power: 10,
    },
  },
  [BuildingType.DATA_MINE]: {
    type: BuildingType.DATA_MINE,
    name: 'Data Mine',
    description: 'Extracts valuable user data to generate Data Tokens',
    cost: {
      data_tokens: 300,
      silicon: 100,
      energy: 50,
    },
    size: {
      width: 2,
      length: 2,
    },
    income: 25,
    buildTime: 20,
    unlockLevel: 2,
    provides: {
      resources: {
        energy: 5,
      },
    },
    requires: {
      buildings: [BuildingType.DATA_CENTER],
    },
  },
  [BuildingType.CLOUD_STORAGE]: {
    type: BuildingType.CLOUD_STORAGE,
    name: 'Cloud Storage Facility',
    description: 'Stores and processes large amounts of data',
    cost: {
      data_tokens: 250,
      hardware: 120,
      energy: 40,
    },
    size: {
      width: 2,
      length: 2,
    },
    buildTime: 15,
    unlockLevel: 3,
    provides: {
      computing_power: 15,
      security: 5,
    },
    requires: {
      buildings: [BuildingType.DATA_CENTER],
    },
  },
  [BuildingType.TESLA_GIGAFACTORY]: {
    type: BuildingType.TESLA_GIGAFACTORY,
    name: 'Tesla Gigafactory',
    description: 'Massive production facility for hardware and energy',
    cost: {
      data_tokens: 500,
      silicon: 200,
      hardware: 150,
      energy: 100,
    },
    size: {
      width: 4,
      length: 4,
    },
    income: 40,
    buildTime: 30,
    unlockLevel: 4,
    provides: {
      resources: {
        hardware: 10,
        energy: 15,
      },
      employees: 20,
    },
    requires: {
      buildings: [BuildingType.RESEARCH_LAB, BuildingType.DATA_MINE],
    },
  },
}; 