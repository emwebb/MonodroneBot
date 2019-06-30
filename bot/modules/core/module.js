"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var monodronebot_1 = require("../../monodronebot");
var discord_js_1 = require("discord.js");
var timers_1 = require("timers");
var fs = require("fs");
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
        this.bot.registerCommand(new PermissionCommand());
        this.bot.registerCommand(new RestartCommand());
        this.bot.registerCommand(new StopCommand());
    };
    CoreModule.prototype.deregister = function () {
        this.bot.deregisterCommand("ping");
        this.bot.deregisterCommand("help");
        this.bot.deregisterCommand("permission");
        this.bot.deregisterCommand("restart");
        this.bot.deregisterCommand("stop");
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
        return __awaiter(this, void 0, void 0, function () {
            var reply;
            return __generator(this, function (_a) {
                reply = JSON.stringify(input);
                return [2 /*return*/, new monodronebot_1.CommandStringOutput("Pong! : " + reply)];
            });
        });
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
var RestartCommand = /** @class */ (function () {
    function RestartCommand() {
    }
    RestartCommand.prototype.getName = function () {
        return "restart";
    };
    RestartCommand.prototype.call = function (input, scope, caller, bot) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                timers_1.setTimeout(function () {
                    bot.stop();
                }, 5000);
                return [2 /*return*/, new monodronebot_1.CommandStringOutput("Restarting in 5 Seconds.")];
            });
        });
    };
    RestartCommand.prototype.getRequiredPermission = function () {
        return "core.restart";
    };
    RestartCommand.prototype.getShortHelpText = function () {
        return "Restarts the bot.";
    };
    RestartCommand.prototype.getLongHelpText = function () {
        return "Restarts the bot in 5 seconds.";
    };
    return RestartCommand;
}());
var StopCommand = /** @class */ (function () {
    function StopCommand() {
    }
    StopCommand.prototype.getName = function () {
        return "stop";
    };
    StopCommand.prototype.call = function (input, scope, caller, bot) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                timers_1.setTimeout(function () {
                    fs.readdir(".", function (err, files) {
                        if (files.find(function (name) { return name == "restart.txt"; }) != undefined) {
                            fs.unlinkSync("restart.txt");
                        }
                    });
                    bot.stop();
                }, 5000);
                return [2 /*return*/, new monodronebot_1.CommandStringOutput("Stoping in 5 Seconds.")];
            });
        });
    };
    StopCommand.prototype.getRequiredPermission = function () {
        return "core.stop";
    };
    StopCommand.prototype.getShortHelpText = function () {
        return "Stops the bot.";
    };
    StopCommand.prototype.getLongHelpText = function () {
        return "Stops the bot in 5 seconds.";
    };
    return StopCommand;
}());
var HelpCommand = /** @class */ (function () {
    function HelpCommand() {
    }
    HelpCommand.prototype.getName = function () {
        return "help";
    };
    HelpCommand.prototype.call = function (input, scope, caller, bot) {
        return __awaiter(this, void 0, void 0, function () {
            var iterator, value, helpString, specificCommandName, specificCommand, command;
            return __generator(this, function (_a) {
                iterator = bot.getCommands().values();
                helpString = "";
                if (input.length >= 1) {
                    specificCommandName = input[0];
                    if (specificCommandName.hasStringValue()) {
                        specificCommand = bot.getCommands().get(specificCommandName.getStringValue());
                        if (specificCommand == undefined) {
                            return [2 /*return*/, new monodronebot_1.SimpleCommandOutputError("Command does not exist")];
                        }
                        else {
                            return [2 /*return*/, new monodronebot_1.CommandStringOutput(bot.getCommandIndicator() + specificCommand.getName() + " - " + specificCommand.getLongHelpText())];
                        }
                    }
                }
                while (true) {
                    value = iterator.next();
                    if (value.done) {
                        break;
                    }
                    command = value.value;
                    helpString += bot.getCommandIndicator() + command.getName() + " - " + command.getShortHelpText() + "\n";
                }
                return [2 /*return*/, new monodronebot_1.CommandStringOutput(helpString)];
            });
        });
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
var PermissionCommand = /** @class */ (function () {
    function PermissionCommand() {
    }
    PermissionCommand.prototype.getName = function () {
        return "permission";
    };
    PermissionCommand.prototype.call = function (input, scope, caller, bot) {
        return __awaiter(this, void 0, void 0, function () {
            var subCommand, grantee, granteeValue, permissionManager, grant, n, permissionObject;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (input.length < 2) {
                            return [2 /*return*/, new monodronebot_1.SimpleCommandOutputError("Need atleast 2 arguments", "Error : This command needs atleast 2 argumenst")];
                        }
                        if (!(caller instanceof monodronebot_1.UserCaller)) {
                            return [2 /*return*/, new monodronebot_1.SimpleCommandOutputError("This command can only be called from a discord guild.", "Error : This command can only be called from a discord guild.")];
                        }
                        subCommand = input[0];
                        grantee = input[1];
                        if (!(subCommand.hasStringValue() && grantee.hasStringValue())) return [3 /*break*/, 4];
                        granteeValue = void 0;
                        return [4 /*yield*/, bot.getUserFromString(grantee.getStringValue(), caller.getRawMessage().guild)];
                    case 1:
                        granteeValue = _a.sent();
                        if (!(granteeValue == undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, bot.getRoleFromString(grantee.getStringValue(), caller.getRawMessage().guild)];
                    case 2:
                        granteeValue = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (granteeValue == undefined) {
                            if (grantee.getStringValue() == "everyone" || grantee.getStringValue() == "@everyone") {
                                granteeValue = "everyone";
                            }
                        }
                        if (granteeValue == undefined) {
                            return [2 /*return*/, new monodronebot_1.SimpleCommandOutputError("Could not resolve '" + grantee.getUserValue() + "' to Role or User", "Error : Could not resolve '" + grantee.getUserValue() + "' to Role or User")];
                        }
                        permissionManager = bot.getPermissionManager();
                        grant = false;
                        switch (subCommand.getStringValue().toLocaleLowerCase()) {
                            case "grant":
                                grant = true;
                            case "revoke":
                                for (n = 2; n < input.length; n++) {
                                    permissionObject = input[n];
                                    if (permissionObject.hasStringValue()) {
                                        if (grant) {
                                            if (granteeValue instanceof discord_js_1.User) {
                                                permissionManager.grantPermissionToUser(granteeValue, permissionObject.getStringValue());
                                                return [2 /*return*/, new monodronebot_1.CommandStringOutput("Granted " + permissionObject.getStringValue() + " to user " + granteeValue.tag)];
                                            }
                                            if (granteeValue instanceof discord_js_1.Role) {
                                                permissionManager.grantPermissionToRole(granteeValue, permissionObject.getStringValue());
                                                return [2 /*return*/, new monodronebot_1.CommandStringOutput("Granted " + permissionObject.getStringValue() + " to role" + granteeValue.name)];
                                            }
                                            if (granteeValue == "everyone") {
                                                permissionManager.grantPermissionToEveryone(permissionObject.getStringValue());
                                                return [2 /*return*/, new monodronebot_1.CommandStringOutput("Granted " + permissionObject.getStringValue() + " to " + granteeValue)];
                                            }
                                        }
                                        else {
                                            if (granteeValue instanceof discord_js_1.User) {
                                                permissionManager.removePermissionToUser(granteeValue, permissionObject.getStringValue());
                                                return [2 /*return*/, new monodronebot_1.CommandStringOutput("Revoked " + permissionObject.getStringValue() + " from user " + granteeValue.tag)];
                                            }
                                            if (granteeValue instanceof discord_js_1.Role) {
                                                permissionManager.removePermissionToRole(granteeValue, permissionObject.getStringValue());
                                                return [2 /*return*/, new monodronebot_1.CommandStringOutput("Revoked " + permissionObject.getStringValue() + " from role" + granteeValue.name)];
                                            }
                                            if (granteeValue == "everyone") {
                                                permissionManager.removePermissionToEveryone(permissionObject.getStringValue());
                                                return [2 /*return*/, new monodronebot_1.CommandStringOutput("Revoked " + permissionObject.getStringValue() + " from " + granteeValue)];
                                            }
                                        }
                                    }
                                }
                                break;
                            case "list":
                                if (granteeValue instanceof discord_js_1.User) {
                                    return [2 /*return*/, new monodronebot_1.CommandStringOutput(granteeValue.tag + " has permissions :\n" + permissionManager.listPermissionForUser(granteeValue).join("\n"))];
                                }
                                if (granteeValue instanceof discord_js_1.Role) {
                                    return [2 /*return*/, new monodronebot_1.CommandStringOutput(granteeValue.name + " has permissions :\n" + permissionManager.listPermissionForRole(granteeValue).join("\n"))];
                                }
                                if (granteeValue == "everyone") {
                                    return [2 /*return*/, new monodronebot_1.CommandStringOutput(granteeValue + " has permissions :\n" + permissionManager.listPermissionForEveryone().join("\n"))];
                                }
                                break;
                            default:
                                break;
                        }
                        return [3 /*break*/, 5];
                    case 4: return [2 /*return*/, new monodronebot_1.SimpleCommandOutputError("First and Second argument must have string value!", "Error : First and Second argument must have string value! Got '" + subCommand.getUserValue() + "' and '" + grantee.getUserValue() + "' instead.")];
                    case 5: return [2 /*return*/, new monodronebot_1.CommandStringOutput("")];
                }
            });
        });
    };
    PermissionCommand.prototype.getRequiredPermission = function () {
        return "core.permission";
    };
    PermissionCommand.prototype.getShortHelpText = function () {
        return "Grant , Remove or List permissions a role or user has.";
    };
    PermissionCommand.prototype.getLongHelpText = function () {
        return "$permission <grant/revoke/list> <username/userid/role name/role id/everyone> [permission name..]";
    };
    return PermissionCommand;
}());
