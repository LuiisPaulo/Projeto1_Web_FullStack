import React, { useContext, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import Player from './Player';
import Dealer from './Dealer';
import GameControls from './GameControls';
import { GameContext } from '../contexts/GameContext';

const Game = () => {
  const { state, dispatch } = useContext(GameContext);
  const { deck_id, gameStatus, dealerScore, loading } = state;

  const startGame = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'RESET_GAME' });

      const response = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
      
      if (response.data.success) {
        const newDeckId = response.data.deck_id;
        dispatch({ type: 'NEW_GAME', payload: newDeckId });
        
        await dealInitialCards(newDeckId);
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao criar novo baralho' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: `Erro ao iniciar o jogo: ${error.message}` });
    }
  };

  // Distribuir cartas iniciais
  const dealInitialCards = async (deckId) => {
    try {
      const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`);
      
      if (response.data.success) {
        const cards = response.data.cards;
        
        dispatch({ type: 'DEAL_PLAYER_CARD', payload: cards[0] });
        dispatch({ type: 'DEAL_DEALER_CARD', payload: cards[1] });
        dispatch({ type: 'DEAL_PLAYER_CARD', payload: cards[2] });
        dispatch({ type: 'DEAL_DEALER_CARD', payload: cards[3] });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao distribuir cartas iniciais' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: `Erro ao distribuir cartas: ${error.message}` });
    }
  };

  const dealPlayerCard = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`);
      
      if (response.data.success) {
        dispatch({ type: 'DEAL_PLAYER_CARD', payload: response.data.cards[0] });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao comprar carta' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: `Erro ao comprar carta: ${error.message}` });
    }
  };

  const stand = async () => {
    try {
      let currentDealerScore = dealerScore;
      
      while (currentDealerScore < 17) {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`);
        
        if (response.data.success) {
          const card = response.data.cards[0];
          dispatch({ type: 'DEAL_DEALER_CARD', payload: card });
          
          if (card.value === 'ACE') {
            currentDealerScore += 11;
          } else if (['KING', 'QUEEN', 'JACK'].includes(card.value)) {
            currentDealerScore += 10;
          } else {
            currentDealerScore += parseInt(card.value);
          }
          
          if (currentDealerScore > 21) {
            currentDealerScore -= 10;
          }
        } else {
          dispatch({ type: 'SET_ERROR', payload: 'Erro ao comprar carta para o dealer' });
          break;
        }
      }
      
      dispatch({ type: 'DEALER_TURN' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: `Erro durante a jogada do dealer: ${error.message}` });
    }
  };

  // Verificar blackjack natural na mão inicial
  useEffect(() => {
    if (gameStatus === 'playing' && state.playerHand.length === 2 && state.playerScore === 21) {
      if (state.dealerScore === 21) {
        dispatch({ type: 'DEALER_TURN' });
      } else {
        dispatch({ type: 'DEALER_TURN' });
      }
    }
  }, [gameStatus, state.playerHand.length, state.playerScore, state.dealerScore, dispatch]);

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Blackjack React</h1>
          <p className="text-center">Tente chegar o mais próximo de 21 sem ultrapassar!</p>
        </Col>
      </Row>

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Carregando...</span>
          </Spinner>
        </div>
      )}

      <Row>
        <Col md={8}>
          <Dealer />
          <Player />
        </Col>
        <Col md={4}>
          <GameControls 
            onStartGame={startGame}
            onDealPlayerCard={dealPlayerCard}
            onStand={stand}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Game;
