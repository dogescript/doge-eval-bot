const test = require('tape');
const VMConsole = require('../lib/vm_console.js');
const FORMAT = require('../lib/format.js');

test('Formatted log when no messages are logged', function(t) {

  var vmConsole = new VMConsole();

  t.equals(vmConsole.formattedLog(), '', 'Should return empty string.');
  t.end();
});

test('Formatted log when at least one message is logged', function(t) {

  var vmConsole = new VMConsole();
  vmConsole.log('hello world.');

  var expected = `\`\`\`
${FORMAT.CONSOLE_OUT+'hello world.'}
\`\`\``

  t.equals(vmConsole.formattedLog(), expected, 'Should return code block message.');
  t.end();
});

test('Formatted log when multiple messages are logged.', function(t) {

  var vmConsole = new VMConsole();
  vmConsole.log('hello world.');
  vmConsole.log('goodbye world.');

  var expected = `\`\`\`
${FORMAT.CONSOLE_OUT+'hello world.'}
${FORMAT.CONSOLE_OUT+'goodbye world.'}
\`\`\``

  t.equals(vmConsole.formattedLog(), expected, 'Should return multiple logs with line separator.');
  t.end();
});

test('Formatted log when multiline message is logged', function(t) {

  var vmConsole = new VMConsole();
  vmConsole.log('hello world.\ngoodbye world.');

  var expected = `\`\`\`
${FORMAT.CONSOLE_OUT+'hello world.'}
goodbye world.
\`\`\``

  t.equals(vmConsole.formattedLog(), expected, 'Should preserve multiline.');
  t.end();
});

test('Log rollover', function(t) {

  var vmConsole = new VMConsole();
  for(i = 0; i < 22; i++) {
    vmConsole.log(i);
  }

  t.equals(vmConsole.logMessages().length, 20, 'Should cap at 20.');
  t.notOk(vmConsole.logMessages().includes(1), 'Should roll over 1.');
  t.end();
});

test('hasLog with no messages', function(t) {

  var vmConsole = new VMConsole();

  t.notOk(vmConsole.hasLog(), 'Should not have a log');
  t.end();
});

test('hasLog with messages', function(t) {

  var vmConsole = new VMConsole();
  vmConsole.log('hello world.');

  t.ok(vmConsole.hasLog(), 'Should have a log');
  t.end();
});
