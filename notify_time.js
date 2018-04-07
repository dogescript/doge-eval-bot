var env = require('node-env-file');
env(__dirname + '/.env');

const { IncomingWebhook, WebClient } = require('@slack/client');

console.log('Getting started with Slack Developer Kit for Node.js');

const timeNotification = new IncomingWebhook(process.env.slackWebhookURL);
const currentTime = new Date().toTimeString();
timeNotification.send(`Deploying at ${currentTime}`, (error, resp) => {
  if (error) {
    return console.error(error);
  }
  console.log('Notification sent');
});
