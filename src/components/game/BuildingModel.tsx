"use client";

import { useState, useMemo } from 'react';
import { PlacedBuilding } from '@/lib/game/state/gameStore';
import { BUILDINGS, BuildingType } from '@/lib/game/models/buildings';

interface BuildingModelProps {
  building: PlacedBuilding;
  isSelected: boolean;
  onClick: () => void;
}

export default function BuildingModel({ building, isSelected, onClick }: BuildingModelProps) {
  const [hovered, setHovered] = useState(false);
  
  const { type, position, rotation } = building;
  const buildingData = BUILDINGS[type];
  
  console.log(`BuildingModel rendering: ${type} at position (${position.x}, ${position.z}), rotation: ${rotation}`);
  
  // Get building dimensions
  const { width, length } = buildingData.size;
  
  // Calculate building height based on type
  const getHeight = () => {
    switch (type) {
      case BuildingType.HEADQUARTERS:
        return 2.5;
      case BuildingType.CASTLE:
        return 3.0;
      case BuildingType.CHURCH:
        return 2.2;
      case BuildingType.WATCHTOWER:
        return 3.0;
      case BuildingType.BARRACKS:
        return 1.8;
      default:
        return 1.5;
    }
  };
  
  const height = getHeight();
  console.log(`Building height: ${height}, dimensions: ${width}x${length}`);
  
  // Get building color based on type
  const getColor = () => {
    switch (type) {
      case BuildingType.HEADQUARTERS:
        return '#8B4513'; // Brown for town hall
      case BuildingType.HOUSE:
        return '#A0522D'; // Sienna for wooden houses
      case BuildingType.FARM:
        return '#DAA520'; // Goldenrod for farms
      case BuildingType.BLACKSMITH:
        return '#696969'; // DimGray for blacksmith
      case BuildingType.MARKET:
        return '#CD853F'; // Peru for market
      case BuildingType.TAVERN:
        return '#B8860B'; // DarkGoldenrod for tavern
      case BuildingType.CHURCH:
        return '#F5F5DC'; // Beige for church
      case BuildingType.BARRACKS:
        return '#708090'; // SlateGray for barracks
      case BuildingType.WALL:
        return '#A9A9A9'; // DarkGray for wall
      case BuildingType.WATCHTOWER:
        return '#808080'; // Gray for watchtower
      case BuildingType.MINE:
        return '#4B0082'; // Indigo for mine
      case BuildingType.STOREHOUSE:
        return '#D2B48C'; // Tan for storehouse
      case BuildingType.CASTLE:
        return '#778899'; // LightSlateGray for castle
      default:
        return '#FFFFFF'; // White
    }
  };
  
  const color = getColor();
  
  return (
    <group
      position={[position.x, 0.1, position.z]}
      rotation={[0, rotation, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Base building */}
      <mesh
        position={[0, height / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width * 0.9, height, length * 0.9]} />
        <meshStandardMaterial 
          color={hovered ? '#FFFFFF' : color} 
          emissive={isSelected ? '#FFD700' : (hovered ? '#FFEB3B' : '#000000')}
          emissiveIntensity={isSelected ? 0.5 : (hovered ? 0.3 : 0)}
        />
      </mesh>
      
      {/* Roof */}
      <mesh
        position={[0, height, 0]}
        castShadow
      >
        {type === BuildingType.CHURCH ? (
          <coneGeometry args={[Math.min(width, length) * 0.5, 1, 4]} />
        ) : (
          <boxGeometry args={[width * 0.95, height * 0.2, length * 0.95]} />
        )}
        <meshStandardMaterial color="#8B4513" /> {/* Brown wooden roof */}
      </mesh>
      
      {/* Special features for headquarters (town hall) */}
      {type === BuildingType.HEADQUARTERS && (
        <>
          {/* Windows */}
          <mesh position={[0, height * 0.6, length * 0.46]} castShadow>
            <boxGeometry args={[width * 0.7, height * 0.3, 0.1]} />
            <meshStandardMaterial color="#F5DEB3" /> {/* Wheat color for wooden windows */}
          </mesh>
          <mesh position={[0, height * 0.6, -length * 0.46]} castShadow>
            <boxGeometry args={[width * 0.7, height * 0.3, 0.1]} />
            <meshStandardMaterial color="#F5DEB3" />
          </mesh>
          <mesh position={[width * 0.46, height * 0.6, 0]} castShadow>
            <boxGeometry args={[0.1, height * 0.3, length * 0.7]} />
            <meshStandardMaterial color="#F5DEB3" />
          </mesh>
          <mesh position={[-width * 0.46, height * 0.6, 0]} castShadow>
            <boxGeometry args={[0.1, height * 0.3, length * 0.7]} />
            <meshStandardMaterial color="#F5DEB3" />
          </mesh>
          
          {/* Town flag */}
          <mesh position={[0, height * 1.5, 0]} castShadow>
            <boxGeometry args={[0.1, 1, 0.1]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[0.3, height * 1.8, 0]} castShadow>
            <boxGeometry args={[0.6, 0.4, 0.05]} />
            <meshStandardMaterial color="#B22222" /> {/* FireBrick red for flag */}
          </mesh>
        </>
      )}
    </group>
  );
} 