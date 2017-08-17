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
  app.get('/api/surveys/:surveyID/:choice', (req, res) => {
    res.send('Thanks for providing your feedback!');
  });

  app.get('/api/surveys', requireLogin, async (req, res) => {
    try {
      // Find surveys, exclude recipients of those surveys
      const surveys = await Survey.find({ _user: req.user.id }).select({ 
        recipients: false 
      });

      res.send(surveys);
    } catch(e) {
      console.error(`Error obtaining surveys: ${e}`);
    }
    
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

  // The sendgrid service uses this route
  app.post('/api/surveys/webhooks', (req, res) => {
    // Create a url pathname param parser
    const parser = new Path('/api/surveys/:surveyID/:choice');

    // Parse url for params, remove falseys & duplicates
    // Query and update survey/recipient in DB
    _.chain(req.body)
     .map(({ email, url }) => {
       const match = parser.test(new URL(url).pathname);
       if (match) {
         const { surveyID, choice } = match;
         return { email, surveyID, choice };
       }
     })
    .compact()
    .uniqBy('email', 'surveyID')
    .each(({ surveyID, email, choice }) => {
      Survey.updateOne({
        // Find survey with recipient that hasn't responded
        _id: surveyID,
        recipients: {
          $elemMatch: { email: email, responded: false }
        }
      }, {
        // Increment yes/no property by 1, based on choice
        $inc: { [choice]: 1 },
        // Matches recipient from original query $elemMatch
        $set: { 'recipients.$.responded': true },
        // Update last responded date
        lastResponded: new Date()
      }).exec();
    })
    .value();
  });
};