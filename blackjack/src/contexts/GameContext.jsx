import React, { createContext, useReducer } from 'react';

const initialState = {
  deck_id: '',
  playerHand: [],
  dealerHand: [],
  playerScore: 0,
  dealerScore: 0,
  gameStatus: 'waiting', 
  loading: false,
  error: null,
};

export const GameContext = createContext();

export const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'NEW_GAME':
      return { 
        ...state, 
        deck_id: action.payload, 
        playerHand: [],
        dealerHand: [],
        playerScore: 0,
        dealerScore: 0,
        gameStatus: 'playing',
        loading: false
      };
    case 'DEAL_PLAYER_CARD':
      const updatedPlayerHand = [...state.playerHand, action.payload];
      const playerScore = calculateScore(updatedPlayerHand);
      let gameStatus = state.gameStatus;
      
      if (playerScore > 21) {
        gameStatus = 'playerBusted';
      }

      return {
        ...state,
        playerHand: updatedPlayerHand,
        playerScore,
        gameStatus,
        loading: false
      };
    case 'DEAL_DEALER_CARD':
      const updatedDealerHand = [...state.dealerHand, action.payload];
      const dealerScore = calculateScore(updatedDealerHand);
      
      return {
        ...state,
        dealerHand: updatedDealerHand,
        dealerScore,
        loading: false
      };
    case 'DEALER_TURN':
      let newGameStatus = state.gameStatus;
      
      if (state.dealerScore > 21) {
        newGameStatus = 'dealerBusted';
      } else if (state.dealerScore > state.playerScore) {
        newGameStatus = 'dealerWin';
      } else if (state.dealerScore < state.playerScore) {
        newGameStatus = 'playerWin';
      } else {
        newGameStatus = 'draw';
      }
      
      return {
        ...state,
        gameStatus: newGameStatus,
        loading: false
      };
    case 'RESET_GAME':
      return initialState;
    default:
      return state;
  }
};

const calculateScore = (hand) => {
  let score = 0;
  let aces = 0;

  hand.forEach(card => {
    const value = card.value;
    if (value === 'ACE') {
      score += 11;
      aces += 1;
    } else if (['KING', 'QUEEN', 'JACK'].includes(value)) {
      score += 10;
    } else {
      score += parseInt(value);
    }
  });

  while (score > 21 && aces > 0) {
    score -= 10; 
    aces -= 1;
  }

  return score;
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
