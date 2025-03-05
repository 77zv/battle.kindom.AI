import { create } from 'zustand';
import { BuildingType } from '../models/buildings';
import { TerrainType, TERRAIN } from '../models/terrain';

export interface GameResources {
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
  constructionProgress: number; // 0-100
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
  day: number;
  level: number;
  experience: number;
  
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
  advanceDay: () => void;
  addResources: (resources: Partial<GameResources>) => void;
  placeBuilding: (type: BuildingType, position: { x: number; z: number }, rotation: number) => void;
  removeBuilding: (id: string) => void;
  updateBuildingProgress: (id: string, progress: number) => void;
  selectBuildingType: (type: BuildingType | null) => void;
  selectBuilding: (id: string | null) => void;
  updateCamera: (position?: Partial<{ x: number; y: number; z: number }>, rotation?: number, zoom?: number) => void;
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
  day: 1,
  level: 1,
  experience: 0,
  
  resources: {
    data_tokens: 1000,
    silicon: 200,
    hardware: 100,
    energy: 50,
    computing_power: 500,
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
    
    set({
      playerName,
      companyName,
      map,
      buildings: [],
      day: 1,
    });
    
    // Place initial headquarters at the center
    const centerX = Math.floor(mapSize.width / 2);
    const centerZ = Math.floor(mapSize.height / 2);
    
    // Make sure the center area is buildable
    for (let x = centerX - 2; x <= centerX + 2; x++) {
      for (let z = centerZ - 2; z <= centerZ + 2; z++) {
        if (x >= 0 && x < mapSize.width && z >= 0 && z < mapSize.height) {
          map[x][z].terrain = TerrainType.CAMPUS_LAWN;
        }
      }
    }
    
    // Place the headquarters
    get().placeBuilding(BuildingType.HEADQUARTERS, { x: centerX, z: centerZ }, 0);
    
    // Complete the headquarters immediately
    const hqId = get().buildings[0]?.id;
    if (hqId) {
      get().updateBuildingProgress(hqId, 100);
    }
  },
  
  advanceDay: () => {
    const { resources, stats, buildings, day } = get();
    
    // Calculate daily income and upkeep
    const dailyIncome = stats.income;
    const dailyUpkeep = stats.upkeep;
    const netIncome = dailyIncome - dailyUpkeep;
    
    // Update resources
    const newResources = { ...resources };
    newResources.data_tokens += netIncome;
    newResources.computing_power -= stats.employees; // Each employee consumes 1 computing power per day
    
    // Progress construction on buildings
    const updatedBuildings = buildings.map(building => {
      if (!building.isComplete) {
        const newProgress = Math.min(building.constructionProgress + 5, 100);
        return {
          ...building,
          constructionProgress: newProgress,
          isComplete: newProgress >= 100,
        };
      }
      return building;
    });
    
    set({
      day: day + 1,
      resources: newResources,
      buildings: updatedBuildings,
    });
    
    // Check for level up - processing power increases with level
    if (day % 10 === 0) {
      set(state => ({
        level: state.level + 1,
        experience: 0,
        stats: {
          ...state.stats,
          processing_power: state.level + 1, // Processing power equals level
        }
      }));
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
    const { BUILDINGS } = require('../models/buildings');
    
    const buildingData = BUILDINGS[type];
    
    // Check if we have enough resources
    if (
      resources.data_tokens < buildingData.cost.data_tokens ||
      (buildingData.cost.silicon && resources.silicon < buildingData.cost.silicon) ||
      (buildingData.cost.hardware && resources.hardware < buildingData.cost.hardware) ||
      (buildingData.cost.energy && resources.energy < buildingData.cost.energy)
    ) {
      console.log('Not enough resources to build');
      return;
    }
    
    // Check if the area is buildable
    const { width, length } = buildingData.size;
    for (let x = position.x; x < position.x + width; x++) {
      for (let z = position.z; z < position.z + length; z++) {
        // Check if out of bounds
        if (x < 0 || x >= map.length || z < 0 || z >= map[0].length) {
          console.log('Building out of bounds');
          return;
        }
        
        // Check if terrain is buildable
        const tile = map[x][z];
        if (!TERRAIN[tile.terrain].buildable) {
          console.log('Terrain not buildable');
          return;
        }
        
        // Check if there's already a building
        if (tile.buildingId) {
          console.log('Tile already has a building');
          return;
        }
      }
    }
    
    // Deduct resources
    set(state => ({
      resources: {
        ...state.resources,
        data_tokens: state.resources.data_tokens - buildingData.cost.data_tokens,
        silicon: state.resources.silicon - (buildingData.cost.silicon || 0),
        hardware: state.resources.hardware - (buildingData.cost.hardware || 0),
        energy: state.resources.energy - (buildingData.cost.energy || 0),
      },
    }));
    
    // Create building
    const id = `building_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newBuilding: PlacedBuilding = {
      id,
      type,
      position,
      rotation,
      constructionProgress: 0,
      isComplete: false,
    };
    
    // Update map tiles
    for (let x = position.x; x < position.x + width; x++) {
      for (let z = position.z; z < position.z + length; z++) {
        map[x][z].buildingId = id;
      }
    }
    
    // Add building to list
    set({
      buildings: [...buildings, newBuilding],
    });
    
    return id;
  },
  
  removeBuilding: (id) => {
    const { buildings, map } = get();
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
    
    // Remove building from list
    set({
      buildings: buildings.filter(b => b.id !== id),
      selectedBuildingId: null,
    });
  },
  
  updateBuildingProgress: (id, progress) => {
    const { buildings } = get();
    
    set({
      buildings: buildings.map(building => {
        if (building.id === id) {
          const isComplete = progress >= 100;
          
          // If building is newly completed, update stats
          if (isComplete && !building.isComplete) {
            const buildingData = require('../models/buildings').BUILDINGS[building.type];
            
            // Update stats based on building
            set(state => {
              const newStats = { ...state.stats };
              
              if (buildingData.provides) {
                if (buildingData.provides.employees) {
                  newStats.employeeCapacity += buildingData.provides.employees;
                }
                if (buildingData.provides.satisfaction) {
                  newStats.satisfaction += buildingData.provides.satisfaction;
                }
                if (buildingData.provides.security) {
                  newStats.security += buildingData.provides.security;
                }
                if (buildingData.provides.computing_power) {
                  newStats.processing_power += buildingData.provides.computing_power;
                }
              }
              
              if (buildingData.income) {
                newStats.income += buildingData.income;
              }
              
              if (buildingData.upkeep) {
                newStats.upkeep += buildingData.upkeep;
              }
              
              return { stats: newStats };
            });
          }
          
          return {
            ...building,
            constructionProgress: progress,
            isComplete,
          };
        }
        return building;
      }),
    });
  },
  
  selectBuildingType: (type) => {
    set({
      selectedBuildingType: type,
      selectedBuildingId: null,
    });
  },
  
  selectBuilding: (id) => {
    set({
      selectedBuildingId: id,
      selectedBuildingType: null,
    });
  },
  
  updateCamera: (position, rotation, zoom) => {
    set(state => ({
      cameraPosition: position
        ? {
            x: position.x !== undefined ? position.x : state.cameraPosition.x,
            y: position.y !== undefined ? position.y : state.cameraPosition.y,
            z: position.z !== undefined ? position.z : state.cameraPosition.z,
          }
        : state.cameraPosition,
      cameraRotation: rotation !== undefined ? rotation : state.cameraRotation,
      cameraZoom: zoom !== undefined ? zoom : state.cameraZoom,
    }));
  },
})); 