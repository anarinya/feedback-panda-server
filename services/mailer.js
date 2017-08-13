const sendgrid = require('sendgrid');
const helper = sendgrid.mail;

class Mailer extends helper.Mail {
  constructor({ subject, recipients }, template) {
    super();

    this.sendgridAPI = sendgrid(process.env.SENDGRID_KEY);
    this.from_email = new helper.Email('no-reply@feedback-panda.com');
    this.subject = subject;
    this.body = new helper.Content('text/html', template);
    this.recipients = this.formatEmails(recipients);

    // sendgrid built-in func, adds content to template
    this.addContent(this.body);
    // enable click tracking within an email
    this.addClickTracking();
    // process recipient list
    this.addRecipients();
  }

  formatEmails(recipients) {
    return recipients.map(({ email }) => {
      // use sendgrid email helper to format
      return new helper.Email(email);
    });
  }

  addRecipients() {
    const personalize = new helper.Personalization();
    // add each recipient to the personalize object
    this.recipients.forEach(recipient => {
      personalize.addTo(recipient);
    });

    this.addPersonalization(personalize);
  }

  addClickTracking() {
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);

    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

  async send() {
    try {
      const request = this.sendgridAPI.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: this.toJSON()
      });

      const response = await this.sendgridAPI.API(request);
      return response;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Mailer;