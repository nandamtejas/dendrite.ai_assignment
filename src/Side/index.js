import React, { Component } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import InjectedCheckoutForm from "../InjectedCheckoutForm";
import { StripePopup } from "../StripePopup";

export class Side extends Component {

    state = {
        "session": "",
        "public": "",
        stripePromise: null
    }

    onLicenseClick = (event) => {
        event.preventDefault(event);
        const query = `
        query stripeLicense {
            checkoutPayment {
              success
              errors
              session
              public
            }
          }`
        fetch("http://localhost:5000/graphql", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                // 'Access-Control-Allow-Origin': "*",
                // 'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, PATCH, DELETE OPTIONS',
                // 'strict-origin-when-cross-origin': true
            },
            body: JSON.stringify({
                query: query,
                variables: {}
            })
        })
        .then((response) => response.json())
        .then((response) => {
            console.log(response);
            const result = response.data.checkoutPayment
            this.setState({
                session: result.session,
                public: result.public,
                stripePromise: loadStripe(result.public)
            })
            console.log(this.state.stripePromise);
            this.stripeHandleEle(event);
            this.props.toggleStripePopup(event);
            // console.log(result);
            // var stripePromise = loadStripe(result.public);
            // return (
            //     <Elements stripe={stripePromise}>
            //         <InjectedCheckoutForm />
            //     </Elements>
            // );
        })
        
    }

    stripeHandleEle = (event) => {
        var ele = (
            <Elements stripe={this.state.stripePromise}>
                <InjectedCheckoutForm />
            </Elements>
        );
        this.props.handleStripeEle(event, ele);
    }

    render() {
        const {toggleStripePopup, handleStripeEle} = this.props;
        
        return (
            <div className='side'>
                {/* <div className="offcanvas offcanvas-start show" tabindex="-1" id="offcanvas" aria-labelledby="offcanvasLabel"> */}
                <div className="list-group">
                    <button type="button" name='stripeLicense' id="stripeLiscence" className="list-group-item list-group-item-action" onClick={this.onLicenseClick}>Pro License</button>
                </div>
                {/* </div> */}
            </div>
        );
    }
}