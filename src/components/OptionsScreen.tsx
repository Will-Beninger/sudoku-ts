import { useAtom } from 'jotai';
import { routeAtom } from '../router';
import { useSettings } from '../hooks/useSettings';
import './OptionsScreen.css';

export const OptionsScreen = () => {
  const [, setRoute] = useAtom(routeAtom);
  const { settings, updateSetting } = useSettings();

  return (
    <div className="options-screen">
      <header className="options-header">
        <button className="options-back" onClick={() => { setRoute({ screen: 'menu' }); }}>←</button>
        <h1>Options</h1>
      </header>

      <div className="options-sections">
        <section className="options-section">
          <h2>Appearance</h2>
          <div className="option-row">
            <div className="option-info">
              <span className="option-label">Dark Mode</span>
              <span className="option-desc">Toggle between dark and light theme</span>
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
        </section>

        <section className="options-section">
          <h2>Gameplay Highlights</h2>

          <div className="option-row">
            <div className="option-info">
              <span className="option-label">Highlight Row & Column</span>
              <span className="option-desc">Highlight the row and column of the selected cell</span>
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
              <span className="option-desc">Highlight all cells with the same value</span>
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
              <span className="option-desc">Dim number pad buttons for numbers placed 9 times</span>
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
        </section>
      </div>
    </div>
  );
};
