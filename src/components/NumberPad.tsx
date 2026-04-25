import React from 'react';
import { useGame } from '../hooks/useGame';
import './NumberPad.css';

export const NumberPad: React.FC = () => {
  const { inputNumber } = useGame();

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="number-pad">
      {numbers.map((num) => (
        <button
          key={num}
          className="num-btn"
          onClick={() => { inputNumber(num); }}
          type="button"
        >
          {num}
        </button>
      ))}
    </div>
  );
};
