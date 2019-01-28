"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var monodronebot_1 = require("./monodronebot");
var token = process.argv[2];
var bot = new monodronebot_1.MonodroneBot(token);
var PingCommand = /** @class */ (function () {
    function PingCommand() {
    }
    PingCommand.prototype.getName = function () {
        return "ping";
    };
    PingCommand.prototype.call = function (input, scope, caller) {
        var reply = JSON.stringify(input);
        return new monodronebot_1.CommandStringOutput("Pong! : " + reply);
    };
    PingCommand.prototype.getRequiredPermission = function () {
        return "core.ping";
    };
    PingCommand.prototype.getShortHelpText = function () {
        return "Bounces back!";
    };
    PingCommand.prototype.getLongHelpText = function () {
        return "Replies Pong! plus any other argumenst you sent it.";
    };
    return PingCommand;
}());
bot.registerCommand(new PingCommand());
bot.login();
process.on("SIGINT", function () {
    console.log("Stopping");
    bot.stop();
});
