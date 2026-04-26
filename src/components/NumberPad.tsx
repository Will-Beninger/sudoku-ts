import React from 'react';
import { useGame } from '../hooks/useGame';
import { useSettings } from '../hooks/useSettings';
import './NumberPad.css';

export const NumberPad: React.FC = () => {
  const { inputNumber, completedNumbers } = useGame();
  const { settings } = useSettings();

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="number-pad">
      {numbers.map((num) => {
        const isCompleted = settings.greyOutCompleted && completedNumbers.has(num);
        return (
          <button
            key={num}
            className={`num-btn ${isCompleted ? 'num-btn-dimmed' : ''}`}
            onClick={() => { inputNumber(num); }}
            type="button"
          >
            {num}
          </button>
        );
      })}
    </div>
  );
};
