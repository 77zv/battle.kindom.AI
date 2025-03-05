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
      <div className="absolute top-0 left-0 right-0 bg-slate-800/80 text-blue-100 p-2 flex justify-between items-center pointer-events-auto">
        <div className="flex items-center space-x-4">
          <div className="font-bold">{companyName}</div>
          <div>Day: {day}</div>
          <div>Level: {level}</div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowControls(!showControls)}
            className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm"
          >
            {showControls ? 'Hide Controls' : 'Controls'}
          </button>
          <button 
            onClick={() => setShowResourcesMenu(!showResourcesMenu)}
            className="px-2 py-1 bg-blue-700 hover:bg-blue-800 rounded text-sm"
          >
            {showResourcesMenu ? 'Hide Resources' : 'Show Resources'}
          </button>
        </div>
      </div>
      
      {/* Controls help panel */}
      {showControls && (
        <div className="absolute top-12 left-0 bg-slate-800/80 text-blue-100 p-3 rounded-br-lg pointer-events-auto">
          <h3 className="font-bold mb-2 text-blue-400">Controls</h3>
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
        <div className="absolute top-12 right-0 bg-slate-800/80 text-blue-100 p-3 rounded-bl-lg pointer-events-auto">
          <h3 className="font-bold mb-2 text-blue-400">Resources</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            <div className="flex justify-between">
              <span>Data Tokens:</span>
              <span className="text-yellow-300">{resources.data_tokens}</span>
            </div>
            <div className="flex justify-between">
              <span>Silicon:</span>
              <span className="text-green-300">{resources.silicon}</span>
            </div>
            <div className="flex justify-between">
              <span>Hardware:</span>
              <span className="text-gray-300">{resources.hardware}</span>
            </div>
            <div className="flex justify-between">
              <span>Energy:</span>
              <span className="text-blue-300">{resources.energy}</span>
            </div>
            <div className="flex justify-between">
              <span>Computing Power:</span>
              <span className="text-red-300">{resources.computing_power}</span>
            </div>
          </div>
          
          <h3 className="font-bold mt-4 mb-2 text-blue-400">Company Stats</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            <div className="flex justify-between">
              <span>Employees:</span>
              <span>{stats.employees}/{stats.employeeCapacity}</span>
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
            <div className="flex justify-between">
              <span>Processing Power:</span>
              <span className="text-purple-300">{stats.processing_power}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom bar with actions */}
      <div className="absolute bottom-0 left-0 right-0 bg-slate-800/80 text-blue-100 p-2 flex justify-between items-center pointer-events-auto">
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowBuildMenu(!showBuildMenu)}
            className={`px-4 py-2 rounded font-medium ${showBuildMenu ? 'bg-blue-600' : 'bg-blue-700 hover:bg-blue-600'}`}
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
        <div className="absolute bottom-16 left-0 bg-slate-800/90 text-blue-100 p-3 rounded-tr-lg max-h-[60vh] overflow-y-auto pointer-events-auto">
          <h3 className="font-bold mb-3 text-blue-400">Buildings</h3>
          <div className="grid grid-cols-1 gap-2 w-64">
            {availableBuildings.map(building => {
              const isSelected = selectedBuildingType === building.type;
              const canAfford = resources.data_tokens >= building.cost.data_tokens &&
                (!building.cost.silicon || resources.silicon >= building.cost.silicon) &&
                (!building.cost.hardware || resources.hardware >= building.cost.hardware) &&
                (!building.cost.energy || resources.energy >= building.cost.energy);
              
              return (
                <button
                  key={building.type}
                  onClick={() => selectBuildingType(isSelected ? null : building.type)}
                  className={`text-left p-2 rounded border ${
                    isSelected 
                      ? 'bg-blue-700 border-blue-500' 
                      : canAfford 
                        ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' 
                        : 'bg-slate-700/50 border-slate-600 opacity-50 cursor-not-allowed'
                  }`}
                  disabled={!canAfford}
                >
                  <div className="font-medium">{building.name}</div>
                  <div className="text-xs text-slate-300 mt-1">{building.description}</div>
                  <div className="text-xs mt-2 flex flex-wrap gap-1">
                    {building.cost.data_tokens > 0 && (
                      <span className={`px-1 rounded ${resources.data_tokens >= building.cost.data_tokens ? 'bg-yellow-900/50' : 'bg-red-900/50'}`}>
                        Data: {building.cost.data_tokens}
                      </span>
                    )}
                    {building.cost.silicon && building.cost.silicon > 0 && (
                      <span className={`px-1 rounded ${!building.cost.silicon || resources.silicon >= building.cost.silicon ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                        Silicon: {building.cost.silicon}
                      </span>
                    )}
                    {building.cost.hardware && building.cost.hardware > 0 && (
                      <span className={`px-1 rounded ${!building.cost.hardware || resources.hardware >= building.cost.hardware ? 'bg-gray-700/50' : 'bg-red-900/50'}`}>
                        Hardware: {building.cost.hardware}
                      </span>
                    )}
                    {building.cost.energy && building.cost.energy > 0 && (
                      <span className={`px-1 rounded ${!building.cost.energy || resources.energy >= building.cost.energy ? 'bg-blue-900/50' : 'bg-red-900/50'}`}>
                        Energy: {building.cost.energy}
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
      {selectedBuilding && !showBuildMenu && (
        <div className="absolute bottom-16 left-0 bg-slate-800/90 text-blue-100 p-3 rounded-tr-lg pointer-events-auto">
          <h3 className="font-bold mb-2 text-blue-400">
            {BUILDINGS[selectedBuilding.type].name}
          </h3>
          <div className="text-sm">
            <p className="mb-2">{BUILDINGS[selectedBuilding.type].description}</p>
            
            {!selectedBuilding.isComplete && (
              <div className="mt-2">
                <div className="text-xs text-slate-300 mb-1">Construction Progress</div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${selectedBuilding.constructionProgress}%` }}
                  ></div>
                </div>
                <div className="text-right text-xs mt-1">
                  {selectedBuilding.constructionProgress}%
                </div>
              </div>
            )}
            
            {selectedBuilding.isComplete && (
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                {BUILDINGS[selectedBuilding.type].income && (
                  <div className="flex justify-between">
                    <span>Income:</span>
                    <span className="text-green-300">+{BUILDINGS[selectedBuilding.type].income}</span>
                  </div>
                )}
                
                {BUILDINGS[selectedBuilding.type].upkeep && (
                  <div className="flex justify-between">
                    <span>Upkeep:</span>
                    <span className="text-red-300">-{BUILDINGS[selectedBuilding.type].upkeep}</span>
                  </div>
                )}
                
                {BUILDINGS[selectedBuilding.type].provides?.employees && (
                  <div className="flex justify-between">
                    <span>Employees:</span>
                    <span>+{BUILDINGS[selectedBuilding.type].provides.employees}</span>
                  </div>
                )}
                
                {BUILDINGS[selectedBuilding.type].provides?.satisfaction && (
                  <div className="flex justify-between">
                    <span>Satisfaction:</span>
                    <span>+{BUILDINGS[selectedBuilding.type].provides.satisfaction}</span>
                  </div>
                )}
                
                {BUILDINGS[selectedBuilding.type].provides?.security && (
                  <div className="flex justify-between">
                    <span>Security:</span>
                    <span>+{BUILDINGS[selectedBuilding.type].provides.security}</span>
                  </div>
                )}
                
                {BUILDINGS[selectedBuilding.type].provides?.computing_power && (
                  <div className="flex justify-between">
                    <span>Computing:</span>
                    <span>+{BUILDINGS[selectedBuilding.type].provides.computing_power}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 