const webhookNotify = require('./lib/webhook_notify.js');
const currentTime = new Date().toTimeString();
webhookNotify.notify(`Bot connected, it is currently ${currentTime}`);
