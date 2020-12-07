export function makeTurn(gameState) {
    if (gameState.isFirstPlayerMiniTurn()) {
        return;
    }
    while (!gameState.isFirstPlayerMiniTurn()) {
        simpleTurn(gameState);
    }
}

const ranks = [
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A"
];

function simpleTurn(gameState) {
    const suitSortFunction = (a, b) => sortFunction(a, b, gameState.player2Suit);
    let ourCards = gameState.player2.map(card => [card.slice(0, card.legth - 1), card[card.legth - 1]]);
    if (gameState.isAttackerMiniTurn()) {
        if (gameState.board.length < 6) {
            if (gameState.board.length === 0) {
                ourCards.sort(suitSortFunction);
                makeSafeTurn(gameState, ourCards);
            } else {
                let notTrump = ourCards.filter(card => card[1] !== gameState.player2Suit);
                notTrump.sort(suitSortFunction)
                makeSafeTurn(gameState, notTrump);
            }
        } else {
            let notHighTrump = ourCards.filter(card => card[1] !== gameState.player2Suit || ranks.indexOf(card[0]) < ranks.indexOf('10'));
            notHighTrump.sort(suitSortFunction);
            makeSafeTurn(notHighTrump);
        }
    } else {
        //we defending
        let notHighTrump = ourCards.filter(card => card[1] !== gameState.player2Suit || ranks.indexOf(card[0]) < ranks.indexOf('Q'));
        notHighTrump.sort(suitSortFunction);
        makeSafeTurn(notHighTrump);
    }
}

function makeSafeTurn(gameState, arrayOfCard) {
    for (const [number, suit] of arrayOfCard) {
        try {
            gameState.makeTurn(number + suit);
            return;
        } catch (ignore) {
        }
    }
    gameState.pass();
}

function sortFunction([number1, suit1], [number2, suit2], suit) {
    if (suit1 === suit2) {
        return number1 < number2 ? -1 : 1;
    }
    if (suit1 === suit) {
        return -1;
    }
    if (suit2 === suit) {
        return 1;
    }
    return number1 < number2 ? -1 : 1;
}