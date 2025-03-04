"use client";

import { useState } from 'react';
import { TerrainType } from '@/lib/game/models/terrain';

interface TerrainTileProps {
  position: [number, number, number];
  terrainType: TerrainType;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function TerrainTile({ position, terrainType, color, isSelected, onClick }: TerrainTileProps) {
  const [hovered, setHovered] = useState(false);
  
  // Adjust height based on terrain type
  let height = 0.1; // Default height
  
  if (terrainType === TerrainType.MOUNTAIN) {
    height = 0.8;
  } else if (terrainType === TerrainType.FOREST) {
    height = 0.4;
  } else if (terrainType === TerrainType.WATER) {
    height = 0.05;
    position[1] = -0.05; // Lower water level
  }
  
  // Determine if tile is buildable
  const isBuildable = [TerrainType.GRASS, TerrainType.DIRT, TerrainType.SAND, TerrainType.SNOW].includes(terrainType);
  
  return (
    <mesh
      position={position}
      receiveShadow
      castShadow
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[0.95, height, 0.95]} />
      <meshStandardMaterial 
        color={hovered ? '#FFFFFF' : color} 
        emissive={isSelected ? '#FFD700' : (hovered && isBuildable ? '#FFEB3B' : '#000000')}
        emissiveIntensity={isSelected ? 0.5 : (hovered && isBuildable ? 0.3 : 0)}
        transparent={terrainType === TerrainType.WATER}
        opacity={terrainType === TerrainType.WATER ? 0.8 : 1}
      />
      
      {/* Add forest details */}
      {terrainType === TerrainType.FOREST && (
        <group position={[0, height / 2, 0]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <coneGeometry args={[0.4, 0.8, 8]} />
            <meshStandardMaterial color="#2E7D32" />
          </mesh>
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.4, 8]} />
            <meshStandardMaterial color="#5D4037" />
          </mesh>
        </group>
      )}
      
      {/* Add mountain details */}
      {terrainType === TerrainType.MOUNTAIN && (
        <mesh position={[0, height / 2, 0]} castShadow>
          <coneGeometry args={[0.5, 0.8, 4]} />
          <meshStandardMaterial color="#9E9E9E" />
        </mesh>
      )}
    </mesh>
  );
} 