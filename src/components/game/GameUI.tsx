"use client";

import { useState } from 'react';
import { useGameStore } from '@/lib/game/state/gameStore';
import { BUILDINGS, BuildingType } from '@/lib/game/models/buildings';

export default function GameUI() {
  const [showBuildMenu, setShowBuildMenu] = useState(false);
  const [showResourcesMenu, setShowResourcesMenu] = useState(true);
  const [showControls, setShowControls] = useState(false);
  
  const playerName = useGameStore(state => state.playerName);
  const kingdomName = useGameStore(state => state.kingdomName);
  const day = useGameStore(state => state.day);
  const level = useGameStore(state => state.level);
  const resources = useGameStore(state => state.resources);
  const stats = useGameStore(state => state.stats);
  const selectedBuildingType = useGameStore(state => state.selectedBuildingType);
  const selectedBuildingId = useGameStore(state => state.selectedBuildingId);
  const buildings = useGameStore(state => state.buildings);
  
  const selectBuildingType = useGameStore(state => state.selectBuildingType);
  const removeBuilding = useGameStore(state => state.removeBuilding);
  const advanceDay = useGameStore(state => state.advanceDay);
  
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
      <div className="absolute top-0 left-0 right-0 bg-stone-800/80 text-amber-100 p-2 flex justify-between items-center pointer-events-auto">
        <div className="flex items-center space-x-4">
          <div className="font-bold">{kingdomName}</div>
          <div>Day: {day}</div>
          <div>Level: {level}</div>
        </div>
        
        <div className="flex space-x-2">
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
        <div className="absolute top-12 left-0 bg-stone-800/80 text-amber-100 p-3 rounded-br-lg pointer-events-auto">
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
              <span className="w-36">Space</span>
              <span>Move Up</span>
            </div>
            <div className="flex items-center">
              <span className="w-36">Shift</span>
              <span>Move Down</span>
            </div>
            <div className="flex items-center">
              <span className="w-36">Left Mouse</span>
              <span>Rotate Camera</span>
            </div>
            <div className="flex items-center">
              <span className="w-36">Right Mouse</span>
              <span>Pan Camera</span>
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
        <div className="absolute top-12 right-0 bg-stone-800/80 text-amber-100 p-3 rounded-bl-lg pointer-events-auto">
          <h3 className="font-bold mb-2 text-amber-400">Resources</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            <div className="flex justify-between">
              <span>Gold:</span>
              <span className="text-yellow-300">{resources.gold}</span>
            </div>
            <div className="flex justify-between">
              <span>Wood:</span>
              <span className="text-green-300">{resources.wood}</span>
            </div>
            <div className="flex justify-between">
              <span>Stone:</span>
              <span className="text-gray-300">{resources.stone}</span>
            </div>
            <div className="flex justify-between">
              <span>Iron:</span>
              <span className="text-blue-300">{resources.iron}</span>
            </div>
            <div className="flex justify-between">
              <span>Food:</span>
              <span className="text-red-300">{resources.food}</span>
            </div>
          </div>
          
          <h3 className="font-bold mt-4 mb-2 text-amber-400">Kingdom Stats</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            <div className="flex justify-between">
              <span>Population:</span>
              <span>{stats.population}/{stats.populationCapacity}</span>
            </div>
            <div className="flex justify-between">
              <span>Happiness:</span>
              <span>{stats.happiness}%</span>
            </div>
            <div className="flex justify-between">
              <span>Defense:</span>
              <span>{stats.defense}</span>
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
      <div className="absolute bottom-0 left-0 right-0 bg-stone-800/80 text-amber-100 p-2 flex justify-between items-center pointer-events-auto">
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
            onClick={advanceDay}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 rounded font-medium"
          >
            Next Day
          </button>
        </div>
      </div>
      
      {/* Building menu */}
      {showBuildMenu && (
        <div className="absolute bottom-16 left-0 bg-stone-800/90 text-amber-100 p-3 rounded-tr-lg max-h-[60vh] overflow-y-auto pointer-events-auto">
          <h3 className="font-bold mb-3 text-amber-400">Buildings</h3>
          <div className="grid grid-cols-1 gap-2 w-64">
            {availableBuildings.map(building => {
              const isSelected = selectedBuildingType === building.type;
              const canAfford = resources.gold >= building.cost.gold &&
                (!building.cost.wood || resources.wood >= building.cost.wood) &&
                (!building.cost.stone || resources.stone >= building.cost.stone) &&
                (!building.cost.iron || resources.iron >= building.cost.iron);
              
              return (
                <button
                  key={building.type}
                  onClick={() => selectBuildingType(isSelected ? null : building.type)}
                  className={`text-left p-2 rounded border ${
                    isSelected 
                      ? 'bg-amber-700 border-amber-500' 
                      : canAfford 
                        ? 'bg-stone-700 border-stone-600 hover:bg-stone-600' 
                        : 'bg-stone-700/50 border-stone-600 opacity-50 cursor-not-allowed'
                  }`}
                  disabled={!canAfford}
                >
                  <div className="font-medium">{building.name}</div>
                  <div className="text-xs text-stone-300 mt-1">{building.description}</div>
                  <div className="text-xs mt-2 flex flex-wrap gap-1">
                    {building.cost.gold > 0 && (
                      <span className={`px-1 rounded ${resources.gold >= building.cost.gold ? 'bg-yellow-900/50' : 'bg-red-900/50'}`}>
                        Gold: {building.cost.gold}
                      </span>
                    )}
                    {building.cost.wood && building.cost.wood > 0 && (
                      <span className={`px-1 rounded ${!building.cost.wood || resources.wood >= building.cost.wood ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                        Wood: {building.cost.wood}
                      </span>
                    )}
                    {building.cost.stone && building.cost.stone > 0 && (
                      <span className={`px-1 rounded ${!building.cost.stone || resources.stone >= building.cost.stone ? 'bg-gray-700/50' : 'bg-red-900/50'}`}>
                        Stone: {building.cost.stone}
                      </span>
                    )}
                    {building.cost.iron && building.cost.iron > 0 && (
                      <span className={`px-1 rounded ${!building.cost.iron || resources.iron >= building.cost.iron ? 'bg-blue-900/50' : 'bg-red-900/50'}`}>
                        Iron: {building.cost.iron}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Selected building info */}
      {selectedBuilding && (
        <div className="absolute bottom-16 right-0 bg-stone-800/90 text-amber-100 p-3 rounded-tl-lg pointer-events-auto">
          <h3 className="font-bold mb-2 text-amber-400">
            {BUILDINGS[selectedBuilding.type].name}
          </h3>
          <p className="text-sm mb-2">{BUILDINGS[selectedBuilding.type].description}</p>
          
          {!selectedBuilding.isComplete && (
            <div className="mb-2">
              <div className="text-sm mb-1">Construction: {selectedBuilding.constructionProgress}%</div>
              <div className="w-full h-2 bg-stone-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500" 
                  style={{ width: `${selectedBuilding.constructionProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {selectedBuilding.isComplete && BUILDINGS[selectedBuilding.type].income && (
            <div className="text-sm text-green-300">
              Income: +{BUILDINGS[selectedBuilding.type].income} gold per day
            </div>
          )}
          
          {selectedBuilding.isComplete && BUILDINGS[selectedBuilding.type].upkeep && (
            <div className="text-sm text-red-300">
              Upkeep: -{BUILDINGS[selectedBuilding.type].upkeep} gold per day
            </div>
          )}
          
          {selectedBuilding.isComplete && BUILDINGS[selectedBuilding.type].provides && (
            <div className="mt-2">
              <div className="text-sm font-medium">Provides:</div>
              <div className="grid grid-cols-2 gap-x-4 text-xs mt-1">
                {BUILDINGS[selectedBuilding.type].provides?.housing && (
                  <div>Housing: +{BUILDINGS[selectedBuilding.type].provides.housing}</div>
                )}
                {BUILDINGS[selectedBuilding.type].provides?.happiness && (
                  <div>Happiness: +{BUILDINGS[selectedBuilding.type].provides.happiness}%</div>
                )}
                {BUILDINGS[selectedBuilding.type].provides?.defense && (
                  <div>Defense: +{BUILDINGS[selectedBuilding.type].provides.defense}</div>
                )}
                {BUILDINGS[selectedBuilding.type].provides?.food && (
                  <div>Food: +{BUILDINGS[selectedBuilding.type].provides.food}</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 