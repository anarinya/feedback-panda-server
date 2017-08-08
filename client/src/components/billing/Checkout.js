import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';

import { handleToken } from '../../actions';

class Checkout extends Component {
  render() {
    return (
      <StripeCheckout
        // amount is in cents, so this is $5.00 
        amount={500}
        name="Feedback Panda"
        description="$5 for 5 email credits"
        // receives a callback function after receiving an
        // authorization token from the stripe API
        token={token => this.props.handleToken(token) }
        stripeKey={process.env.REACT_APP_STRIPE_PUBLIC_TEST_KEY}
      >
        <button className="btn cyan darken-3">Add Credits</button>
      </StripeCheckout>
    );
  }
}

export default connect(null, { handleToken })(Checkout);