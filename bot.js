/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


This is a sample Slack bot built with Botkit.

This bot demonstrates many of the core features of Botkit:

* Connect to Slack using the real time API
* Receive messages based on "spoken" patterns
* Reply to messages
* Use the conversation system to ask questions
* Use the built in storage system to store and retrieve information
  for a user.

# RUN THE BOT:

  Create a new app via the Slack Developer site:

    -> http://api.slack.com

  Get a Botkit Studio token from Botkit.ai:

    -> https://studio.botkit.ai/

  Run your bot from the command line:

    clientId=<MY SLACK TOKEN> clientSecret=<my client secret> PORT=<3000> studio_token=<MY BOTKIT STUDIO TOKEN> node bot.js

# USE THE BOT:

    Navigate to the built-in login page:

    https://<myhost.com>/login

    This will authenticate you with Slack.

    If successful, your bot will come online and greet you.


# EXTEND THE BOT:

  Botkit has many features for building cool and useful bots!

  Read all about it here:

    -> http://howdy.ai/botkit

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var dotenv = require('dotenv');

//load environment variables,
//either from .env files (development),
//heroku environment in production, etc...
dotenv.load();

if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT) {
  usage_tip();
  // process.exit(1);
}

var Botkit = require('botkit');
var debug = require('debug')('botkit:main');

var bot_options = {
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    debug: true,
    scopes: ['bot'],
    studio_token: process.env.studio_token,
    studio_command_uri: process.env.studio_command_uri
};

// Use a mongo database if specified, otherwise store in a JSON file local to the app.
// Mongo is automatically configured when deploying to Heroku
if (process.env.MONGODB_URI) {
    console.log('Mongo Storage')
    var mongoStorage = require('botkit-storage-mongo')({mongoUri: process.env.MONGODB_URI});
    bot_options.storage = mongoStorage;
} else {
    console.log('JSON Storage')
    bot_options.json_file_store = __dirname + '/.data/db/'; // store user data in a simple JSON format
}

// Create the Botkit controller, which controls all instances of the bot.
var controller = Botkit.slackbot(bot_options);

controller.startTicking();

// Set up an Express-powered webserver to expose oauth and webhook endpoints
var webserver = require(__dirname + '/components/express_webserver.js')(controller);

webserver.get('/', function(req, res){
res.render('index', {
  domain: req.get('host'),
  protocol: req.protocol,
  glitch_domain:  process.env.PROJECT_DOMAIN,
  layout: 'layouts/default'
  });
})
// Set up a simple storage backend for keeping a record of customers
// who sign up for the app via the oauth
require(__dirname + '/components/user_registration.js')(controller);

// Send an onboarding message when a new team joins
require(__dirname + '/components/onboarding.js')(controller);

// Load in some helpers that make running Botkit on Glitch.com better
require(__dirname + '/components/plugin_glitch.js')(controller);

// enable advanced botkit studio metrics
require('botkit-studio-metrics')(controller);

var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
require("./skills/" + file)(controller);
});

// This captures and evaluates any message sent to the bot as a DM
// or sent to the bot in the form "@bot message" and passes it to
// Botkit Studio to evaluate for trigger words and patterns.
// If a trigger is matched, the conversation will automatically fire!
// You can tie into the execution of the script using the functions
// controller.studio.before, controller.studio.after and controller.studio.validate

var codeParser = require("./lib/code_parser.js");
var VMConsole = require("./lib/vm_console.js");

const vm = require('vm');
const dogescript = require('dogescript');
const backTicks = "\`\`\`"

// console.log(dogescript);
//
// var dsParsed = dogescript('plz console.loge with \'doge\'');
// console.log(dsParsed);
//
// var vmc = new VMConsole();
// vm.runInNewContext(dsParsed,
//   {
//     console: vmc,
//     timeout: 5000
//   }
// );
// console.log(vmc.logMessages());

controller.on('direct_message,direct_mention,mention', function(bot, message){
  console.log('got:\n' + message.text);

  var parsed = codeParser.parseMessage(message.text);
  if(parsed === '')
  {
    bot.reply(message, 'plz provide code block!');
  }
  else
  {

    var vmConsole = new VMConsole();
    var jsCode = dogescript(parsed);
    console.log('exec:\n' + jsCode);

    var options = {
        timeout: 2000 //ms
    };

    var sandbox = {
      console: vmConsole
    };

    console.time('vmExec');
    var result = vm.runInNewContext(jsCode,sandbox,options);
    console.timeEnd('vmExec');
    console.log('messages:' + vmConsole.logMessages());

    var formatted = backTicks + "\n" + vmConsole.logMessages().map(s => ':> '+s).join("\n") + "\n" + result + +"\n"+ backTicks;

    // todo get the result
    bot.reply(message, formatted);
  }

});


function usage_tip() {
    console.log('~~~~~~~~~~');
    console.log('Botkit Starter Kit');
    console.log('Execute your bot application like this:');
    console.log('clientId=<MY SLACK CLIENT ID> clientSecret=<MY CLIENT SECRET> PORT=3000 studio_token=<MY BOTKIT STUDIO TOKEN> node bot.js');
    console.log('Get Slack app credentials here: https://api.slack.com/apps')
    console.log('Get a Botkit Studio token here: https://studio.botkit.ai/')
    console.log('~~~~~~~~~~');
}
