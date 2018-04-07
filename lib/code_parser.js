const backTicks = "\`\`\`"

exports.parseMessage = function(text) {
  // todo parsify

  if(!text.includes(backTicks))
  {
    return '';
  }

  var start = text.indexOf(backTicks);
  var end = text.indexOf(backTicks, start+3);

  // not closed
  if(end === -1)
  {
    return '';
  }

  // return just the code
  return text.substring(start+3, end).trim();
};
