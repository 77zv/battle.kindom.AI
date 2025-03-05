"use client";

import { useState } from 'react';

interface StartScreenProps {
  onStartGame: (playerName: string, companyName: string) => void;
}

export default function StartScreen({ onStartGame }: StartScreenProps) {
  const [playerName, setPlayerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!companyName.trim()) {
      setError('Please name your tech company');
      return;
    }
    
    onStartGame(playerName, companyName);
  };
  
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-900 text-blue-100 p-4">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-400">Silicon Valley Tycoon</h1>
        <p className="mb-8 text-center italic">Build your tech empire and disrupt the industry</p>
        
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
              className="w-full px-4 py-2 bg-slate-700 rounded border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-blue-100"
              placeholder="Enter your name"
            />
          </div>
          
          <div>
            <label htmlFor="companyName" className="block mb-2 font-medium">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 rounded border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-blue-100"
              placeholder="Name your tech company"
            />
          </div>
          
          {error && (
            <div className="text-red-400 text-sm font-medium">{error}</div>
          )}
          
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            Launch Your Startup
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-slate-400">
          <p>Use WASD or arrow keys to move around</p>
          <p>Use Q to move up, E to move down</p>
          <p>Right mouse button to rotate the camera</p>
          <p>Mouse wheel to zoom in/out</p>
          <p>Click on terrain to build structures</p>
        </div>
      </div>
    </div>
  );
} 