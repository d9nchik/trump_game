import React, {PureComponent} from "react";
import "./Deck.css";
import CardContainer from "./CardContainer";

const range = (start, count) =>
    Array.apply(0, Array(count)).map((element, index) => {
      return index + start;
    });

const spreadShuffle = i => ({
  x: Math.cos(i) * Math.floor(Math.random() * 200 + 1),
  y: Math.sin(i) * Math.floor(Math.random() * 200 + 1),
  z: 0
});

const spread = i => ({
  x: i * 12 - 100,
  y: 50,
  z: 0
});

const fan = i => ({
  x: Math.cos(i) * 95 + 400,
  y: Math.sin(i) * 95,
  z: i
});

const stack = i => ({
  x: 0.1 * i,
  y: 0.1 * i,
  z: i
});

const suits = ["d", "c", "h", "s"];
const ranks = [
  "A",
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

class DeckContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      board: [], deck: [], opponentBoard: [], out: [], myBoard: [], makeTurn: card => {
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.board) {
      this.setState({board: nextProps.board});
    }
    if (nextProps.opponentBoard) {
      this.setState({opponentBoard: nextProps.opponentBoard});
    }
    if (nextProps.myBoard) {
      this.setState({myBoard: nextProps.myBoard});
    }
    if (nextProps.makeTurn) {
      this.setState({makeTurn: nextProps.makeTurn});
    }
    if (nextProps.out) {
      this.setState({out: nextProps.out})
    }
  }

  render() {
    const {board, opponentBoard, myBoard, makeTurn, out} = this.state;
    const {size, flipOnHover, boardYoffset, boardXoffset} = this.props;

    return (
        <div>
          {getInitialDeck().map((card, i) => {
            if (opponentBoard.includes(card.rank + card.suit)) {
              return (
                    <CardContainer
                        index={i}
                        // key={card.rank + card.suit}
                        board={opponentBoard}
                        card={card}
                        faceDown={true}
                        size={size}
                        boardXoffset={boardXoffset} // board x offset relative to stack
                        boardYoffset={-boardYoffset} // board y offset relative to stack
                        mapXYZ={stack}
                        flipOnHover={false}
                    />
              );
            }
            if (myBoard.includes(card.rank + card.suit)) {
              return (
                  <div onClick={() => makeTurn(card.rank + card.suit)}
                      // key={card.rank + card.suit}
                  >
                    <CardContainer
                        index={i}
                        // key={card.rank + card.suit}
                        board={myBoard}
                        card={card}
                        faceDown={false}
                        size={size}
                        boardXoffset={-boardXoffset / 2} // board x offset relative to stack
                        boardYoffset={2 * boardYoffset} // board y offset relative to stack
                        mapXYZ={stack}
                        flipOnHover={flipOnHover}
                    />
                  </div>
              );
            }
            if (out.includes(card.rank + card.suit)) {
              return (<div/>);
            }
            if (board.includes(card.rank + card.suit)) {
              return (
                  <CardContainer
                      index={i}
                      key={card.rank + card.suit}
                      board={board}
                      card={card}
                      faceDown={false}
                      size={size}
                      boardXoffset={boardXoffset} // board x offset relative to stack
                      boardYoffset={0} // board y offset relative to stack
                      mapXYZ={stack}
                      flipOnHover={true}
                  />
              );
            }
            return (
                <CardContainer
                    index={i}
                    key={card.rank + card.suit}
                    board={myBoard}
                    card={card}
                    faceDown={true}
                    size={size}
                    boardXoffset={boardXoffset} // board x offset relative to stack
                    boardYoffset={boardYoffset} // board y offset relative to stack
                    mapXYZ={stack}
                    flipOnHover={flipOnHover}
                />
            );
          })}
        </div>
    );
  }
}

DeckContainer.defaultProps = {
  size: 200,
  boardXoffset: 475,
  boardYoffset: 300,
  flipOnHover: true
};

export default DeckContainer;
