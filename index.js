const five = require('johnny-five');
const board = new five.Board({ 'repl':  false });
const { RTMClient } = require('@slack/rtm-api');
const morsify = require('morsify');

const token = process.env.SLACK_TOKEN;

const rtm = new RTMClient(token);
rtm.start();

var led;

const slow = 2000;
const normal = 1000;
const fast = 100;
const sleep_length = 250;

board.on('ready', function() {
  led = new five.Led(9);

  led.blink(normal);
});

blink = function(){
  led.blink(normal);
}

pause = function(message) {
  led.stop();
  led.off();
  setTimeout(function(){ morse(message); }, sleep_length);
}

morse = function(message) {
  if(!message.length) { setTimeout(blink, sleep_length * 4); return; };
  switch (message[0]) {
    case '.':
      led.on();
      setTimeout(function(){ pause(message.slice(1)); }, sleep_length);
      break;
    case '-':
      led.on();
      setTimeout(function(){ pause(message.slice(1)); }, sleep_length * 2);
      break;
    case '/':
      setTimeout(function(){ pause(message.slice(1)); }, sleep_length * 2);
      break;
  }
}

rtm.on('message', (message) => {
  // Skip messages that are from a bot or my own user ID
  if ( (message.subtype && message.subtype === 'bot_message') ||
      (!message.subtype && message.user === rtm.activeUserId) ) {
    return;
  }

  // Check that the message is a real message and addresses me
  regex = RegExp('^<@' + rtm.activeUserId + '> ?');
  if(message.subtype == null && regex.test(message.text)){
    var body = message.text.replace(regex, '');
  } else {
    return;
  }

  console.log(`(channel:${message.channel}) ${message.user} says: ${message.text}`);

  if(body.length){
    // Carry out the action
    if(body[0] == '!'){
      switch (body.slice(1)) {
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
    } else {
      pause(morsify.encode(body).split(''));
    }
  }
});
