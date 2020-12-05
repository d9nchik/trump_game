import React, {Component} from "react";

class Card extends Component {
    shouldComponentUpdate(nextProps) {
        if (nextProps.rotationY !== this.props.rotationY) {
            return true;
        }

        return nextProps.size !== this.props.size;


    }

    render() {
        const {index, card, size, faceDown, rotationY} = this.props;

        return (
            <div id="card" style={{transform: `rotateY(${rotationY}deg)`}}>
                <img
                    alt='card'
                    className={faceDown === true ? "front" : "back"}
                    src={"cards/back.svg"}
                    style={{width: "100%", height: "100%"}}
                />
                <img
                    alt='card'
                    className={faceDown === true ? "back" : "front"}
                    src={`cards/${card}.svg`}
                    style={{width: "100%", height: "100%"}}
                />
            </div>
        );
    }
}

export default Card;
