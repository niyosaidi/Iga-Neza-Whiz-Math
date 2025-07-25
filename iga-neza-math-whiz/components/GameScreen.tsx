
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameMode, Problem } from '../types';
import Button from './Button';
import { ArrowLeftIcon, CheckIcon, IncorrectIcon, PlusIcon, MinusIcon, MultiplyIcon, DivideIcon } from './Icons';

interface GameScreenProps {
  mode: GameMode;
  onBack: () => void;
  updateScore: (points: number) => void;
}

const generateProblem = (mode: GameMode): Problem => {
  const num1 = Math.floor(Math.random() * 12) + 1;
  const num2 = Math.floor(Math.random() * 12) + 1;
  switch (mode) {
    case 'addition':
      return { text: `${num1} + ${num2} = ?`, answer: num1 + num2 };
    case 'subtraction':
       const max = Math.max(num1, num2);
       const min = Math.min(num1, num2);
      return { text: `${max} - ${min} = ?`, answer: max - min };
    case 'multiplication':
      return { text: `${num1} × ${num2} = ?`, answer: num1 * num2 };
    case 'division':
       const product = num1 * num2;
      return { text: `${product} ÷ ${num2} = ?`, answer: num1 };
  }
};

const GameScreen: React.FC<GameScreenProps> = ({ mode, onBack, updateScore }) => {
  const [problem, setProblem] = useState<Problem>(generateProblem(mode));
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const nextProblem = useCallback(() => {
    setFeedback(null);
    setProblem(generateProblem(mode));
    setInputValue('');
    inputRef.current?.focus();
  }, [mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userAnswer = parseInt(inputValue, 10);
    if (isNaN(userAnswer)) return;

    if (userAnswer === problem.answer) {
      setFeedback('correct');
      setScore(s => s + 10);
      updateScore(10);
      setTimeout(nextProblem, 800);
    } else {
      setFeedback('incorrect');
      updateScore(-2); // Penalty for wrong answer
      setTimeout(() => {
        setFeedback(null);
        setInputValue('');
      }, 1000);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const getModeInfo = () => {
    switch (mode) {
      case 'addition': return { title: 'Addition', color: 'green', Icon: PlusIcon };
      case 'subtraction': return { title: 'Subtraction', color: 'blue', Icon: MinusIcon };
      case 'multiplication': return { title: 'Multiplication', color: 'red', Icon: MultiplyIcon };
      case 'division': return { title: 'Division', color: 'purple', Icon: DivideIcon };
    }
  };

  const { title, color, Icon } = getModeInfo();

  return (
    <div className="w-full max-w-lg bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border-4 border-white text-center">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={onBack} className="bg-gray-200 hover:bg-gray-300 !p-3">
            <ArrowLeftIcon className="w-6 h-6"/>
        </Button>
        <div className={`flex items-center gap-2 text-${color}-500`}>
          <Icon className="w-8 h-8"/>
          <h2 className="text-3xl font-bold">{title}</h2>
        </div>
        <div className="text-2xl font-bold text-yellow-600 bg-yellow-100 px-4 py-2 rounded-xl">
          Score: {score}
        </div>
      </div>
      
      <div className="relative my-10 min-h-[120px] flex items-center justify-center">
        {feedback === null && (
            <p className="text-6xl font-bold text-gray-800 tracking-wider">
                {problem.text}
            </p>
        )}
        {feedback === 'correct' && (
           <div className="text-green-500 animate-pulse">
             <CheckIcon className="w-24 h-24" />
             <p className="text-2xl font-bold mt-2">Correct!</p>
           </div>
        )}
        {feedback === 'incorrect' && (
            <div className="text-red-500 animate-shake">
             <IncorrectIcon className="w-24 h-24" />
             <p className="text-2xl font-bold mt-2">Try Again!</p>
           </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="text-center text-4xl font-bold w-full p-4 rounded-2xl border-4 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
          disabled={feedback !== null}
        />
        <Button type="submit" className={`w-full mt-4 bg-${color}-500 hover:bg-${color}-600 text-white`} disabled={feedback !== null}>
          Check Answer
        </Button>
      </form>
    </div>
  );
};

export default GameScreen;
