// import Deck from "react-poker/dist/react-poker";
import {Component} from "react/cjs/react.production.min";
import DeckContainer from "../cardComponents/Deck";
import {GameState} from "./GameState";


class AppContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {gameState: new GameState('c', 's')};
        this.pass = this.pass.bind(this);
    }

    componentDidMount() {
        this.setState({});
    }

    makeTurn(card) {
        try {
            this.state.gameState.makeTurn(card);
            this.setState({});
        } catch (e) {
            alert(e);
        }
    }

    pass() {
        this.state.gameState.pass();
        this.setState({});
    }

    render() {
        const {player2, player1, board, out} = this.state.gameState;
        return (
            <div style={{left: "10vw", top: "20vh", position: "absolute"}}>
                <button onClick={this.pass}>Pass</button>
                <DeckContainer

                    myBoard={player1}
                    opponentBoard={player2}
                    out={out}
                    makeTurn={card => this.makeTurn(card)}
                    board={board}
                    boardXoffset={375} // X axis pixel offset for dealing board
                    boardYoffset={200} // Y axis pixel offset for dealing board
                    size={200} // card height in pixels
                />

            </div>
        );
    }
}

export default AppContainer;