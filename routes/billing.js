const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST_KEY);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  app.post('/api/checkout', requireLogin, async (req, res) => {
    try {
      let user;
      // charge the user's payment method, using stripe
      const cardCharge = await stripe.charges.create({
        amount: 500,
        currency: 'usd',
        description: '$5 for 5 credits',
        source: req.body.id
      });
      // add 5 more credits to the user
      req.user.credits += 5;
      // save the updated user
      user = await req.user.save();
      // send the updated user information to the client
      res.send(user);
    } catch (e) {
      console.error(`Error when attempting to charge card: ${e}`);
    }  
  });
};