import React, { useContext } from 'react';
import { Card as BootstrapCard, Button, Row, Col } from 'react-bootstrap';
import { GameContext } from '../contexts/GameContext';

const Player = () => {
  const { state } = useContext(GameContext);
  const { playerHand, playerScore, gameStatus } = state;

  // Determina se o jogador está busted (estourou 21)
  const isBusted = gameStatus === 'playerBusted';

  return (
    <BootstrapCard className="my-4">
      <BootstrapCard.Header>
        <h3>Jogador - Pontuação: {playerScore}</h3>
        {isBusted && <div className="text-danger fw-bold">Estourou!</div>}
      </BootstrapCard.Header>
      <BootstrapCard.Body>
        <Row>
          {playerHand.map((card, index) => (
            <Col key={index} xs={4} md={2} className="mb-3">
              <BootstrapCard>
                <BootstrapCard.Img 
                  variant="top" 
                  src={card.image}
                  alt={`${card.value} of ${card.suit}`}
                />
                <BootstrapCard.Footer className="text-center">
                  {card.value} of {card.suit}
                </BootstrapCard.Footer>
              </BootstrapCard>
            </Col>
          ))}
        </Row>
      </BootstrapCard.Body>
    </BootstrapCard>
  );
};

export default Player;
