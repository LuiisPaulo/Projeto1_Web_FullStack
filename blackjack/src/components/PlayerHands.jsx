import Card from './Card';

function PlayerHand({ cards }){
    return <div>{cards.map((card) => <Card key={card.code} image={card.image}/>)}</div>
}

export default PlayerHand;