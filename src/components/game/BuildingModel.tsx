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
      case BuildingType.DATA_CENTER:
        return 2.0;
      case BuildingType.RESEARCH_LAB:
        return 1.8;
      case BuildingType.SERVER_TOWER:
        return 3.0;
      case BuildingType.INNOVATION_CENTER:
        return 2.2;
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
        return '#2196F3'; // Blue for startup incubator
      case BuildingType.OFFICE:
        return '#90CAF9'; // Light blue
      case BuildingType.DATA_CENTER:
        return '#4CAF50'; // Green
      case BuildingType.RESEARCH_LAB:
        return '#9C27B0'; // Purple
      case BuildingType.TECH_HUB:
        return '#00BCD4'; // Cyan
      case BuildingType.CAFETERIA:
        return '#FF9800'; // Orange
      case BuildingType.INNOVATION_CENTER:
        return '#E91E63'; // Pink
      case BuildingType.NETWORKING_EVENT:
        return '#FFEB3B'; // Yellow
      case BuildingType.FIREWALL:
        return '#F44336'; // Red
      case BuildingType.SERVER_TOWER:
        return '#607D8B'; // Blue-gray
      case BuildingType.DATA_MINE:
        return '#795548'; // Brown
      case BuildingType.CLOUD_STORAGE:
        return '#9E9E9E'; // Gray
      case BuildingType.TESLA_GIGAFACTORY:
        return '#212121'; // Dark gray
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
        {type === BuildingType.RESEARCH_LAB ? (
          <coneGeometry args={[Math.min(width, length) * 0.5, 1, 4]} />
        ) : (
          <boxGeometry args={[width * 0.95, height * 0.2, length * 0.95]} />
        )}
        <meshStandardMaterial color="#424242" /> {/* Modern dark roof */}
      </mesh>
      
      {/* Special features for headquarters (startup incubator) */}
      {type === BuildingType.HEADQUARTERS && (
        <>
          {/* Glass windows */}
          <mesh position={[0, height * 0.6, length * 0.46]} castShadow>
            <boxGeometry args={[width * 0.7, height * 0.5, 0.1]} />
            <meshStandardMaterial color="#81D4FA" transparent opacity={0.7} />
          </mesh>
          <mesh position={[0, height * 0.6, -length * 0.46]} castShadow>
            <boxGeometry args={[width * 0.7, height * 0.5, 0.1]} />
            <meshStandardMaterial color="#81D4FA" transparent opacity={0.7} />
          </mesh>
          <mesh position={[width * 0.46, height * 0.6, 0]} castShadow>
            <boxGeometry args={[0.1, height * 0.5, length * 0.7]} />
            <meshStandardMaterial color="#81D4FA" transparent opacity={0.7} />
          </mesh>
          <mesh position={[-width * 0.46, height * 0.6, 0]} castShadow>
            <boxGeometry args={[0.1, height * 0.5, length * 0.7]} />
            <meshStandardMaterial color="#81D4FA" transparent opacity={0.7} />
          </mesh>
          
          {/* Startup logo/sign */}
          <mesh position={[0, height * 1.2, 0]} castShadow>
            <boxGeometry args={[width * 0.4, 0.3, 0.1]} />
            <meshStandardMaterial color="#FF4081" />
          </mesh>
        </>
      )}
    </group>
  );
} 