import { useContext } from 'react';
import { GameContext } from '../contexts/Game';
import { Button, Stack } from 'react-bootstrap';

function calcularPontucao(cartas){
    let total = 0;
    let ases = 0;

    for(let carta of cartas){
        const valor = carta.value;
        
        if(["KING", "QUEEN", "JACK"].includes(valor)){
            total += 10;
        }
        if(valor === "ACE"){
            total += 11;
            ases += 1;
        }

        total += parseInt(valor);
    }

    while(total > 21 && ases > 0){
        total -= 10;
        ases -= 1;
    }

    return total;

}

function Controls(){
    const { state, dispatch } = useContext(GameContext);

    const iniciaGame = async() => {
        const res = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
        const data = await res.json();
        dispatch({ type: "SET_DECK", payload: data.deck_id });
    
        const res1 = await fetch(`https://deckofcardsapi.com/api/deck/${data.deck_id}/draw/?count=2`);
        const player = await res1.json();
        dispatch({ type: "DRAW_PLAYER", payload: player.cards });
    
        const res2 = await fetch(`https://deckofcardsapi.com/api/deck/${data.deck_id}/draw/?count=2`);
        const dealer = await res2.json();
        dispatch({ type: "DRAW_DEALER", payload: dealer.cards });
    
        dispatch({ type: "SET_STATUS", payload: "in_progress" });
      };
    
    const comprarCarta = async () => {
        const res = await fetch(`https://deckofcardsapi.com/api/deck/${state.deckId}/draw/?count=1`);
        const data = await res.json();
        dispatch({ type: "DRAW_PLAYER", playload: data.cards});

        const novaMao = [...state.playerCards, ...data.cards];
        const pontos = calcularPontuacao(novaMao);

        if(pontos > 21){
            dispatch({ type: "SET_RESULT", payload: "lose" });
            dispatch({ type: "SET_STATUS", payload: "ended" });
        }
    };

    const parar = async () => {
        let dealerMao = [...state.dealerCards];
        let pontosDealer = calcularPontucao(dealerMao);

        while(pontosDealer < 17){
            const res = await fetch(`https://deckofcardsapi.com/api/deck/${state.deckId}/draw/?count=1`);
            const data = await res.json();
            dealerMao = [...dealerMao, ...data.cards];
            pontosDealer = calcularPontuacao(dealerMao);
        }

        dispatch({ type: "DRAW_DEALER", payload: dealerMao.slice(state.dealerCards.length) });

        const pontosJogador = calcularPontucao(state.playerCards);

        if(pontosDealer == 21 || pontosJogador > pontosDealer){
            dispatch({ type: "SET_RESULT", payload: "win" });
        }

        if(pontosJogador < pontosDealer){
            dispatch({ typE: "SET_RESULT", payload: "lose" });
        }

        dispatch({ type: "SET_RESULT", payload: "draw" });

        dispatch({ type: "SET_STATUS", payload: "ended" });
    };

    const reiniciar = () => {
        dispatch({ type: "RESET" });

    };

    return (    <Stack direction="horizontal" gap={3}>
      <Button onClick={iniciarJogo}>Iniciar Jogo</Button>
      <Button onClick={comprarCarta} disabled={state.gameStatus !== "in_progress"}>Comprar</Button>
      <Button onClick={parar} disabled={state.gameStatus !== "in_progress"}>Parar</Button>
      <Button onClick={reiniciar}>Reiniciar</Button>
    </Stack>);
}

export default Controls;


