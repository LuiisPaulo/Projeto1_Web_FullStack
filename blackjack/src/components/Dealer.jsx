import React, { useContext } from 'react';
import { Card as BootstrapCard, Row, Col } from 'react-bootstrap';
import { GameContext } from '../contexts/GameContext';

const Dealer = () => {
  const { state } = useContext(GameContext);
  const { dealerHand, dealerScore, gameStatus } = state;

  const isBusted = gameStatus === 'dealerBusted';
  
  const hideFirstCard = gameStatus === 'playing';

  return (
    <BootstrapCard className="my-4">
      <BootstrapCard.Header>
        <h3>Dealer - Pontuação: {hideFirstCard ? '?' : dealerScore}</h3>
        {isBusted && <div className="text-danger fw-bold">Estourou!</div>}
      </BootstrapCard.Header>
      <BootstrapCard.Body>
        <Row>
          {dealerHand.map((card, index) => (
            <Col key={index} xs={4} md={2} className="mb-3">
              <BootstrapCard>
                {index === 0 && hideFirstCard ? (
                  <BootstrapCard.Img 
                    variant="top" 
                    src="https://deckofcardsapi.com/static/img/back.png"
                    alt="Card back"
                  />
                ) : (
                  <BootstrapCard.Img 
                    variant="top" 
                    src={card.image}
                    alt={`${card.value} of ${card.suit}`}
                  />
                )}
                <BootstrapCard.Footer className="text-center">
                  {index === 0 && hideFirstCard ? 'Hidden' : `${card.value} of ${card.suit}`}
                </BootstrapCard.Footer>
              </BootstrapCard>
            </Col>
          ))}
        </Row>
      </BootstrapCard.Body>
    </BootstrapCard>
  );
};

export default Dealer;
