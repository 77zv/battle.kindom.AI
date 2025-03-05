"use client";

import { useState } from 'react';
import { useGameStore } from '@/lib/game/state/gameStore';
import { BUILDINGS, BuildingType } from '@/lib/game/models/buildings';

export default function GameUI() {
  const [showBuildMenu, setShowBuildMenu] = useState(false);
  const [showResourcesMenu, setShowResourcesMenu] = useState(true);
  const [showControls, setShowControls] = useState(false);
  
  const playerName = useGameStore(state => state.playerName);
  const companyName = useGameStore(state => state.companyName);
  const level = useGameStore(state => state.level);
  const townHallLevel = useGameStore(state => state.townHallLevel);
  const goldPerSecond = useGameStore(state => state.goldPerSecond);
  const resources = useGameStore(state => state.resources);
  const stats = useGameStore(state => state.stats);
  const selectedBuildingType = useGameStore(state => state.selectedBuildingType);
  const selectedBuildingId = useGameStore(state => state.selectedBuildingId);
  const buildings = useGameStore(state => state.buildings);
  
  const selectBuildingType = useGameStore(state => state.selectBuildingType);
  const removeBuilding = useGameStore(state => state.removeBuilding);
  const collectResources = useGameStore(state => state.collectResources);
  const upgradeTownHall = useGameStore(state => state.upgradeTownHall);
  
  // Calculate upgrade cost
  const townHallUpgradeCost = townHallLevel * 1000;
  
  // Get selected building
  const selectedBuilding = selectedBuildingId 
    ? buildings.find(b => b.id === selectedBuildingId) 
    : null;
  
  // Filter buildings by unlock level
  const availableBuildings = Object.values(BUILDINGS).filter(
    building => building.unlockLevel <= level
  );
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top bar with resources */}
      <div className="absolute top-0 left-0 right-0 bg-stone-800/80 text-amber-50 p-2 flex justify-between items-center pointer-events-auto">
        <div className="flex items-center space-x-4">
          <div className="font-bold">Kingdom: {companyName}</div>
          <div>Level: {level}</div>
          <div className="text-yellow-400">Gold: {resources.gold.toLocaleString()}</div>
          <div className="text-yellow-300">+{goldPerSecond}/sec</div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => upgradeTownHall()}
            disabled={resources.gold < townHallUpgradeCost}
            className={`px-2 py-1 rounded text-sm ${
              resources.gold >= townHallUpgradeCost 
                ? 'bg-amber-600 hover:bg-amber-500' 
                : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            Upgrade Town Hall (Level {townHallLevel}) - {townHallUpgradeCost.toLocaleString()} Gold
          </button>
          
          <button 
            onClick={() => setShowControls(!showControls)}
            className="px-2 py-1 bg-stone-700 hover:bg-stone-600 rounded text-sm"
          >
            {showControls ? 'Hide Controls' : 'Controls'}
          </button>
          <button 
            onClick={() => setShowResourcesMenu(!showResourcesMenu)}
            className="px-2 py-1 bg-amber-700 hover:bg-amber-800 rounded text-sm"
          >
            {showResourcesMenu ? 'Hide Resources' : 'Show Resources'}
          </button>
        </div>
      </div>
      
      {/* Controls help panel */}
      {showControls && (
        <div className="absolute top-12 left-0 bg-stone-800/80 text-amber-50 p-3 rounded-br-lg pointer-events-auto">
          <h3 className="font-bold mb-2 text-amber-400">Controls</h3>
          <div className="text-sm space-y-1">
            <div className="flex items-center">
              <span className="w-36">↑ or W</span>
              <span>Move Forward</span>
            </div>
            <div className="flex items-center">
              <span className="w-36">↓ or S</span>
              <span>Move Backward</span>
            </div>
            <div className="flex items-center">
              <span className="w-36">← or A</span>
              <span>Move Left</span>
            </div>
            <div className="flex items-center">
              <span className="w-36">→ or D</span>
              <span>Move Right</span>
            </div>
            <div className="flex items-center">
              <span className="w-36">Q</span>
              <span>Move Up</span>
            </div>
            <div className="flex items-center">
              <span className="w-36">E</span>
              <span>Move Down</span>
            </div>
            <div className="flex items-center">
              <span className="w-36">Right Mouse</span>
              <span>Rotate Camera</span>
            </div>
            <div className="flex items-center">
              <span className="w-36">Mouse Wheel</span>
              <span>Zoom In/Out</span>
            </div>
            <div className="flex items-center">
              <span className="w-36">Left Click</span>
              <span>Select/Place Buildings</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Resources panel */}
      {showResourcesMenu && (
        <div className="absolute top-12 right-0 bg-stone-800/80 text-amber-50 p-3 rounded-bl-lg pointer-events-auto">
          <h3 className="font-bold mb-2 text-amber-400">Resources</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            <div className="flex justify-between">
              <span>Gold:</span>
              <span className="text-yellow-400">{resources.gold.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Gold/sec:</span>
              <span className="text-yellow-300">+{goldPerSecond}/sec</span>
            </div>
            <div className="flex justify-between">
              <span>Resources:</span>
              <span className="text-green-300">{resources.resources}</span>
            </div>
          </div>
          
          <h3 className="font-bold mt-4 mb-2 text-amber-400">Town Stats</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            <div className="flex justify-between">
              <span>Town Hall Level:</span>
              <span className="text-amber-300">{townHallLevel}</span>
            </div>
            <div className="flex justify-between">
              <span>Villagers:</span>
              <span>{stats.villagers}/{stats.villagerCapacity}</span>
            </div>
            <div className="flex justify-between">
              <span>Satisfaction:</span>
              <span>{stats.satisfaction}%</span>
            </div>
            <div className="flex justify-between">
              <span>Security:</span>
              <span>{stats.security}</span>
            </div>
            <div className="flex justify-between">
              <span>Income:</span>
              <span className="text-green-300">+{stats.income}</span>
            </div>
            <div className="flex justify-between">
              <span>Upkeep:</span>
              <span className="text-red-300">-{stats.upkeep}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom bar with actions */}
      <div className="absolute bottom-0 left-0 right-0 bg-stone-800/80 text-amber-50 p-2 flex justify-between items-center pointer-events-auto">
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowBuildMenu(!showBuildMenu)}
            className={`px-4 py-2 rounded font-medium ${showBuildMenu ? 'bg-amber-600' : 'bg-amber-700 hover:bg-amber-600'}`}
          >
            {showBuildMenu ? 'Cancel Build' : 'Build'}
          </button>
          
          {selectedBuilding && (
            <button 
              onClick={() => removeBuilding(selectedBuilding.id)}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded font-medium"
            >
              Demolish
            </button>
          )}
        </div>
        
        <div>
          <button 
            onClick={collectResources}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded font-medium"
          >
            Collect Resources
          </button>
        </div>
      </div>
      
      {/* Building menu */}
      {showBuildMenu && (
        <div className="absolute bottom-16 left-0 bg-stone-800/90 text-amber-50 p-3 rounded-tr-lg max-h-[60vh] overflow-y-auto pointer-events-auto">
          <h3 className="font-bold mb-3 text-amber-400">Buildings</h3>
          <div className="grid grid-cols-1 gap-2 w-64">
            {availableBuildings.map(building => {
              const isSelected = selectedBuildingType === building.type;
              const canAfford = 
                resources.gold >= (building.cost.cash || 0) &&
                resources.resources >= (building.cost.data_tokens || 0);
              
              return (
                <button
                  key={building.type}
                  onClick={() => selectBuildingType(isSelected ? null : building.type)}
                  className={`p-2 text-left rounded transition-colors ${
                    isSelected 
                      ? 'bg-amber-600' 
                      : canAfford 
                        ? 'bg-stone-700 hover:bg-stone-600' 
                        : 'bg-stone-800 opacity-50 cursor-not-allowed'
                  }`}
                  disabled={!canAfford}
                >
                  <div className="font-medium">{building.name}</div>
                  <div className="text-xs text-amber-200 mt-1">{building.description}</div>
                  
                  <div className="text-xs mt-1 space-y-1">
                    {building.cost.cash > 0 && (
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1"></span>
                        <span className={resources.gold >= building.cost.cash ? 'text-white' : 'text-red-400'}>
                          Gold: {building.cost.cash.toLocaleString()}
                        </span>
                      </div>
                    )}
                    
                    {building.cost.data_tokens > 0 && (
                      <div className={resources.resources >= building.cost.data_tokens ? 'text-green-300' : 'text-red-400'}>
                        Resources: {building.cost.data_tokens}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Building details */}
      {selectedBuilding && (
        <div className="absolute bottom-16 right-0 bg-stone-800/90 text-amber-50 p-3 rounded-tl-lg pointer-events-auto w-64">
          <h3 className="font-bold mb-2 text-amber-400">{BUILDINGS[selectedBuilding.type].name}</h3>
          <p className="text-sm">{BUILDINGS[selectedBuilding.type].description}</p>
          
          {BUILDINGS[selectedBuilding.type].provides && (
            <div className="mt-3">
              <h4 className="font-medium text-amber-300 mb-1">Provides:</h4>
              <div className="grid grid-cols-2 gap-x-2 text-sm">
                {BUILDINGS[selectedBuilding.type].provides.employees && (
                  <div>Villagers: +{BUILDINGS[selectedBuilding.type].provides.employees}</div>
                )}
                {BUILDINGS[selectedBuilding.type].provides.satisfaction && (
                  <div>Satisfaction: +{BUILDINGS[selectedBuilding.type].provides.satisfaction}%</div>
                )}
                {BUILDINGS[selectedBuilding.type].provides.security && (
                  <div>Security: +{BUILDINGS[selectedBuilding.type].provides.security}</div>
                )}
              </div>
            </div>
          )}
          
          {BUILDINGS[selectedBuilding.type].income > 0 && (
            <div className="mt-2 text-sm">
              <span className="text-amber-300">Income:</span> +{BUILDINGS[selectedBuilding.type].income} resources
            </div>
          )}
          
          {BUILDINGS[selectedBuilding.type].upkeep > 0 && (
            <div className="mt-2 text-sm">
              <span className="text-amber-300">Upkeep:</span> -{BUILDINGS[selectedBuilding.type].upkeep} resources
            </div>
          )}
        </div>
      )}
    </div>
  );
} 