import React from 'react';
import { useSettings } from '../hooks/useSettings';
import './GameOptionsOverlay.css';

interface GameOptionsOverlayProps {
  onClose: () => void;
}

export const GameOptionsOverlay: React.FC<GameOptionsOverlayProps> = ({ onClose }) => {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="game-options-overlay">
      <div className="game-options-backdrop" onClick={onClose} />
      <div className="game-options-panel">
        <header className="game-options-header">
          <h2>Options</h2>
          <button className="game-options-close" onClick={onClose}>✕</button>
        </header>

        <div className="game-options-content">
          <div className="option-row">
            <div className="option-info">
              <span className="option-label">Dark Mode</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => { updateSetting('darkMode', e.target.checked); }}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="option-row">
            <div className="option-info">
              <span className="option-label">Highlight Row & Column</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.highlightRowCol}
                onChange={(e) => { updateSetting('highlightRowCol', e.target.checked); }}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="option-row">
            <div className="option-info">
              <span className="option-label">Highlight Same Number</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.highlightSameNumber}
                onChange={(e) => { updateSetting('highlightSameNumber', e.target.checked); }}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="option-row">
            <div className="option-info">
              <span className="option-label">Grey Out Completed Numbers</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.greyOutCompleted}
                onChange={(e) => { updateSetting('greyOutCompleted', e.target.checked); }}
              />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
