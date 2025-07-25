
import React from 'react';
import { GameMode } from '../types';
import { PlusIcon, MinusIcon, MultiplyIcon, DivideIcon, BrainIcon } from './Icons';
import Button from './Button';

interface MainMenuProps {
  onStartGame: (mode: GameMode) => void;
  onShowDailyProblem: () => void;
  totalScore: number;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame, onShowDailyProblem, totalScore }) => {
  return (
    <div className="w-full max-w-md text-center bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border-4 border-white">
      <h2 className="text-4xl font-bold text-blue-800 mb-2">Welcome!</h2>
      <p className="text-lg text-gray-600 mb-6">Ready for a challenge?</p>
      
      <div className="mb-8 p-4 bg-yellow-100 border-2 border-yellow-300 rounded-2xl">
        <p className="text-xl font-semibold text-yellow-800">Total Score</p>
        <p className="text-5xl font-bold text-green-600 tracking-tighter">{totalScore}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Button onClick={() => onStartGame('addition')} className="bg-green-500 hover:bg-green-600 text-white">
          <PlusIcon className="w-6 h-6 mr-2" /> Addition
        </Button>
        <Button onClick={() => onStartGame('subtraction')} className="bg-blue-500 hover:bg-blue-600 text-white">
          <MinusIcon className="w-6 h-6 mr-2" /> Subtraction
        </Button>
        <Button onClick={() => onStartGame('multiplication')} className="bg-red-500 hover:bg-red-600 text-white">
          <MultiplyIcon className="w-6 h-6 mr-2" /> Multiplication
        </Button>
        <Button onClick={() => onStartGame('division')} className="bg-purple-500 hover:bg-purple-600 text-white">
          <DivideIcon className="w-6 h-6 mr-2" /> Division
        </Button>
      </div>

      <Button onClick={onShowDailyProblem} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-600 border-b-4">
        <BrainIcon className="w-6 h-6 mr-2" /> Daily Story Problem
      </Button>
    </div>
  );
};

export default MainMenu;
