import React, { Component } from "react";
import logo from '../logo.svg';
import { Popup } from "../Popup";


export class Card extends Component {

    updateItem = (event) => {
        this.props.togglePopup(event)
        event.preventDefault(event);
        const result =(
            <Popup handleAddCardItem={this.props.handleAddCardItem} todoId={this.props.row.id} togglePopup={this.props.togglePopup} />        
        )
        console.log("Inside Card ",result);
        return result;
    }

    render() {
        const {onHandleSubmit, row, togglePopup} = this.props;
        return (
            <div className="card text-left" id={row.id}>
                <img src={logo} className="card-img-top" alt="..." style={(row.isSubscribed) ? ({width: "200px"}) : ({display: "none"})} />
                <div className="card-body">
                    <h5 className="card-title">{row.title}</h5>
                    <p className="card-text">{row.description}</p>
                    <button type="button" className='btn btn-primary' name='updateTodo' id={row.id} style={{margin: "2px"}} onClick={togglePopup} value={JSON.stringify(row)}>Update</button> 
                    <button type='button' className='btn btn-danger' name='deleteTodo' id={row.id} style={{margin: "2px"}} onClick={onHandleSubmit}>Delete</button>
                </div>
            </div>
        )
    }
}