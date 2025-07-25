
import React, { useState, useEffect, useCallback } from 'react';
import { generateDailyProblem, getExplanation } from '../services/geminiService';
import { DailyProblem } from '../types';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import { ArrowLeftIcon, CheckIcon, IncorrectIcon, LightbulbIcon } from './Icons';

interface ProblemOfTheDayProps {
  onBack: () => void;
  updateScore: (points: number) => void;
}

const ProblemOfTheDay: React.FC<ProblemOfTheDayProps> = ({ onBack, updateScore }) => {
  const [problem, setProblem] = useState<DailyProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  const loadProblem = useCallback(async () => {
    setLoading(true);
    setError(null);
    setProblem(null);
    try {
      const dailyProblem = await generateDailyProblem();
      setProblem(dailyProblem);
    } catch (e) {
      setError('Could not fetch the daily problem. Please try again later.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProblem();
  }, [loadProblem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem) return;
    const userAnswer = parseInt(inputValue, 10);
    if (isNaN(userAnswer)) return;

    if (userAnswer === problem.answer) {
      setFeedback('correct');
      updateScore(50); // More points for the harder daily problem
    } else {
      setFeedback('incorrect');
      updateScore(-5);
    }
  };

  const handleExplain = async () => {
    if (!problem || !inputValue) return;
    setIsExplaining(true);
    setExplanation(null);
    try {
      const explanationText = await getExplanation(
        `${problem.story} ${problem.question}`,
        inputValue
      );
      setExplanation(explanationText);
    } catch (e) {
      setExplanation("Sorry, I couldn't generate an explanation right now.");
      console.error(e);
    } finally {
      setIsExplaining(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-xl text-gray-600">Generating today's story problem...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center bg-red-100 p-8 rounded-2xl">
        <p className="text-red-700 font-semibold">{error}</p>
        <Button onClick={loadProblem} className="mt-4 bg-red-500 hover:bg-red-600 text-white">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border-4 border-white">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={onBack} className="bg-gray-200 hover:bg-gray-300 !p-3">
          <ArrowLeftIcon className="w-6 h-6"/>
        </Button>
        <h2 className="text-3xl font-bold text-yellow-600">Daily Problem</h2>
        <div></div>
      </div>
      
      {problem && (
        <div className="text-left">
          <p className="text-lg text-gray-700 leading-relaxed bg-green-50/50 p-6 rounded-xl border-2 border-green-200 mb-4">{problem.story}</p>
          <p className="text-xl font-semibold text-center text-blue-800 mb-6">{problem.question}</p>
        </div>
      )}

      {feedback !== 'correct' ? (
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="text-center text-3xl font-bold w-full p-4 rounded-2xl border-4 border-gray-300 focus:border-yellow-500 focus:outline-none transition-colors"
            placeholder="Your answer"
          />
          <Button type="submit" className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white">
            Check Answer
          </Button>
        </form>
      ) : (
         <div className="text-center p-6 bg-green-100 rounded-2xl border-2 border-green-300">
            <CheckIcon className="w-20 h-20 mx-auto text-green-500" />
            <p className="text-3xl font-bold text-green-700 mt-2">Amazing! You got it right!</p>
            <p className="text-lg text-green-600">You earned 50 points!</p>
         </div>
      )}

      {feedback === 'incorrect' && (
        <div className="text-center mt-4 p-4 bg-red-100 rounded-2xl border-2 border-red-200">
           <IncorrectIcon className="w-12 h-12 mx-auto text-red-500" />
           <p className="font-semibold text-red-700">Not quite. Try again or ask for a hint!</p>
           <Button onClick={handleExplain} disabled={isExplaining} className="mt-2 bg-blue-500 hover:bg-blue-600 text-white">
            {isExplaining ? <LoadingSpinner /> : <><LightbulbIcon className="w-5 h-5 mr-2"/>Explain it to me</>}
           </Button>
        </div>
      )}

      {explanation && (
        <div className="mt-6 p-6 bg-blue-50 rounded-2xl border-2 border-blue-200">
           <h3 className="text-xl font-bold text-blue-800 mb-2">Here's a hint:</h3>
           <p className="text-blue-900 whitespace-pre-wrap">{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default ProblemOfTheDay;
