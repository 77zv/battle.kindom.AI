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
  const resources = useGameStore(state => state.resources);
  const stats = useGameStore(state => state.stats);
  const selectedBuildingType = useGameStore(state => state.selectedBuildingType);
  const selectedBuildingId = useGameStore(state => state.selectedBuildingId);
  const buildings = useGameStore(state => state.buildings);
  
  const selectBuildingType = useGameStore(state => state.selectBuildingType);
  const removeBuilding = useGameStore(state => state.removeBuilding);
  const collectResources = useGameStore(state => state.collectResources);
  
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
            onClick={collectResources}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded font-medium"
          >
            Collect Resources
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
              const canAfford = 
                resources.data_tokens >= building.cost.data_tokens &&
                resources.silicon >= (building.cost.silicon || 0) &&
                resources.hardware >= (building.cost.hardware || 0) &&
                resources.energy >= (building.cost.energy || 0);
              
              return (
                <button
                  key={building.type}
                  onClick={() => selectBuildingType(isSelected ? null : building.type)}
                  className={`p-2 text-left rounded transition-colors ${
                    isSelected 
                      ? 'bg-blue-600' 
                      : canAfford 
                        ? 'bg-slate-700 hover:bg-slate-600' 
                        : 'bg-slate-800 opacity-50 cursor-not-allowed'
                  }`}
                  disabled={!canAfford}
                >
                  <div className="font-medium">{building.name}</div>
                  <div className="text-xs text-blue-200 mt-1">{building.description}</div>
                  
                  <div className="mt-2 text-xs grid grid-cols-2 gap-x-2">
                    {building.cost.data_tokens > 0 && (
                      <div className={resources.data_tokens >= building.cost.data_tokens ? 'text-yellow-300' : 'text-red-400'}>
                        Data: {building.cost.data_tokens}
                      </div>
                    )}
                    {building.cost.silicon > 0 && (
                      <div className={resources.silicon >= building.cost.silicon ? 'text-green-300' : 'text-red-400'}>
                        Silicon: {building.cost.silicon}
                      </div>
                    )}
                    {building.cost.hardware > 0 && (
                      <div className={resources.hardware >= building.cost.hardware ? 'text-gray-300' : 'text-red-400'}>
                        Hardware: {building.cost.hardware}
                      </div>
                    )}
                    {building.cost.energy > 0 && (
                      <div className={resources.energy >= building.cost.energy ? 'text-blue-300' : 'text-red-400'}>
                        Energy: {building.cost.energy}
                      </div>
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
        <div className="absolute bottom-16 right-0 bg-slate-800/90 text-blue-100 p-3 rounded-tl-lg pointer-events-auto w-64">
          <h3 className="font-bold mb-2 text-blue-400">
            {BUILDINGS[selectedBuilding.type].name}
          </h3>
          <p className="text-sm mb-3">
            {BUILDINGS[selectedBuilding.type].description}
          </p>
          
          {BUILDINGS[selectedBuilding.type].provides && (
            <div className="text-xs">
              <h4 className="font-medium text-blue-300 mb-1">Provides:</h4>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                {BUILDINGS[selectedBuilding.type].provides.employees && (
                  <div>Employees: +{BUILDINGS[selectedBuilding.type].provides.employees}</div>
                )}
                {BUILDINGS[selectedBuilding.type].provides.satisfaction && (
                  <div>Satisfaction: +{BUILDINGS[selectedBuilding.type].provides.satisfaction}%</div>
                )}
                {BUILDINGS[selectedBuilding.type].provides.security && (
                  <div>Security: +{BUILDINGS[selectedBuilding.type].provides.security}</div>
                )}
                {BUILDINGS[selectedBuilding.type].provides.computing_power && (
                  <div>Computing: +{BUILDINGS[selectedBuilding.type].provides.computing_power}</div>
                )}
                {BUILDINGS[selectedBuilding.type].provides.resources?.silicon && (
                  <div className="text-green-300">Silicon: +{BUILDINGS[selectedBuilding.type].provides.resources.silicon}</div>
                )}
                {BUILDINGS[selectedBuilding.type].provides.resources?.hardware && (
                  <div className="text-gray-300">Hardware: +{BUILDINGS[selectedBuilding.type].provides.resources.hardware}</div>
                )}
                {BUILDINGS[selectedBuilding.type].provides.resources?.energy && (
                  <div className="text-blue-300">Energy: +{BUILDINGS[selectedBuilding.type].provides.resources.energy}</div>
                )}
              </div>
            </div>
          )}
          
          {BUILDINGS[selectedBuilding.type].income > 0 && (
            <div className="text-xs mt-2">
              <span className="text-blue-300">Income:</span> <span className="text-green-300">+{BUILDINGS[selectedBuilding.type].income} data tokens</span>
            </div>
          )}
          
          {BUILDINGS[selectedBuilding.type].upkeep > 0 && (
            <div className="text-xs mt-1">
              <span className="text-blue-300">Upkeep:</span> <span className="text-red-300">-{BUILDINGS[selectedBuilding.type].upkeep} data tokens</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 