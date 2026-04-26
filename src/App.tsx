import { useAtomValue } from 'jotai';
import { routeAtom } from './router';
import { MainMenu } from './components/MainMenu';
import { LevelSelector } from './components/LevelSelector';
import { GameScreen } from './components/GameScreen';
import { OptionsScreen } from './components/OptionsScreen';
import './App.css';

function App() {
  const route = useAtomValue(routeAtom);

  const renderScreen = () => {
    switch (route.screen) {
      case 'menu':
        return <MainMenu />;
      case 'levelSelect':
        return <LevelSelector />;
      case 'game':
        return <GameScreen />;
      case 'statistics':
        // Placeholder until Phase 5
        return <MainMenu />;
      case 'options':
        return <OptionsScreen />;
      default:
        return <MainMenu />;
    }
  };

  return (
    <div className="app-container">
      {renderScreen()}
    </div>
  );
}

export default App;
