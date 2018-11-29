# slack-light-control
Control Christmas lights from Slack

## Setup

1. Set up a bot user on your Slack instance.
2. Upload a Firmata sketch to your device e.g. https://github.com/firmata/arduino/tree/master/examples/StandardFirmataPlus
3. Attach a basic set of christmas lights to your device with the positive terminal on pin 9 and the negative terminal on GND.
4. Install dependencies and then run slack-light-control with the Slack token, e.g. `SLACK_TOKEN=... node index.js`

## Usage

To issue a message to the bot, send it its name, then the command:

`@lightbot fast`

Valid commands are:
* fast: blink the lights quickly
* normal: blink the lights at a moderate speed
* slow: blink the lights slowly
* on: set the lights to solid on
* off: turn the lights off

## Credit

Some code copied from Slack API documentation examples: http://slackapi.github.io/node-slack-sdk/rtm_api
