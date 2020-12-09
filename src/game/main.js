import {Component} from "react/cjs/react.production.min";
import DeckContainer from "../cardComponents/Deck";
import {getGameState, getSymbolSuitFromSuitName} from "./GameState";
import {makeTurn} from "./bot";


class AppContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {gameState: getGameState()};
        this.pass = this.pass.bind(this);
        this.restart = this.restart.bind(this);
    }

    componentDidMount() {
        this.setState({});
    }

    makeTurn(card) {
        try {
            this.state.gameState.makeTurn(card);
        } catch (e) {
            alert(e);
        }
        if (!this.state.gameState.isFirstPlayerMiniTurn()) {
            makeTurn(this.state.gameState);
        }
        // this.forceUpdate();
        this.setState({});
    }

    pass() {
        this.state.gameState.pass();
        if (!this.state.gameState.isFirstPlayerMiniTurn()) {
            makeTurn(this.state.gameState);
        }
        this.setState({});
    }

    restart() {
        this.setState({gameState: getGameState()})
    }

    render() {
        const {player2, player1, board, out, message, deck, player1Suit, player2Suit} = this.state.gameState;
        return (
            <div>
                <h1>{this.state.gameState.isEnd() ? (this.state.gameState.isFirstWinner() ?
                    'Congratulation you win!🥳' : 'Sorry, you lose😭') : message}
                    <br/>
                    {`Card left: ${deck.length}`}
                    <br/>
                    {`Your ${getSymbolSuitFromSuitName(player1Suit)}`}
                    <br/>
                    {`Bot ${getSymbolSuitFromSuitName(player2Suit)}`}
                </h1>
                <div style={{left: "10vw", top: "20vh", position: "absolute"}}>
                    {
                        this.state.gameState.isEnd() ? <button onClick={this.restart}>Play again!</button> :
                            <button onClick={this.pass}>Pass</button>
                    }

                    <DeckContainer

                        myBoard={[...player1]}
                        opponentBoard={[...player2]}
                        out={out}
                        makeTurn={card => this.makeTurn(card)}
                        board={[...board]}
                        boardXoffset={375} // X axis pixel offset for dealing board
                        boardYoffset={200} // Y axis pixel offset for dealing board
                        size={200} // card height in pixels
                    />
                </div>
            </div>
        );
    }
}

export default AppContainer;