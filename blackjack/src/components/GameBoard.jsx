import { useContext } from 'react';
import { GameContext } from '../contexts/Game';
import PlayerHands from './PlayerHands';
import DealerHand from './DealerHand';
import Controls from   './Controls';
import { Container, Row, Col, Alert } from 'react-bootstrap';

function GameBoard(){
    const { state } = userContext(GameContext);

    return (
        <Container className="mt-4">
          <Row>
            <Col><h2>Dealer</h2><DealerHand cards={state.dealerCards} /></Col>
          </Row>
          <Row>
            <Col><h2>Você</h2><PlayerHand cards={state.playerCards} /></Col>
          </Row>
          <Row>
            <Col className="mt-3"><Controls /></Col>
          </Row>
          {state.result && (
            <Row>
              <Col className="mt-3">
                <Alert variant="info">Resultado: {state.result.toUpperCase()}</Alert>
              </Col>
            </Row>
          )}
        </Container>
      );
}

export default GameBoard;

