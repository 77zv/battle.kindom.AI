import { create } from 'zustand';
import { BuildingType } from '../models/buildings';
import { TerrainType, TERRAIN } from '../models/terrain';

export interface GameResources {
  cash: number;
  data_tokens: number;
  silicon: number;
  hardware: number;
  energy: number;
  computing_power: number;
}

export interface GameStats {
  employees: number;
  employeeCapacity: number;
  satisfaction: number;
  security: number;
  income: number;
  upkeep: number;
  processing_power: number;
}

export interface PlacedBuilding {
  id: string;
  type: BuildingType;
  position: { x: number; z: number };
  rotation: number;
  isComplete: boolean;
}

export interface MapTile {
  x: number;
  z: number;
  terrain: TerrainType;
  buildingId?: string;
}

export interface GameState {
  // Game meta
  playerName: string;
  companyName: string;
  level: number;
  incubatorLevel: number;
  cashPerSecond: number;
  
  // Game resources and stats
  resources: GameResources;
  stats: GameStats;
  
  // Map and buildings
  mapSize: { width: number; height: number };
  map: MapTile[][];
  buildings: PlacedBuilding[];
  
  // UI state
  selectedBuildingType: BuildingType | null;
  selectedBuildingId: string | null;
  cameraPosition: { x: number; y: number; z: number };
  cameraRotation: number;
  cameraZoom: number;
  
  // Game actions
  initializeGame: (playerName: string, companyName: string) => void;
  collectResources: () => void;
  addResources: (resources: Partial<GameResources>) => void;
  placeBuilding: (type: BuildingType, position: { x: number; z: number }, rotation: number) => void;
  removeBuilding: (id: string) => void;
  selectBuildingType: (type: BuildingType | null) => void;
  selectBuilding: (id: string | null) => void;
  updateCamera: (position?: Partial<{ x: number; y: number; z: number }>, rotation?: number, zoom?: number) => void;
  upgradeIncubator: () => void;
  startCashGeneration: () => void;
  stopCashGeneration: () => void;
}

// Helper function to generate a random map
const generateRandomMap = (width: number, height: number): MapTile[][] => {
  const map: MapTile[][] = [];
  
  for (let x = 0; x < width; x++) {
    map[x] = [];
    for (let z = 0; z < height; z++) {
      // Generate random terrain with bias towards campus lawn
      let terrain: TerrainType;
      const rand = Math.random();
      
      if (rand < 0.6) {
        terrain = TerrainType.CAMPUS_LAWN;
      } else if (rand < 0.7) {
        terrain = TerrainType.CONCRETE;
      } else if (rand < 0.8) {
        terrain = TerrainType.TECH_PARK;
      } else if (rand < 0.85) {
        terrain = TerrainType.LAKE;
      } else if (rand < 0.9) {
        terrain = TerrainType.SILICON_HILLS;
      } else if (rand < 0.95) {
        terrain = TerrainType.SOLAR_FIELD;
      } else {
        terrain = TerrainType.SERVER_FARM;
      }
      
      map[x][z] = {
        x,
        z,
        terrain,
      };
    }
  }
  
  // Add some fiber optic networks
  const networkCount = Math.floor(Math.min(width, height) / 2);
  for (let i = 0; i < networkCount; i++) {
    const isHorizontal = Math.random() > 0.5;
    const pos = Math.floor(Math.random() * (isHorizontal ? height : width));
    
    if (isHorizontal) {
      for (let x = 0; x < width; x++) {
        map[x][pos].terrain = TerrainType.FIBER_OPTIC;
      }
    } else {
      for (let z = 0; z < height; z++) {
        map[pos][z].terrain = TerrainType.FIBER_OPTIC;
      }
    }
  }
  
  return map;
};

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  playerName: '',
  companyName: '',
  level: 1,
  incubatorLevel: 1,
  cashPerSecond: 10, // Start with 10 cash per second
  
  resources: {
    cash: 1000, // Start with 1000 cash
    data_tokens: 5000,
    silicon: 1000,
    hardware: 500,
    energy: 200,
    computing_power: 1000,
  },
  
  stats: {
    employees: 10,
    employeeCapacity: 10,
    satisfaction: 50,
    security: 10,
    income: 10,
    upkeep: 5,
    processing_power: 1,
  },
  
  mapSize: { width: 50, height: 50 },
  map: [],
  buildings: [],
  
  selectedBuildingType: null,
  selectedBuildingId: null,
  cameraPosition: { x: 25, y: 15, z: 35 },
  cameraRotation: 0,
  cameraZoom: 10,
  
  // Game actions
  initializeGame: (playerName, companyName) => {
    const mapSize = { width: 50, height: 50 };
    const map = generateRandomMap(mapSize.width, mapSize.height);
    
    // Make sure the center area is buildable
    const centerX = Math.floor(mapSize.width / 2);
    const centerZ = Math.floor(mapSize.height / 2);
    
    console.log(`Initializing game with center at (${centerX}, ${centerZ})`);
    
    for (let x = centerX - 2; x <= centerX + 2; x++) {
      for (let z = centerZ - 2; z <= centerZ + 2; z++) {
        if (x >= 0 && x < mapSize.width && z >= 0 && z < mapSize.height) {
          map[x][z].terrain = TerrainType.CAMPUS_LAWN;
          console.log(`Setting terrain at (${x}, ${z}) to CAMPUS_LAWN`);
        }
      }
    }
    
    // First update the state with the map
    set({
      playerName,
      companyName,
      map,
      buildings: [],
    });
    
    // Then place the headquarters after the map is set in state
    console.log(`Attempting to place headquarters at (${centerX}, ${centerZ})`);
    setTimeout(() => {
      const buildingId = get().placeBuilding(BuildingType.HEADQUARTERS, { x: centerX, z: centerZ }, 0);
      console.log(`Headquarters placed with ID: ${buildingId}`);
      
      // Start generating cash
      get().startCashGeneration();
    }, 100);
  },
  
  collectResources: () => {
    const { resources, stats, buildings } = get();
    
    // Calculate resource generation from buildings
    let siliconIncome = 0;
    let hardwareIncome = 0;
    let energyIncome = 0;
    let dataTokensIncome = stats.income;
    let computingPowerIncome = 0;
    
    // Loop through all buildings to calculate resource generation
    buildings.forEach(building => {
      const buildingData = require('../models/buildings').BUILDINGS[building.type];
      if (buildingData.provides?.resources) {
        const { resources } = buildingData.provides;
        siliconIncome += resources.silicon || 0;
        hardwareIncome += resources.hardware || 0;
        energyIncome += resources.energy || 0;
      }
      
      if (buildingData.income) {
        dataTokensIncome += buildingData.income;
      }
      
      if (buildingData.provides?.computing_power) {
        computingPowerIncome += buildingData.provides.computing_power;
      }
    });
    
    // Update resources
    const newResources = { ...resources };
    newResources.data_tokens += dataTokensIncome;
    newResources.silicon += siliconIncome;
    newResources.hardware += hardwareIncome;
    newResources.energy += energyIncome;
    newResources.computing_power += computingPowerIncome;
    
    set({
      resources: newResources,
    });
    
    // Update level based on number of buildings
    const buildingCount = buildings.length;
    const newLevel = Math.max(1, Math.floor(buildingCount / 3) + 1);
    
    if (newLevel !== get().level) {
      set({
        level: newLevel,
        stats: {
          ...stats,
          processing_power: newLevel,
        }
      });
    }
  },
  
  addResources: (newResources) => {
    set(state => ({
      resources: {
        ...state.resources,
        ...Object.fromEntries(
          Object.entries(newResources).map(([key, value]) => [
            key,
            (state.resources[key as keyof GameResources] || 0) + (value || 0),
          ])
        ),
      },
    }));
  },
  
  placeBuilding: (type, position, rotation) => {
    const { buildings, map, resources } = get();
    const buildingData = require('../models/buildings').BUILDINGS[type];
    
    console.log(`Attempting to place ${type} at (${position.x}, ${position.z})`);
    
    // Check if we have enough resources (skip check for headquarters as it's the starter building)
    if (type !== BuildingType.HEADQUARTERS && (
      resources.cash < (buildingData.cost.cash || 0) ||
      resources.data_tokens < (buildingData.cost.data_tokens || 0) ||
      resources.silicon < (buildingData.cost.silicon || 0) ||
      resources.hardware < (buildingData.cost.hardware || 0) ||
      resources.energy < (buildingData.cost.energy || 0)
    )) {
      console.log('Not enough resources');
      return;
    }
    
    // Get building dimensions
    const { width, length } = buildingData.size;
    console.log(`Building dimensions: ${width}x${length}`);
    
    // Check if the area is clear
    for (let x = position.x; x < position.x + width; x++) {
      for (let z = position.z; z < position.z + length; z++) {
        // Check if out of bounds
        if (x < 0 || x >= map.length || z < 0 || z >= map[0].length) {
          console.log(`Building out of bounds at (${x}, ${z})`);
          return;
        }
        
        // Check if tile is buildable (skip check for headquarters)
        if (map[x][z].buildingId) {
          console.log(`Tile at (${x}, ${z}) already has a building`);
          return;
        }
        
        if (type !== BuildingType.HEADQUARTERS && !TERRAIN[map[x][z].terrain].buildable) {
          console.log(`Tile at (${x}, ${z}) is not buildable (${map[x][z].terrain})`);
          return;
        }
      }
    }
    
    // Deduct resources (skip for headquarters)
    const newResources = { ...resources };
    if (type !== BuildingType.HEADQUARTERS) {
      newResources.cash -= buildingData.cost.cash || 0;
      newResources.data_tokens -= buildingData.cost.data_tokens || 0;
      newResources.silicon -= buildingData.cost.silicon || 0;
      newResources.hardware -= buildingData.cost.hardware || 0;
      newResources.energy -= buildingData.cost.energy || 0;
    }
    
    // Generate unique ID
    const id = `${type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    console.log(`Generated building ID: ${id}`);
    
    const newBuilding: PlacedBuilding = {
      id,
      type,
      position,
      rotation,
      isComplete: true,
    };
    
    // Update map tiles
    for (let x = position.x; x < position.x + width; x++) {
      for (let z = position.z; z < position.z + length; z++) {
        map[x][z].buildingId = id;
        console.log(`Marked tile (${x}, ${z}) with building ID: ${id}`);
      }
    }
    
    // Update stats based on building
    const newStats = { ...get().stats };
    if (buildingData.provides) {
      if (buildingData.provides.employees) {
        newStats.employees += buildingData.provides.employees;
        newStats.employeeCapacity += buildingData.provides.employees;
      }
      
      if (buildingData.provides.satisfaction) {
        newStats.satisfaction += buildingData.provides.satisfaction;
      }
      
      if (buildingData.provides.security) {
        newStats.security += buildingData.provides.security;
      }
    }
    
    if (buildingData.income) {
      newStats.income += buildingData.income;
    }
    
    if (buildingData.upkeep) {
      newStats.upkeep += buildingData.upkeep;
    }
    
    // Add building to list and update state
    set({
      buildings: [...buildings, newBuilding],
      resources: newResources,
      stats: newStats,
    });
    
    return id;
  },
  
  removeBuilding: (id) => {
    const { buildings, map, stats } = get();
    const building = buildings.find(b => b.id === id);
    
    if (!building) {
      console.log('Building not found');
      return;
    }
    
    // Don't allow removing the headquarters
    if (building.type === BuildingType.HEADQUARTERS) {
      console.log('Cannot remove headquarters');
      return;
    }
    
    // Remove building from map
    const buildingData = require('../models/buildings').BUILDINGS[building.type];
    const { width, length } = buildingData.size;
    
    for (let x = building.position.x; x < building.position.x + width; x++) {
      for (let z = building.position.z; z < building.position.z + length; z++) {
        if (x >= 0 && x < map.length && z >= 0 && z < map[0].length) {
          map[x][z].buildingId = undefined;
        }
      }
    }
    
    // Update stats based on removed building
    const newStats = { ...stats };
    if (buildingData.provides) {
      if (buildingData.provides.employees) {
        newStats.employees -= buildingData.provides.employees;
        newStats.employeeCapacity -= buildingData.provides.employees;
      }
      
      if (buildingData.provides.satisfaction) {
        newStats.satisfaction -= buildingData.provides.satisfaction;
      }
      
      if (buildingData.provides.security) {
        newStats.security -= buildingData.provides.security;
      }
    }
    
    if (buildingData.income) {
      newStats.income -= buildingData.income;
    }
    
    if (buildingData.upkeep) {
      newStats.upkeep -= buildingData.upkeep;
    }
    
    // Remove building from list
    set({
      buildings: buildings.filter(b => b.id !== id),
      selectedBuildingId: null,
      stats: newStats,
    });
  },
  
  selectBuildingType: (type) => {
    set({ selectedBuildingType: type });
  },
  
  selectBuilding: (id) => {
    set({ selectedBuildingId: id });
  },
  
  updateCamera: (position, rotation, zoom) => {
    set(state => ({
      cameraPosition: position ? { ...state.cameraPosition, ...position } : state.cameraPosition,
      cameraRotation: rotation !== undefined ? rotation : state.cameraRotation,
      cameraZoom: zoom !== undefined ? zoom : state.cameraZoom,
    }));
  },
  
  upgradeIncubator: () => {
    const { incubatorLevel, resources } = get();
    
    // Calculate upgrade cost based on current level
    const upgradeCost = incubatorLevel * 1000;
    
    // Check if player has enough cash
    if (resources.cash < upgradeCost) {
      console.log(`Not enough cash to upgrade incubator. Need ${upgradeCost}, have ${resources.cash}`);
      return false;
    }
    
    // Deduct cash and increase level
    set(state => ({
      resources: {
        ...state.resources,
        cash: state.resources.cash - upgradeCost
      },
      incubatorLevel: state.incubatorLevel + 1,
      cashPerSecond: state.cashPerSecond + 10 // Each level adds 10 cash per second
    }));
    
    console.log(`Upgraded incubator to level ${incubatorLevel + 1}`);
    return true;
  },
  
  // Cash generation interval ID
  _cashGenerationInterval: null as number | null,
  
  startCashGeneration: () => {
    // Clear any existing interval
    get().stopCashGeneration();
    
    // Start a new interval to generate cash every second
    const intervalId = window.setInterval(() => {
      const { cashPerSecond } = get();
      
      set(state => ({
        resources: {
          ...state.resources,
          cash: state.resources.cash + cashPerSecond
        }
      }));
      
      console.log(`Generated ${cashPerSecond} cash`);
    }, 1000);
    
    // Store the interval ID
    set({ _cashGenerationInterval: intervalId as unknown as number });
    
    console.log('Started cash generation');
  },
  
  stopCashGeneration: () => {
    const { _cashGenerationInterval } = get() as any;
    
    if (_cashGenerationInterval) {
      window.clearInterval(_cashGenerationInterval);
      set({ _cashGenerationInterval: null });
      console.log('Stopped cash generation');
    }
  },
})); 