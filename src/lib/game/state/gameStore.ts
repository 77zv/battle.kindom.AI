import { create } from 'zustand';
import { BuildingType } from '../models/buildings';
import { TerrainType, TERRAIN } from '../models/terrain';

export interface GameResources {
  gold: number;
  resources: number;
}

export interface GameStats {
  villagers: number;
  villagerCapacity: number;
  satisfaction: number;
  security: number;
  income: number;
  upkeep: number;
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
  townHallLevel: number;
  goldPerSecond: number;
  
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
  upgradeTownHall: () => void;
  startGoldGeneration: () => void;
  stopGoldGeneration: () => void;
}

// Helper function to generate a random map
const generateRandomMap = (width: number, height: number): MapTile[][] => {
  const map: MapTile[][] = [];
  
  for (let x = 0; x < width; x++) {
    map[x] = [];
    for (let z = 0; z < height; z++) {
      // Generate random terrain with bias towards grassland
      let terrain: TerrainType;
      const rand = Math.random();
      
      if (rand < 0.6) {
        terrain = TerrainType.GRASSLAND;
      } else if (rand < 0.7) {
        terrain = TerrainType.DIRT_ROAD;
      } else if (rand < 0.8) {
        terrain = TerrainType.FOREST;
      } else if (rand < 0.85) {
        terrain = TerrainType.RIVER;
      } else if (rand < 0.9) {
        terrain = TerrainType.HILLS;
      } else if (rand < 0.95) {
        terrain = TerrainType.FARMLAND;
      } else {
        terrain = TerrainType.MOUNTAINS;
      }
      
      map[x][z] = {
        x,
        z,
        terrain,
      };
    }
  }
  
  // Add some stone paths
  const pathCount = Math.floor(Math.min(width, height) / 2);
  for (let i = 0; i < pathCount; i++) {
    const isHorizontal = Math.random() > 0.5;
    const pos = Math.floor(Math.random() * (isHorizontal ? height : width));
    
    if (isHorizontal) {
      for (let x = 0; x < width; x++) {
        map[x][pos].terrain = TerrainType.STONE_PATH;
      }
    } else {
      for (let z = 0; z < height; z++) {
        map[pos][z].terrain = TerrainType.STONE_PATH;
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
  townHallLevel: 1,
  goldPerSecond: 10, // Start with 10 gold per second
  
  resources: {
    gold: 1000, // Start with 1000 gold
    resources: 5000,
  },
  
  stats: {
    villagers: 10,
    villagerCapacity: 10,
    satisfaction: 50,
    security: 10,
    income: 10,
    upkeep: 5,
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
          map[x][z].terrain = TerrainType.GRASSLAND;
          console.log(`Setting terrain at (${x}, ${z}) to GRASSLAND`);
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
      
      // Start generating gold
      get().startGoldGeneration();
    }, 100);
  },
  
  collectResources: () => {
    const { resources, stats, buildings } = get();
    
    // Calculate resource generation from buildings
    let resourcesIncome = stats.income;
    
    // Loop through all buildings to calculate resource generation
    buildings.forEach(building => {
      const buildingData = require('../models/buildings').BUILDINGS[building.type];
      
      if (buildingData.income) {
        resourcesIncome += buildingData.income;
      }
    });
    
    // Update resources
    const newResources = { ...resources };
    newResources.resources += resourcesIncome;
    
    set({
      resources: newResources,
    });
    
    // Update level based on number of buildings
    const buildingCount = buildings.length;
    const newLevel = Math.max(1, Math.floor(buildingCount / 3) + 1);
    
    if (newLevel !== get().level) {
      set({
        level: newLevel,
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
      resources.gold < (buildingData.cost.cash || 0) ||
      resources.resources < (buildingData.cost.data_tokens || 0)
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
      newResources.gold -= buildingData.cost.cash || 0;
      newResources.resources -= buildingData.cost.data_tokens || 0;
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
        newStats.villagers += buildingData.provides.employees;
        newStats.villagerCapacity += buildingData.provides.employees;
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
        newStats.villagers -= buildingData.provides.employees;
        newStats.villagerCapacity -= buildingData.provides.employees;
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
  
  upgradeTownHall: () => {
    const { townHallLevel, resources } = get();
    
    // Calculate upgrade cost based on current level
    const upgradeCost = townHallLevel * 1000;
    
    // Check if player has enough gold
    if (resources.gold < upgradeCost) {
      console.log(`Not enough gold to upgrade town hall. Need ${upgradeCost}, have ${resources.gold}`);
      return false;
    }
    
    // Deduct gold and increase level
    set(state => ({
      resources: {
        ...state.resources,
        gold: state.resources.gold - upgradeCost
      },
      townHallLevel: state.townHallLevel + 1,
      goldPerSecond: state.goldPerSecond + 10 // Each level adds 10 gold per second
    }));
    
    console.log(`Upgraded town hall to level ${townHallLevel + 1}`);
    return true;
  },
  
  // Gold generation interval ID
  _goldGenerationInterval: null as number | null,
  
  startGoldGeneration: () => {
    // Clear any existing interval
    get().stopGoldGeneration();
    
    // Start a new interval to generate gold every second
    const intervalId = window.setInterval(() => {
      const { goldPerSecond } = get();
      
      set(state => ({
        resources: {
          ...state.resources,
          gold: state.resources.gold + goldPerSecond
        }
      }));
      
      console.log(`Generated ${goldPerSecond} gold`);
    }, 1000);
    
    // Store the interval ID
    set({ _goldGenerationInterval: intervalId as unknown as number });
    
    console.log('Started gold generation');
  },
  
  stopGoldGeneration: () => {
    const { _goldGenerationInterval } = get() as any;
    
    if (_goldGenerationInterval) {
      window.clearInterval(_goldGenerationInterval);
      set({ _goldGenerationInterval: null });
      console.log('Stopped gold generation');
    }
  },
})); 