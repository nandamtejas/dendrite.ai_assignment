import React from 'react';
import {CardElement, ElementsConsumer} from '@stripe/react-stripe-js';

class CheckoutForm extends React.Component {
  handleSubmit = async (event) => {
    event.preventDefault();
    const {stripe, elements} = this.props;

    if (elements == null) {
      return;
    }

    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
  };

  render() {
    const {stripe} = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        <CardElement />
        <button type="submit" disabled={!stripe}>
          Pay
        </button>
      </form>
    );
  }
}

const InjectedCheckoutForm = () => (
  <ElementsConsumer>
    {({stripe, elements}) => (
      <CheckoutForm stripe={stripe} elements={elements} />
    )}
  </ElementsConsumer>
);

console.log(InjectedCheckoutForm);

export default InjectedCheckoutForm;