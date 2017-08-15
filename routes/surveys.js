const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');
const _ = require('lodash');
const Path = require('path-parser');
// built-in node library for parsing URLs
const { URL } = require('url');

const Survey = mongoose.model('surveys');

module.exports = app => {
  app.get('/api/surveys/thanks', (req, res) => {
    res.send('Thanks for providing your feedback!');
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    let updatedUser;
    const { title, subject, body, recipients } = req.body;
    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    try {
      // Create and send the email
      const mailer = new Mailer(survey, surveyTemplate(survey));
      await mailer.send();

      // Save the survey
      await survey.save();

      // Deduct a credit from the user and then save the updated user
      req.user.credits -= 1;
      updatedUser = await req.user.save();

      res.send(updatedUser);
    } catch (err) {
      // 422 - Unprocessable entity; send back the error
      res.status(422).send(err);
    }
  });

  // the sendgrid service uses this route
  app.post('/api/surveys/webhooks', (req, res) => {
    // Create a url pathname param parser
    const parser = new Path('/api/surveys/:surveyID/:choice');

    // Parse url for params, remove falseys & duplicates
    const events = _.chain(req.body)
     .map(({ email, url }) => {
       const match = parser.test(new URL(url).pathname);
       if (match) {
         const { surveyID, choice } = match;
         return { email, surveyID, choice };
       }
     })
    .compact()
    .uniqBy('email', 'surveyID')
    .value();
  });
};