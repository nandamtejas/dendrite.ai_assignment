import React, { Component } from "react";
import './index.css';
import { Form } from "../Form";

export class Popup extends Component { 

    constructor(props) {
        super(props);

        this.wrapperRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
        // document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    UNSAFE_componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside(event) {
        if (!this.wrapperRef.current){
            return;
        }
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)){
            console.log("Clicked Outside!");
            this.props.togglePopup(event);
        }
    }

    render() {
        const {togglePopup, handleAddCardItem, todoDetails, handleUpdateCardItem} = this.props;
        // console.log("Inside Popup", this.props);
        return (
            <div className="popup-box">
                <div className="box" ref={this.wrapperRef}>
                    <div className="btn btn-close" onClick={togglePopup}></div>
                    <Form handleAddCardItem={handleAddCardItem} todoDetails={todoDetails} handleUpdateCardItem={handleUpdateCardItem} />
                </div>
            </div>
        );
    }
}