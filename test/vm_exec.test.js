const test = require('tape');
const VMExec = require('../lib/vm_exec.js');
const MSGS = require("../lib/msgs.js");
const FORMAT = require("../lib/format.js");

test('Should timeout with long running code and return slow code message', function (t) {

  var code = "while(true);"
  var execVM = new VMExec(code);

  var result = execVM.execute();
  t.equals(result, MSGS.SLOW_CODE, 'Should return slow code message.');
  t.end();
});


test('Should return error when code does not timeout', function(t) {

  var code = "throw new Error('My Error!');"
  var execVM = new VMExec(code);

  var result = execVM.execute();
  t.equals(result, MSGS.BAD_CODE+'My Error!', 'Should return thrown error.');
  t.end();
});

test('Should not return console block when nothing is logged', function(t) {

  var code = "5"
  var execVM = new VMExec(code);

  var expected = `*Result:*
\`\`\`
5
\`\`\``

  t.equals(execVM.execute(), expected, 'Should output the result of the script.');
  t.end();
});

test('Should return console block when something is logged', function(t) {

  var code = "console.log('wow');"
  var execVM = new VMExec(code);
  var expected=`*Console:*
\`\`\`
${FORMAT.CONSOLE_OUT+'wow'}
\`\`\``

  t.equals(execVM.execute(), expected, 'Should return console block.');
  t.end();
});

test('Should not return result when type is a function', function(t) {
  var code = "function a() { return 5; }"
  var execVM = new VMExec(code);

  t.equals(execVM.execute(), '', 'Should not output a result since the result is a function.');
  t.end();
});

test('Should return a result and console when both are used', function(t) {

  var code = `
    console.log('wow');
    function a() { return 'doge';}
    a();
  `

  var execVM = new VMExec(code);
  var expected=`*Console:*
\`\`\`
${FORMAT.CONSOLE_OUT+'wow'}
\`\`\`
*Result:*
\`\`\`
doge
\`\`\``


t.equals(execVM.execute(), expected, 'Should return console and result blocks.');
t.end();
});
