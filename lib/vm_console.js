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
  }

  logMessages() {
    return this.logs;
  }

}
