const test = require('tape');
const codeParser = require('../lib/code_parser.js')

test('Message without backTicks', function (t) {

  var regularText = 'hi'
  t.notOk(codeParser.isCode(regularText), 'code should not be found.');
  t.equal(codeParser.parseMessage(regularText), '', 'should return empty string.');
  t.end();
});

test('Message with broken backTicks', function(t) {

  var unclosedText = `
    some code
    \`\`\`
  `
  t.notOk(codeParser.isCode(unclosedText), 'code should not be found.');
  t.equal(codeParser.parseMessage(unclosedText),'', 'should return empty string.');
  t.end();

});

test('should find code when backTicks are closed.', function(t) {

  var code = `
    \`\`\`
    plz console dose loge with 'wow'
    \`\`\`
  `

  t.ok(codeParser.isCode(code), 'should find code.');
  t.equal(codeParser.parseMessage(code),'plz console dose loge with \'wow\'', 'should return code without blocks.');
  t.end();
});
