# doge-eval-bot

A Slack bot which can evaluate dogescript when mentioned.

Created with [Botkit](https://botkit.ai) starter.

## Integrations

The bot uses the `@slack/client` module to post notifications to the channel when a redeploy occurs. The commit hash on `dogescript` that caused the redeploy will be logged on the `dogebot-devel` slack channel.


## TODOS

- parse code as dogescript (/)
- eval dogescript in vm (/)
  - perhaps intercept console (/)
  - add timeout so things don't crash (still timing out forever and not coming back)
  - add limit on log lines to 20 (/)
- configure travis to deploy on master build
  - add hook to rebuild doge-eval-bot with latest dogescript
  - notify on redeploy with commit hash
- notify on wakeup (post to dogebot-devel with timestamp)


## Commands

The bot supports the following commands:

* `help`: displays a list of commands. TODO
* `version`: replies with the loaded version of dogescript. TODO

## Evaluation

The bot evaluates dogescript code in a code block when mentioned or dm'd.

The evaluation context has access to the following objects/functions:

* `console.log`: logs to a console, output is returned in the format `:> ${msg}` where `${msg}` is your log message.
