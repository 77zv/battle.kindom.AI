"use client";

import { useState } from 'react';

interface StartScreenProps {
  onStartGame: (playerName: string, kingdomName: string) => void;
}

export default function StartScreen({ onStartGame }: StartScreenProps) {
  const [playerName, setPlayerName] = useState('');
  const [kingdomName, setKingdomName] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!kingdomName.trim()) {
      setError('Please name your kingdom');
      return;
    }
    
    onStartGame(playerName, kingdomName);
  };
  
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-stone-900 text-amber-100 p-4">
      <div className="max-w-md w-full bg-stone-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center text-amber-400">Medieval Tycoon</h1>
        <p className="mb-8 text-center italic">Build your medieval kingdom and lead it to prosperity</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="playerName" className="block mb-2 font-medium">
              Your Name
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-2 bg-stone-700 rounded border border-stone-600 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-amber-100"
              placeholder="Enter your name"
            />
          </div>
          
          <div>
            <label htmlFor="kingdomName" className="block mb-2 font-medium">
              Kingdom Name
            </label>
            <input
              type="text"
              id="kingdomName"
              value={kingdomName}
              onChange={(e) => setKingdomName(e.target.value)}
              className="w-full px-4 py-2 bg-stone-700 rounded border border-stone-600 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-amber-100"
              placeholder="Name your kingdom"
            />
          </div>
          
          {error && (
            <div className="text-red-400 text-sm font-medium">{error}</div>
          )}
          
          <button
            type="submit"
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          >
            Start Your Kingdom
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-stone-400">
          <p>Use WASD or arrow keys to move around</p>
          <p>Use Space to move up, Shift to move down</p>
          <p>Left mouse button to rotate the camera</p>
          <p>Right mouse button to pan the camera</p>
          <p>Mouse wheel to zoom in/out</p>
          <p>Click on terrain to build structures</p>
        </div>
      </div>
    </div>
  );
} 