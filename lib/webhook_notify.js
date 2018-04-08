const dotenv = require('dotenv');

//load environment variables,
//either from .env files (development),
//heroku environment in production, etc...
dotenv.load();

const { IncomingWebhook, WebClient } = require('@slack/client');

console.log('Getting started with Slack Developer Kit for Node.js');

const webhook = new IncomingWebhook(process.env.slackWebhookURL);
exports.notify = function(msg) {
  webhook.send(msg, (error, resp) => {
    if (error) {
      return console.error(error);
    }
    console.log('Notification sent:' + msg);
  });
}
