function shuffle(array) {
    const copy = [];
    let n = array.length;
    let i;
    // While there remain elements to shuffle…
    while (n) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * array.length);

        // If not already shuffled, move it to the new array.
        if (i in array) {
            copy.push(array[i]);
            delete array[i];
            n--;
        }
    }

    return copy;
}

const suits = ["d", "c", "h", "s"];
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

const getDeck = () =>
    shuffle(
        ranks
            .map(r => suits.map(s => r + s))
            .reduce((prev, curr) => prev.concat(curr))
    );

export class GameState {
    constructor(player1Suit, player2Suit) {
        if (player1Suit === player2Suit || !suits.includes(player1Suit) || !suits.includes(player2Suit)) {
            throw new Error('Suits are not valid');
        }
        this.player1 = [];
        this.player2 = [];
        this.player1Suit = player1Suit;
        this.player2Suit = player2Suit;
        this.deck = getDeck();
        this.out = [];
        this.board = [];
        this.isTurnOfFirst = true;
        this.isPassed = false;
        this.giveCards();
    }

    giveCards() {
        const [first, second] = this.isTurnOfFirst ? [this.player1, this.player2] : [this.player2, this.player1];
        while (first.length < 6 && this.deck.length > 0) {
            first.push(this.deck.pop());
        }
        while (second.length < 6 && this.deck.length > 0) {
            second.push(this.deck.pop());
        }
    }

    isAttackerMiniTurn() {
        return this.board.length % 2 === 0 || this.isPassed;
    }

    makeTurn(card) {
        let isAttackerMiniTurn = this.isAttackerMiniTurn();
        const isFirstPlayerMiniTurn = (this.isTurnOfFirst && isAttackerMiniTurn) || (!this.isTurnOfFirst && !isAttackerMiniTurn);
        const [playerDeck, playerSuit] = isFirstPlayerMiniTurn ? [this.player1, this.player1Suit] : [this.player2, this.player2Suit];

        if (!isTurnValid(this.board)) {
            throw new Error('Your turn is not valid');
        }

        playerDeck.splice(playerDeck.indexOf(card), 1);
        this.board.push(card);
        if (!isAttackerMiniTurn && playerDeck.length === 0) {
            this.endRound();
        }

        function isTurnValid(board) {
            if (playerDeck.includes(card)) {
                if (isAttackerMiniTurn) {
                    return board.length === 0 || board.map(card => card[0]).includes(card[0]);
                } else {
                    const opponentCard = board[board.length - 1];
                    if (opponentCard[opponentCard.length - 1] === card[card.length - 1]) {
                        return ranks.indexOf(card.slice(0, card.length - 1)) > ranks.indexOf(
                            opponentCard.slice(0, card.length - 1));
                    } else {
                        return card[card.length - 1] === playerSuit;
                    }
                }
            }
            return false;
        }
    }

    pass() {
        if (this.isAttackerMiniTurn()) {
            this.endRound();
        } else {
            this.isPassed = true;
        }
    }

    endRound() {
        if (this.isPassed) {
            if (this.isTurnOfFirst) {
                this.player2 = this.player2.concat(this.board);
            } else {
                this.player1 = this.player1.concat(this.board);
            }
            this.isPassed = false;
        } else {
            this.out.concat(this.board);
            this.isTurnOfFirst = !this.isTurnOfFirst;
        }
        this.board = [];

        this.giveCards();
    }

    isEnd() {
        return this.deck.length === 0 && (this.player1.length === 0 || this.player2.length === 0);
    }
}