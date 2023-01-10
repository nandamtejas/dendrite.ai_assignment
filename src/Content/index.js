import React, {Component} from "react";
import { Side } from "../Side";
import {Main} from "../Main";

export class Content extends Component {
    render() {
        const {onHandleSubmit, cardData, togglePopup, handleAddCardItem, toggleSubscribe, toggleStripePopup, handleStripeEle} = this.props;
        return (
            <div className='row'>
                <Side onHandleSubmit={onHandleSubmit} toggleSubscribe={toggleSubscribe} toggleStripePopup={toggleStripePopup} handleStripeEle={handleStripeEle} />
                <Main onHandleSubmit={onHandleSubmit} cardData={cardData} togglePopup={togglePopup} handleAddCardItem={handleAddCardItem}/>
            </div>
        )
    }
}