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
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K"
];

const getInitialDeck = () =>
    ranks
        .map(r => suits.map(s => ({rank: r, suit: s})))
        .reduce((prev, curr) => prev.concat(curr));

export class GameState {
    constructor(player1Suit, player2Suit) {
        if (player1Suit === player2Suit || !suits.includes(player1Suit) || !suits.includes(player2Suit)) {
            throw new Error('Suits are not valid');
        }
        this.player1 = [];
        this.player2 = [];
        this.player1Suit = player1Suit;
        this.player2Suit = player2Suit;
        this.deck = getInitialDeck();
        this.out = [];
        this.board = [];
        this.isTurnOfFirst = true;
        this.giveCards();
    }

    giveCards() {
        const [first, second] = this.isTurnOfFirst ? [this.player1, this.player2] : [this.player2, this.player1];
        while (first.length < 6) {
            first.push(this.deck.pop());
        }
        while (second.length < 6) {
            second.push(this.deck.pop());
        }
    }

    makeTurn() {

    }
}