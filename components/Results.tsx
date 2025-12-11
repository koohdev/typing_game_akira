import React, { useEffect } from 'react';
import { GameResult } from '../types';

interface ResultsProps {
  result: GameResult;
  onRetry: () => void;
  onMenu: () => void;
}

const Results: React.FC<ResultsProps> = ({ result, onRetry, onMenu }) => {
  
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Enter') onRetry();
        if (e.key === 'Escape' || e.key === 'Backspace') onMenu();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onRetry, onMenu]);

  return (
    <div className="absolute inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
        <div className="border border-gray-800 bg-gray-900/90 p-8 max-w-md w-full text-center relative">
            <h2 className={`font-header text-3xl md:text-4xl mb-2 ${result.passed ? 'text-accent' : 'text-gray-500'}`}>
                {result.passed ? "UPLOAD COMPLETE" : "LINK FAILED"}
            </h2>
            <div className="text-xs font-ui text-gray-500 mb-6">
                {result.passed ? `EARNINGS: ¥${result.yen}` : "SYSTEM LOCKOUT"}
            </div>
            <div className="grid grid-cols-3 gap-2 mb-8 border-y border-gray-800 py-6">
                <div>
                    <div className="text-[10px] text-gray-500">SPEED</div>
                    <div className="text-2xl text-accent font-header">{result.wpm}</div>
                </div>
                <div>
                    <div className="text-[10px] text-gray-500">ACC</div>
                    <div className="text-2xl text-white font-header">{result.accuracy}%</div>
                </div>
                <div>
                    <div className="text-[10px] text-gray-500">YEN</div>
                    <div className="text-2xl text-accent font-header">¥{result.yen}</div>
                </div>
            </div>
            <div className="flex gap-3 justify-center">
                <button onClick={onRetry} className="btn-cyber px-6 py-3 text-white w-1/2 flex flex-col items-center">
                    <span>RETRY</span>
                    <span className="text-[9px] text-gray-500 mt-1">[ENTER]</span>
                </button>
                <button onClick={onMenu} className="btn-cyber px-6 py-3 text-gray-500 w-1/2 flex flex-col items-center">
                    <span>MENU</span>
                    <span className="text-[9px] text-gray-600 mt-1">[ESC]</span>
                </button>
            </div>
        </div>
    </div>
  );
};

export default Results;