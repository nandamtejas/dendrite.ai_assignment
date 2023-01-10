import React, { Component } from "react";
import './index.css';
import { Form } from "../Form";

export class StripePopup extends Component { 

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
            this.props.toggleStripePopup(event);
        }
    }

    render() {
        const {toggleStripePopup, ele} = this.props;
        console.log("Inside StripePopup", this.props);
        return (
            <div className="stripe-popup-box">
                <div className="stripe-box" ref={this.wrapperRef}>
                    <div className="btn btn-close" onClick={toggleStripePopup}></div>
                    {ele}
                </div>
            </div>
            
        );
    }
}