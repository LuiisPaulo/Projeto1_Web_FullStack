import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Game from './components/Game';
import { GameProvider } from './contexts/GameContext';

function App() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}

export default App;
