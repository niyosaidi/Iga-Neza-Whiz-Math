import React, { useState, useCallback } from 'react';
import MainMenu from './components/MainMenu';
import GameScreen from './components/GameScreen';
import ProblemOfTheDay from './components/ProblemOfTheDay';
import { GameMode } from './types';
import { SunIcon, GorillaIcon } from './components/Icons';

const App: React.FC = () => {
  const [screen, setScreen] = useState<'menu' | 'game' | 'daily_problem'>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('addition');
  const [totalScore, setTotalScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('totalScore') || '0', 10);
  });

  const updateScore = useCallback((points: number) => {
    setTotalScore(prevScore => {
      const newScore = Math.max(0, prevScore + points); // Ensure score doesn't go below 0
      localStorage.setItem('totalScore', newScore.toString());
      return newScore;
    });
  }, []);

  const handleStartGame = (mode: GameMode) => {
    setGameMode(mode);
    setScreen('game');
  };

  const handleShowDailyProblem = () => {
    setScreen('daily_problem');
  };

  const handleBackToMenu = () => {
    setScreen('menu');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'game':
        return <GameScreen mode={gameMode} onBack={handleBackToMenu} updateScore={updateScore} />;
      case 'daily_problem':
        return <ProblemOfTheDay onBack={handleBackToMenu} updateScore={updateScore} />;
      case 'menu':
      default:
        return <MainMenu onStartGame={handleStartGame} onShowDailyProblem={handleShowDailyProblem} totalScore={totalScore} />;
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 text-gray-800 flex flex-col items-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/aztec.png')] opacity-5"></div>
       <header className="w-full max-w-4xl mx-auto z-10">
        <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-md border-2 border-yellow-300">
           <div className="flex items-center gap-2">
            <div className="w-12 h-12 text-yellow-500">
             <GorillaIcon />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-green-700 tracking-tight">
                Iga Neza <span className="text-yellow-600">Math Whiz</span>
            </h1>
           </div>
           <div className="flex items-center gap-2 text-yellow-500">
                <SunIcon className="w-8 h-8"/>
           </div>
        </div>
      </header>
      <main className="w-full max-w-4xl mx-auto flex-grow flex items-center justify-center z-10 py-8">
        {renderScreen()}
      </main>
    </div>
  );
};

export default App;