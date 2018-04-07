class VMConsole {
  constructor() {
    this.msgCount = 0;
    this.maxMsgCount = 20;
    this.logs = [];
  }

  log(msg) {
    if(msgCount < maxMsgCount)
    {
      logs.push(msg);
      msgCount++;
    }
  }

  logMessages() {
    return this.logs;
  }

}
