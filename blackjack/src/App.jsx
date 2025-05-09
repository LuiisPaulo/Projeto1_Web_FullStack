//import { useState } from "react";
//import reactLogo from "./assets/react.svg";
//import viteLogo from "/vite.svg";
import GameProvider from "./contexts/Game";
import GameBoard from "./components/GameBoard.jsx";
import "./App.css";

function App() {
  return (
    <GameProvider>
      <GameBoard />
    </GameProvider>
  );
}

export default App;
