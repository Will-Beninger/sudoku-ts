import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { routeAtom } from '../router';
import { StorageService } from '../services/db';
import './MainMenu.css';

export const MainMenu = () => {
  const [, setRoute] = useAtom(routeAtom);
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    void StorageService.loadGame().then((game) => {
      setHasSavedGame(!!game);
      setIsChecking(false);
    });
  }, []);

  return (
    <div className="main-menu">
      <div className="menu-content">
        <div className="menu-icon">
          <svg viewBox="0 0 80 80" width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="72" height="72" rx="14" fill="var(--primary-container)" stroke="var(--primary)" strokeWidth="3"/>
            <line x1="28" y1="16" x2="28" y2="64" stroke="var(--text-primary)" strokeWidth="3" strokeLinecap="round"/>
            <line x1="52" y1="16" x2="52" y2="64" stroke="var(--text-primary)" strokeWidth="3" strokeLinecap="round"/>
            <line x1="16" y1="28" x2="64" y2="28" stroke="var(--text-primary)" strokeWidth="3" strokeLinecap="round"/>
            <line x1="16" y1="52" x2="64" y2="52" stroke="var(--text-primary)" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>

        <h1 className="menu-title">Sudoku: Always Free</h1>

        <div className="menu-buttons">
          {!isChecking && hasSavedGame && (
            <button
              id="btn-continue"
              className="menu-btn menu-btn-primary"
              onClick={() => { setRoute({ screen: 'game', resumeSave: true }); }}
            >
              Continue Game
            </button>
          )}

          <button
            id="btn-play"
            className="menu-btn menu-btn-secondary"
            onClick={() => { setRoute({ screen: 'levelSelect' }); }}
          >
            Play Game
          </button>

          <button
            id="btn-statistics"
            className="menu-btn menu-btn-outline"
            onClick={() => { setRoute({ screen: 'statistics' }); }}
          >
            Statistics
          </button>

          <button
            id="btn-options"
            className="menu-btn menu-btn-outline"
            onClick={() => { setRoute({ screen: 'options' }); }}
          >
            Options
          </button>
        </div>
      </div>
    </div>
  );
};
