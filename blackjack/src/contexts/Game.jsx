import { createContext, useReducer } from "react";

export const GameContext = createContext();

const start = {
  deckId: null,
  playerDecks: [],
  dealerDecks: [],
  game_status: "not_started",
  result: null,
};

function gameReducer(state, action) {
  switch (action.type) {
    case "SET_DECK":
      return { ...state, deckId: action.payload };
    case "DRAW_PLAYER":
      return {
        ...state,
        playerDecks: [...state.playerDecks, ...action.payload],
      };
    case "DRAW_DEALER":
      return {
        ...state,
        dealerDecks: [...state.dealerDecks, ...action.payload],
      };
    case "SET_STATUS":
      return { ...state, gamesStatus: action.payload };
    case "SET_RESULT":
      return { ...state, result: action.payload };
    case "RESET":
      return start;
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = userReducer(gameReducer, start);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export default gameReducer;