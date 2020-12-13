export function makeTurn(gameState) {
    if (gameState.isFirstPlayerMiniTurn() && gameState.isEnd()) {
        return;
    }
    while (!gameState.isFirstPlayerMiniTurn() && !gameState.isEnd()) {
        if (gameState.deck.length === 0) {
            endOfGameStrategy(gameState);
        } else {
            simpleTurn(gameState);
        }
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
    let ourCards = gameState.player2.map(card => [card.slice(0, card.length - 1), card[card.length - 1]]);
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
            makeSafeTurn(gameState, notHighTrump);
        }
    } else {
        //we defending
        let notHighTrump = ourCards.filter(card => card[1] !== gameState.player2Suit || ranks.indexOf(card[0]) < ranks.indexOf('Q'));
        notHighTrump.sort(suitSortFunction);
        makeSafeTurn(gameState, notHighTrump);
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
        return ranks.indexOf(number1) < ranks.indexOf(number2) ? -1 : 1;
    }
    if (suit1 === suit) {
        return 1;
    }
    if (suit2 === suit) {
        return -1;
    }
    return ranks.indexOf(number1) < ranks.indexOf(number2) ? -1 : 1;
}

let deepOfMind = 30;

function endOfGameStrategy(gameState) {
    let ourCards = gameState.player2;
    for (const ourCard of ourCards) {
        try {
            let copy = gameState.copy();
            copy.makeTurn(ourCard);
            if (recursiveCall(copy)) {
                gameState.makeTurn(ourCard);
                return;
            }
        } catch (e) {
        }
    }
    ourCards.sort((a, b) => sortFunction(a, b, gameState.player2Suit));
    for (const ourCard of ourCards) {
        try {
            gameState.makeTurn(ourCard);
            return;
        } catch (e) {
        }
    }
    try {
        gameState.pass();
        return;
    } catch (e) {
    }
    gameState.makeTurn(ourCards[0]);
}

function minStrategy(gameState) {

    let ourCards = gameState.player1;
    for (const ourCard of ourCards) {
        try {
            let copy = gameState.copy();
            copy.makeTurn(ourCard);
            if (!recursiveCall(copy)) {
                return false;
            }
        } catch (e) {
        }
    }

    try {
        let copy = gameState.copy();
        copy.pass();
        if (!recursiveCall(copy)) {
            return false;
        }
    } catch (e) {
    }

    return true;
}

function maxStrategy(gameState) {
    let ourCards = gameState.player2;
    for (const ourCard of ourCards) {
        try {
            let copy = gameState.copy();
            copy.makeTurn(ourCard);
            if (recursiveCall(copy)) {
                return true;
            }
        } catch (e) {
        }
    }

    try {
        let copy = gameState.copy();
        copy.pass();
        if (recursiveCall(copy)) {
            return true;
        }
    } catch (e) {
    }

    return false;
}

function recursiveCall(gameStateCopy) {
    if (gameStateCopy.isEnd() || deepOfMind) {
        return !gameStateCopy.isFirstWinner();
    }
    deepOfMind--;
    let isSuccessful = gameStateCopy.isFirstPlayerMiniTurn() ? minStrategy(gameStateCopy) : maxStrategy(gameStateCopy);
    deepOfMind++;
    return isSuccessful;
}