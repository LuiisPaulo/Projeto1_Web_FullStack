import React, { useContext } from 'react';
import { Button, Card as BootstrapCard, Alert } from 'react-bootstrap';
import { GameContext } from '../contexts/GameContext';

const GameControls = ({ onStartGame, onDealPlayerCard, onStand }) => {
  const { state } = useContext(GameContext);
  const { gameStatus, loading, error } = state;

  const getStatusMessage = () => {
    switch (gameStatus) {
      case 'waiting':
        return 'Clique em "Novo Jogo" para começar';
      case 'playing':
        return 'Sua vez. Escolha "Comprar" ou "Parar"';
      case 'playerBusted':
        return 'Você estourou! Dealer vence.';
      case 'dealerBusted':
        return 'Dealer estourou! Você vence!';
      case 'playerWin':
        return 'Você vence!';
      case 'dealerWin':
        return 'Dealer vence.';
      case 'draw':
        return 'Empate!';
      default:
        return '';
    }
  };

  return (
    <BootstrapCard className="my-4">
      <BootstrapCard.Header>
        <h3>Controles de Jogo</h3>
      </BootstrapCard.Header>
      <BootstrapCard.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Alert variant={
          gameStatus === 'playerWin' || gameStatus === 'dealerBusted' ? 'success' :
          gameStatus === 'dealerWin' || gameStatus === 'playerBusted' ? 'danger' :
          gameStatus === 'draw' ? 'info' : 'primary'
        }>
          {getStatusMessage()}
        </Alert>

        <div className="d-grid gap-2">
          <Button 
            variant="primary" 
            size="lg" 
            onClick={onStartGame} 
            disabled={loading || (gameStatus === 'playing')}
          >
            {loading && gameStatus === 'waiting' ? 'Carregando...' : 'Novo Jogo'}
          </Button>
          
          <Button 
            variant="success" 
            size="lg" 
            onClick={onDealPlayerCard} 
            disabled={loading || gameStatus !== 'playing'}
          >
            {loading ? 'Carregando...' : 'Comprar Carta'}
          </Button>
          
          <Button 
            variant="warning" 
            size="lg" 
            onClick={onStand} 
            disabled={loading || gameStatus !== 'playing'}
          >
            Parar
          </Button>
        </div>
      </BootstrapCard.Body>
    </BootstrapCard>
  );
};

export default GameControls;
