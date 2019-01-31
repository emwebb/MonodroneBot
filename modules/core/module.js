"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var monodronebot_1 = require("../../monodronebot");
var CoreModule = /** @class */ (function () {
    function CoreModule() {
    }
    CoreModule.prototype.getId = function () {
        return "core";
    };
    CoreModule.prototype.getName = function () {
        return "Core";
    };
    CoreModule.prototype.register = function (bot) {
        this.bot = bot;
        this.bot.registerCommand(new PingCommand());
        this.bot.registerCommand(new HelpCommand());
    };
    CoreModule.prototype.deregister = function () {
        this.bot.deregisterCommand("ping");
        this.bot.deregisterCommand("help");
    };
    CoreModule.prototype.configsSave = function () {
    };
    return CoreModule;
}());
exports.default = CoreModule;
var PingCommand = /** @class */ (function () {
    function PingCommand() {
    }
    PingCommand.prototype.getName = function () {
        return "ping";
    };
    PingCommand.prototype.call = function (input, scope, caller, bot) {
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
        return "Replies Pong! Plus any other argumenst you sent it.";
    };
    return PingCommand;
}());
var HelpCommand = /** @class */ (function () {
    function HelpCommand() {
    }
    HelpCommand.prototype.getName = function () {
        return "help";
    };
    HelpCommand.prototype.call = function (input, scope, caller, bot) {
        var iterator = bot.getCommands().values();
        var value;
        var helpString = "";
        while (true) {
            value = iterator.next();
            if (value.done) {
                break;
            }
            var command = value.value;
            helpString += bot.getCommandIndicator() + command.getName() + " - " + command.getShortHelpText() + "\n";
        }
        return new monodronebot_1.CommandStringOutput(helpString);
    };
    HelpCommand.prototype.getRequiredPermission = function () {
        return "core.help";
    };
    HelpCommand.prototype.getShortHelpText = function () {
        return "Shows a list of commands and description.";
    };
    HelpCommand.prototype.getLongHelpText = function () {
        return "Shows a list of commands and descriptions.";
    };
    return HelpCommand;
}());
