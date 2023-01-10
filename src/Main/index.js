import React, {Component} from "react";
import { Card } from "../Card";

export class Main extends Component {
    render() {
        const {onHandleSubmit, cardData, togglePopup, handleAddCardItem} = this.props;
        const rows = cardData.map((row, index) => {
            return <Card onHandleSubmit={onHandleSubmit} row={row} key={index} togglePopup={togglePopup} handleAddCardItem={handleAddCardItem}/>;
        })
        const cards = <div className='cards'>{rows}</div>
        return (
            <div className='main'>
                <div className="button">
                <button type="button" onClick={togglePopup} className="btn btn-primary btn-lg">Create Todo</button>
                </div>
                {cards}
            </div>
        )
    }
}