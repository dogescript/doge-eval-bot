# doge-eval-bot

A Slack bot which can evaluate dogescript when mentioned.

Created with [Botkit](https://botkit.ai) starter.

## Integrations

The bot uses the `@slack/client` module to post notifications to the channel when a redeploy occurs. The commit hash on `dogescript` that caused the redeploy will be logged on the `dogebot-devel` slack channel.


## Commands

The bot supports the following commands:

* `help`: displays a list of commands. **TODO**
* `version`: replies with the loaded version of dogescript.  **TODO**

## Evaluation

The bot evaluates dogescript code in a code block when mentioned or dm'd.

The evaluation context has access to the following objects/functions:

* `console.log`: logs to a console, output is returned in the format `:> ${msg}` where `${msg}` is your log message.
