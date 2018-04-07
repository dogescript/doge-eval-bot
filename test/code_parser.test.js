const test = require('tape');
const codeParser = require('../lib/code_parser.js')

test('should not find code when backTicks are not present.', function (t) {

  var regularText = 'hi'
  t.equal(codeParser.parseMessage(regularText), '', 'code should not be found.')
  t.end();
});

test('should not find code when backTicks are not closed.', function(t) {

  var unclosedText = `
    some code
    \`\`\`
  `
  t.equal(codeParser.parseMessage(unclosedText),'', 'code should not be found.');
  t.end();

});

test('should find code when backTicks are closed.', function(t) {

  var code = `
    \`\`\`
    plz console dose loge with 'wow'
    \`\`\`
  `

  t.equal(codeParser.parseMessage(code),'plz console dose loge with \'wow\'', 'code should be found.');
  t.end();
});
