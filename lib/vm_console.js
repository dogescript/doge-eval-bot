const FORMAT = require("./format.js");

module.exports = class VMConsole {
  constructor() {
    this.msgCount = 0;
    this.maxMsgCount = 20;
    this.logs = [];
  }

  log(msg) {

    if(this.msgCount < this.maxMsgCount)
    {
      this.logs.push(msg);
      this.msgCount++;
    }
    else {
      // roll over.
      this.logs.shift();
      this.logs.push(msg);
    }
  }

  logMessages() {
    return this.logs;
  }

  hasLog() {
    return this.logs.length > 0;
  }

  formattedLog() {
    if(!this.hasLog())
    {
      return '';
    }

    return FORMAT.BACK_TICKS + "\n" + this.logMessages().map(s => ':> '+s).join("\n")+ "\n" + FORMAT.BACK_TICKS;
  }

}
