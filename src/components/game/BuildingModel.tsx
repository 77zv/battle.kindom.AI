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
  
  const { type, position, rotation, constructionProgress, isComplete } = building;
  const buildingData = BUILDINGS[type];
  
  // Get building dimensions
  const { width, length } = buildingData.size;
  
  // Calculate building height based on type
  const getHeight = () => {
    switch (type) {
      case BuildingType.CASTLE:
        return 2.5;
      case BuildingType.TOWER:
        return 3;
      case BuildingType.CHURCH:
        return 2.2;
      case BuildingType.BARRACKS:
      case BuildingType.BLACKSMITH:
      case BuildingType.MARKET:
      case BuildingType.TAVERN:
        return 1.5;
      default:
        return 1;
    }
  };
  
  const height = getHeight();
  
  // Get building color based on type
  const getColor = () => {
    switch (type) {
      case BuildingType.CASTLE:
        return '#9E9E9E'; // Gray stone
      case BuildingType.HOUSE:
        return '#8D6E63'; // Brown wood
      case BuildingType.FARM:
        return '#A5D6A7'; // Light green
      case BuildingType.BLACKSMITH:
        return '#5D4037'; // Dark brown
      case BuildingType.MARKET:
        return '#FFCC80'; // Light orange
      case BuildingType.TAVERN:
        return '#D7CCC8'; // Light brown
      case BuildingType.CHURCH:
        return '#EEEEEE'; // Off-white
      case BuildingType.BARRACKS:
        return '#78909C'; // Blue-gray
      case BuildingType.WALL:
      case BuildingType.TOWER:
        return '#BDBDBD'; // Light gray
      case BuildingType.MINE:
        return '#616161'; // Dark gray
      case BuildingType.MILL:
        return '#BCAAA4'; // Taupe
      case BuildingType.STABLE:
        return '#795548'; // Brown
      default:
        return '#FFFFFF'; // White
    }
  };
  
  const color = getColor();
  
  // Calculate construction progress visual effect
  const constructionHeight = useMemo(() => {
    return isComplete ? height : (height * (constructionProgress / 100));
  }, [height, constructionProgress, isComplete]);
  
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
        position={[0, constructionHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width * 0.9, constructionHeight, length * 0.9]} />
        <meshStandardMaterial 
          color={hovered ? '#FFFFFF' : color} 
          emissive={isSelected ? '#FFD700' : (hovered ? '#FFEB3B' : '#000000')}
          emissiveIntensity={isSelected ? 0.5 : (hovered ? 0.3 : 0)}
          wireframe={!isComplete}
        />
      </mesh>
      
      {/* Roof for completed buildings */}
      {isComplete && (
        <mesh
          position={[0, height, 0]}
          castShadow
        >
          {type === BuildingType.CHURCH ? (
            <coneGeometry args={[Math.min(width, length) * 0.5, 1, 4]} />
          ) : (
            <coneGeometry args={[Math.max(width, length) * 0.5, height * 0.5, 4]} />
          )}
          <meshStandardMaterial color="#B71C1C" /> {/* Red roof */}
        </mesh>
      )}
      
      {/* Special features for certain buildings */}
      {isComplete && type === BuildingType.CASTLE && (
        <>
          {/* Castle towers */}
          {[
            [width * 0.4, height * 0.8, length * 0.4],
            [width * 0.4, height * 0.8, -length * 0.4],
            [-width * 0.4, height * 0.8, length * 0.4],
            [-width * 0.4, height * 0.8, -length * 0.4],
          ].map((pos, i) => (
            <mesh key={i} position={pos} castShadow>
              <cylinderGeometry args={[0.2, 0.3, 1, 8]} />
              <meshStandardMaterial color="#757575" />
            </mesh>
          ))}
        </>
      )}
      
      {/* Construction progress indicator */}
      {!isComplete && (
        <mesh position={[0, height * 1.2, 0]}>
          <boxGeometry args={[width, 0.1, 0.1]} />
          <meshBasicMaterial color="#FF5252" />
          
          <mesh position={[-width / 2 + (width * constructionProgress / 100) / 2, 0, 0]}>
            <boxGeometry args={[width * constructionProgress / 100, 0.1, 0.1]} />
            <meshBasicMaterial color="#4CAF50" />
          </mesh>
        </mesh>
      )}
    </group>
  );
} 