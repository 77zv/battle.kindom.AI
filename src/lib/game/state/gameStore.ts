import { create } from 'zustand';
import { BuildingType } from '../models/buildings';
import { TerrainType, TERRAIN } from '../models/terrain';

export interface GameResources {
  gold: number;
  wood: number;
  stone: number;
  iron: number;
  food: number;
}

export interface GameStats {
  population: number;
  populationCapacity: number;
  happiness: number;
  defense: number;
  income: number;
  upkeep: number;
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
  kingdomName: string;
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
  initializeGame: (playerName: string, kingdomName: string) => void;
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
      // Generate random terrain with bias towards grass
      let terrain: TerrainType;
      const rand = Math.random();
      
      if (rand < 0.6) {
        terrain = TerrainType.GRASS;
      } else if (rand < 0.7) {
        terrain = TerrainType.DIRT;
      } else if (rand < 0.8) {
        terrain = TerrainType.FOREST;
      } else if (rand < 0.85) {
        terrain = TerrainType.WATER;
      } else if (rand < 0.9) {
        terrain = TerrainType.MOUNTAIN;
      } else if (rand < 0.95) {
        terrain = TerrainType.SAND;
      } else {
        terrain = TerrainType.SNOW;
      }
      
      map[x][z] = {
        x,
        z,
        terrain,
      };
    }
  }
  
  // Add some roads
  const roadCount = Math.floor(Math.min(width, height) / 2);
  for (let i = 0; i < roadCount; i++) {
    const isHorizontal = Math.random() > 0.5;
    const pos = Math.floor(Math.random() * (isHorizontal ? height : width));
    
    if (isHorizontal) {
      for (let x = 0; x < width; x++) {
        map[x][pos].terrain = TerrainType.ROAD;
      }
    } else {
      for (let z = 0; z < height; z++) {
        map[pos][z].terrain = TerrainType.ROAD;
      }
    }
  }
  
  return map;
};

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  playerName: '',
  kingdomName: '',
  day: 1,
  level: 1,
  experience: 0,
  
  resources: {
    gold: 1000,
    wood: 200,
    stone: 100,
    iron: 50,
    food: 500,
  },
  
  stats: {
    population: 10,
    populationCapacity: 10,
    happiness: 50,
    defense: 10,
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
  initializeGame: (playerName, kingdomName) => {
    const mapSize = { width: 50, height: 50 };
    const map = generateRandomMap(mapSize.width, mapSize.height);
    
    set({
      playerName,
      kingdomName,
      map,
      buildings: [],
      day: 1,
    });
    
    // Place initial castle at the center
    const centerX = Math.floor(mapSize.width / 2);
    const centerZ = Math.floor(mapSize.height / 2);
    
    // Make sure the center area is buildable
    for (let x = centerX - 2; x <= centerX + 2; x++) {
      for (let z = centerZ - 2; z <= centerZ + 2; z++) {
        if (x >= 0 && x < mapSize.width && z >= 0 && z < mapSize.height) {
          map[x][z].terrain = TerrainType.GRASS;
        }
      }
    }
    
    // Place the castle
    get().placeBuilding(BuildingType.CASTLE, { x: centerX, z: centerZ }, 0);
    
    // Complete the castle immediately
    const castleId = get().buildings[0]?.id;
    if (castleId) {
      get().updateBuildingProgress(castleId, 100);
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
    newResources.gold += netIncome;
    newResources.food -= stats.population; // Each person consumes 1 food per day
    
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
    
    // Check for level up
    if (day % 10 === 0) {
      set(state => ({
        level: state.level + 1,
        experience: 0,
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
    const { buildings, map, mapSize } = get();
    const { x, z } = position;
    
    // Check if position is valid
    if (x < 0 || x >= mapSize.width || z < 0 || z >= mapSize.height) {
      return;
    }
    
    // Check if the tile is buildable
    const tile = map[x][z];
    if (!tile || tile.buildingId || !TERRAIN[tile.terrain].buildable) {
      return;
    }
    
    // Create new building
    const newBuilding: PlacedBuilding = {
      id: `building_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type,
      position,
      rotation,
      constructionProgress: 0,
      isComplete: false,
    };
    
    // Update map tile with building reference
    map[x][z].buildingId = newBuilding.id;
    
    // Add building to state
    set({
      buildings: [...buildings, newBuilding],
      map,
    });
    
    return newBuilding.id;
  },
  
  removeBuilding: (id) => {
    const { buildings, map } = get();
    const building = buildings.find(b => b.id === id);
    
    if (!building) return;
    
    // Remove building reference from map
    const { x, z } = building.position;
    if (map[x] && map[x][z]) {
      map[x][z].buildingId = undefined;
    }
    
    // Remove building from state
    set({
      buildings: buildings.filter(b => b.id !== id),
      map,
      selectedBuildingId: get().selectedBuildingId === id ? null : get().selectedBuildingId,
    });
  },
  
  updateBuildingProgress: (id, progress) => {
    set(state => ({
      buildings: state.buildings.map(building => 
        building.id === id 
          ? { 
              ...building, 
              constructionProgress: progress, 
              isComplete: progress >= 100 
            } 
          : building
      ),
    }));
  },
  
  selectBuildingType: (type) => {
    set({ selectedBuildingType: type });
  },
  
  selectBuilding: (id) => {
    set({ selectedBuildingId: id });
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