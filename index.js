const five = require('johnny-five');
const board = new five.Board({ 'repl':  false });
const { RTMClient } = require('@slack/client');

const token = process.env.SLACK_TOKEN;

const rtm = new RTMClient(token);
rtm.start();

var led;

const slow = 2000;
const normal = 1000;
const fast = 100;

board.on('ready', function() {
  led = new five.Led(9);

  led.blink(normal);
});

rtm.on('message', (message) => {
  // Skip messages that are from a bot or my own user ID
  if ( (message.subtype && message.subtype === 'bot_message') ||
      (!message.subtype && message.user === rtm.activeUserId) ) {
    return;
  }

  // Check that the message is a real message and addresses me
  regex = RegExp('^<@' + rtm.activeUserId + '> ');
  if(message.subtype == null && regex.test(message.text)){
    var body = message.text.replace(regex, '');
  } else {
    return;
  }

  console.log(`(channel:${message.channel}) ${message.user} says: ${message.text}`);

  // Carry out the action
  switch (body) {
    case 'fast':
      led.blink(fast);
      break;
    case 'normal':
      led.blink(normal);
      break;
    case 'slow':
      led.blink(slow);
      break;
    case 'on':
      led.stop();
      led.on();
      break;
    case 'off':
      led.stop();
      led.off();
      break;
  }
});
