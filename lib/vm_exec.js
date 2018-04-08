const VMConsole = require("./vm_console.js");
const vm = require('vm');
const MSGS = require("./msgs.js");
const FORMAT = require("./format.js");

module.exports = class VMExec {
  constructor(code) {
    this.code = code;
  }

  execute() {
    console.log('exec:\n' + this.code);

    var options = {
        timeout: 2000 //ms
    };

    var vmConsole = new VMConsole();
    var sandbox = {
      console: vmConsole
    };

    console.time('vmExec');
    try {
      var result = vm.runInNewContext(this.code, sandbox, options);
    } catch(error) {

      if(error.message.includes("Script execution timed out."))
      {
        return MSGS.SLOW_CODE;
      }

      return MSGS.BAD_CODE + error.message;
    }
    console.timeEnd('vmExec');
    console.log('messages:' + vmConsole.logMessages());

  /**
   * <bold>Console:</bold> (if exists)
   * lines (up to 10)
   * <i>Result:</i>
   * line (multi-block)
   */
   var replyMessage = '';

   if(vmConsole.hasLog())
   {
     replyMessage += "*Console:*\n" + vmConsole.formattedLog();
   }

    console.log('Type:[' + typeof result + '] Value:' + result);
    if(result)
    {
      if(vmConsole.hasLog())
      {
         replyMessage += "\n";
      }
      replyMessage += "*Result:*\n" + FORMAT.BACK_TICKS + "\n" + result + "\n" + FORMAT.BACK_TICKS;
    }

    return replyMessage;
  }
}
