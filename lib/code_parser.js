const FORMAT = require('./format.js');

exports.parseMessage = function(text) {

  if( !this.isCode(text) ) {
    return '';
  }

  var start = text.indexOf(FORMAT.BACK_TICKS);
  var startOffset = start + 3;
  var end = text.indexOf(FORMAT.BACK_TICKS, startOffset);

  // return the code content (without the blocks)
  return text.substring(startOffset, end).trim();
}

exports.isCode = function(text) {

  if(!text.includes(FORMAT.BACK_TICKS))
  {
    return false;
  }

  var start = text.indexOf(FORMAT.BACK_TICKS);
  var end = text.indexOf(FORMAT.BACK_TICKS, start + 3);

  // if we found backticks we have code block
  return end !== -1;
}
