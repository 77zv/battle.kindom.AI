"use client";

import { useMemo } from 'react';
import { useGameStore } from '@/lib/game/state/gameStore';
import { TERRAIN } from '@/lib/game/models/terrain';
import { BUILDINGS } from '@/lib/game/models/buildings';
import TerrainTile from './TerrainTile';
import BuildingModel from './BuildingModel';

export default function GameMap() {
  const map = useGameStore(state => state.map);
  const buildings = useGameStore(state => state.buildings);
  const selectBuilding = useGameStore(state => state.selectBuilding);
  const selectedBuildingId = useGameStore(state => state.selectedBuildingId);
  const selectedBuildingType = useGameStore(state => state.selectedBuildingType);
  const placeBuilding = useGameStore(state => state.placeBuilding);
  
  // Debug: Log buildings whenever they change
  console.log(`GameMap rendering with ${buildings.length} buildings:`, buildings);
  
  // Memoize terrain tiles to avoid unnecessary re-renders
  const terrainTiles = useMemo(() => {
    console.log(`Generating terrain tiles for map with dimensions: ${map.length}x${map[0]?.length}`);
    return map.flatMap((column, x) =>
      column.map((tile, z) => (
        <TerrainTile
          key={`terrain-${x}-${z}`}
          position={[x, 0, z]}
          terrainType={tile.terrain}
          color={TERRAIN[tile.terrain].color}
          isSelected={false}
          onClick={() => {
            if (selectedBuildingType) {
              placeBuilding(selectedBuildingType, { x, z }, 0);
            }
          }}
        />
      ))
    );
  }, [map, selectedBuildingType, placeBuilding]);
  
  // Render buildings
  const buildingModels = useMemo(() => {
    console.log(`Generating building models for ${buildings.length} buildings`);
    return buildings.map(building => {
      console.log(`Rendering building: ${building.type} at (${building.position.x}, ${building.position.z})`);
      return (
        <BuildingModel
          key={building.id}
          building={building}
          isSelected={building.id === selectedBuildingId}
          onClick={() => selectBuilding(building.id)}
        />
      );
    });
  }, [buildings, selectedBuildingId, selectBuilding]);
  
  return (
    <group>
      {/* Render ground plane */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[map.length / 2 - 0.5, -0.1, map[0]?.length / 2 - 0.5]} 
        receiveShadow
      >
        <planeGeometry args={[map.length, map[0]?.length]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      
      {/* Render terrain tiles */}
      <group>{terrainTiles}</group>
      
      {/* Render buildings */}
      <group>{buildingModels}</group>
    </group>
  );
} 