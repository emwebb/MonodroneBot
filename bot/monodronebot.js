"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var discord_js_1 = require("discord.js");
var commandinterpreter_1 = require("./commandinterpreter");
var fs = require("fs");
var events_1 = require("events");
var mongoose = require("mongoose");
var marked = require("marked");
var TerminalRenderer = require("marked-terminal");
marked.setOptions({
    // Define custom renderer
    renderer: new TerminalRenderer()
});
var MonodroneBot = /** @class */ (function (_super) {
    __extends(MonodroneBot, _super);
    function MonodroneBot(token) {
        var _this = _super.call(this) || this;
        _this.client = new discord_js_1.Client();
        _this.commands = new Map();
        _this.consoleCaller = new ConsoleCaller(_this);
        _this.scopes = new Map();
        _this.permissionManager = new PermissionManager();
        _this.modules = new Map();
        _this.configLoader = new ConfigLoader();
        _this.permissionManager.loadFromConfig(_this.configLoader.get("permissions"));
        var databaseUrl = _this.configLoader.get("mongoDBURL");
        if (databaseUrl == undefined) {
            _this.stop();
            throw new Error("Fatal Error : No mongoDBURL in config.");
        }
        mongoose.connect(databaseUrl, { useNewUrlParser: true }, function (err) {
            if (err) {
                console.error(err);
            }
            else {
                console.log("Connected to database");
            }
        });
        if (token != undefined) {
            _this.token = token;
        }
        else {
            _this.token = _this.configLoader.get("token");
        }
        var commandIndicator = _this.configLoader.get("commandIndicator");
        if (commandIndicator == undefined) {
            commandIndicator = "$";
        }
        _this.commandIndicator = commandIndicator;
        _this.client.on("message", function (message) {
            console.log("Recieved message! : " + message.content);
            if (message.content.startsWith(_this.commandIndicator)) {
                _this.consoleCaller.message("Command Recieved : \n" + message.content);
                var caller = new UserCaller(message, _this);
                var scope = _this.getScope("discord:" + message.channel.id);
                var interpreter = new commandinterpreter_1.CommandInterpreter(_this, message.content, caller, scope);
                interpreter.interpret().then(function (output) {
                    message.reply(output.getUserValue());
                }).catch(function (reason) {
                    var error = new SimpleCommandOutputError("There was an error while trying to run the command '" + JSON.stringify(reason) + "'", "Error : There was an error while trying to run the command '" + JSON.stringify(reason) + "'");
                    message.reply(error);
                });
            }
        });
        _this.emit("start");
        return _this;
    }
    MonodroneBot.prototype.login = function () {
        this.client.login(this.token)
            .then(console.log)
            .catch(console.error);
    };
    MonodroneBot.prototype.stop = function () {
        var _this = this;
        this.emit("stop");
        this.configLoader.set("permissions", this.permissionManager.saveToConfig());
        this.configLoader.set("token", this.token);
        this.configLoader.set("commandIndicator", this.commandIndicator);
        this.modules.forEach(function (module, key, map) {
            module.configsSave();
            module.deregister();
            _this.modules.delete(key);
        });
        this.configLoader.save();
        mongoose.connection.close();
        this.client.destroy()
            .then(console.log)
            .catch(console.error);
    };
    MonodroneBot.prototype.getScope = function (id) {
        if (this.scopes.has(id)) {
            return this.scopes.get(id);
        }
        else {
            this.scopes.set(id, new ScopeStack());
            return this.scopes.get(id);
        }
    };
    MonodroneBot.prototype.runCommand = function (name, commandArguments, scope, caller) {
        return __awaiter(this, void 0, void 0, function () {
            var command, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        if (!this.commands.has(name)) return [3 /*break*/, 4];
                        command = this.commands.get(name);
                        if (!caller.hasPermission(command.getRequiredPermission())) return [3 /*break*/, 2];
                        return [4 /*yield*/, command.call(commandArguments, scope, caller, this)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, new SimpleCommandOutputError("Do not have permission", "Error :  You do not have permission " + command.getRequiredPermission() + " which is required to run this command.")];
                    case 3: return [3 /*break*/, 5];
                    case 4: return [2 /*return*/, new SimpleCommandOutputError("Command does not exist", "Error :  Command '" + name + "' does not exist!")];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        console.log(error_1);
                        if (error_1 instanceof Error) {
                            return [2 /*return*/, new SimpleCommandOutputError(error_1.name + "\n" + error_1.message + "\n" + error_1.stack, "Error :  Command failed with an error : " + error_1.message)];
                        }
                        return [2 /*return*/, new SimpleCommandOutputError(JSON.stringify(error_1), "Error :  Command failed with an error : " + JSON.stringify(error_1))];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    MonodroneBot.prototype.registerCommand = function (command) {
        this.commands.set(command.getName(), command);
    };
    MonodroneBot.prototype.deregisterCommand = function (commandName) {
        this.commands.delete(commandName);
    };
    MonodroneBot.prototype.registerModule = function (module) {
        module.register(this);
        this.modules.set(module.getId(), module);
    };
    MonodroneBot.prototype.dergisterModule = function (moduleId) {
        if (this.modules.has(moduleId)) {
            this.modules.get(moduleId).deregister();
            this.modules.delete(moduleId);
        }
    };
    MonodroneBot.prototype.getModule = function (moduleName) {
        return this.modules.get(moduleName);
    };
    MonodroneBot.prototype.getClient = function () {
        return this.client;
    };
    MonodroneBot.prototype.getCommandIndicator = function () {
        return this.commandIndicator;
    };
    MonodroneBot.prototype.getConfigLoader = function () {
        return this.configLoader;
    };
    MonodroneBot.prototype.getPermissionManager = function () {
        return this.permissionManager;
    };
    MonodroneBot.prototype.getCommands = function () {
        return this.commands;
    };
    MonodroneBot.prototype.getUserFromString = function (userString, guild) {
        return __awaiter(this, void 0, void 0, function () {
            var userMentionRegex, userId, user, member;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userMentionRegex = /<@\![0-9]*>/g;
                        if (!userMentionRegex.test(userString)) return [3 /*break*/, 2];
                        userId = userString.substring(3, userString.length - 1);
                        return [4 /*yield*/, this.client.fetchUser(userId)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, Promise.resolve(user)];
                    case 2:
                        member = guild.members.find(function (user) {
                            return user.displayName == userString ||
                                user.id == userString ||
                                user.user.tag == userString ||
                                "@" + user.user.tag == userString;
                        });
                        if (member == undefined) {
                            return [2 /*return*/, Promise.resolve(undefined)];
                        }
                        return [2 /*return*/, Promise.resolve(member.user)];
                }
            });
        });
    };
    MonodroneBot.prototype.getRoleFromString = function (roleString, guild) {
        return __awaiter(this, void 0, void 0, function () {
            var roleMentionableRegex, roleId, user, role;
            return __generator(this, function (_a) {
                roleMentionableRegex = /<@\&[0-9]*>/g;
                if (roleMentionableRegex.test(roleString)) {
                    roleId = roleString.substring(3, roleString.length - 1);
                    user = guild.roles.get(roleId);
                    return [2 /*return*/, Promise.resolve(user)];
                }
                role = guild.roles.find(function (role) {
                    return role.name == roleString ||
                        "@" + role.name == roleString;
                });
                return [2 /*return*/, Promise.resolve(role)];
            });
        });
    };
    return MonodroneBot;
}(events_1.EventEmitter));
exports.MonodroneBot = MonodroneBot;
var ConfigLoader = /** @class */ (function () {
    function ConfigLoader() {
        if (fs.existsSync("config.json")) {
            var configString = fs.readFileSync("config.json", { "encoding": "utf8" });
            this.config = JSON.parse(configString);
        }
        else {
            this.config = {};
        }
    }
    ConfigLoader.prototype.get = function (key) {
        return this.config[key];
    };
    ConfigLoader.prototype.set = function (key, value) {
        this.config[key] = value;
    };
    ConfigLoader.prototype.save = function () {
        var configString = JSON.stringify(this.config, undefined, 4);
        fs.writeFileSync("config.json", configString, { encoding: "utf8" });
    };
    return ConfigLoader;
}());
exports.ConfigLoader = ConfigLoader;
var CommandError = /** @class */ (function () {
    function CommandError() {
    }
    CommandError.prototype.hasNumberValue = function () {
        return false;
    };
    CommandError.prototype.getNumberValue = function () {
        return null;
    };
    CommandError.prototype.hasStringValue = function () {
        return true;
    };
    CommandError.prototype.getStringValue = function () {
        return this.getErrorString();
    };
    CommandError.prototype.getUserValue = function () {
        return this.getUserReadibleError();
    };
    CommandError.prototype.getValueType = function () {
        return "string";
    };
    CommandError.prototype.getValue = function () {
        return this.getErrorString();
    };
    return CommandError;
}());
exports.CommandError = CommandError;
var SimpleCommandError = /** @class */ (function (_super) {
    __extends(SimpleCommandError, _super);
    function SimpleCommandError(error, userError) {
        var _this = _super.call(this) || this;
        _this.error = error;
        _this.userError = userError;
        return _this;
    }
    SimpleCommandError.prototype.getUserReadibleError = function () {
        return this.userError;
    };
    SimpleCommandError.prototype.getErrorString = function () {
        return this.error;
    };
    return SimpleCommandError;
}(CommandError));
exports.SimpleCommandError = SimpleCommandError;
var CommandNull = /** @class */ (function () {
    function CommandNull(causeOfNull) {
        this.causeOfNull = causeOfNull;
    }
    CommandNull.prototype.getUserReadibleError = function () {
        return "Error : A value was null. Reason : " + this.causeOfNull;
    };
    CommandNull.prototype.getErrorString = function () {
        return "Null value : " + this.causeOfNull;
    };
    CommandNull.prototype.hasNumberValue = function () {
        return false;
    };
    CommandNull.prototype.getNumberValue = function () {
        return null;
    };
    CommandNull.prototype.hasStringValue = function () {
        return true;
    };
    CommandNull.prototype.getStringValue = function () {
        return "null";
    };
    CommandNull.prototype.getUserValue = function () {
        return "NULL";
    };
    CommandNull.prototype.getValueType = function () {
        return "null";
    };
    CommandNull.prototype.getValue = function () {
        return null;
    };
    return CommandNull;
}());
exports.CommandNull = CommandNull;
var SimpleCommandOutputError = /** @class */ (function () {
    function SimpleCommandOutputError(error, userError) {
        if (userError == undefined) {
            userError = "Error : " + error;
        }
        this.error = new SimpleCommandError(error, userError);
    }
    SimpleCommandOutputError.prototype.hadError = function () {
        return true;
    };
    SimpleCommandOutputError.prototype.getError = function () {
        return this.error;
    };
    SimpleCommandOutputError.prototype.hasNumberValue = function () {
        return false;
    };
    SimpleCommandOutputError.prototype.getNumberValue = function () {
        return null;
    };
    SimpleCommandOutputError.prototype.hasStringValue = function () {
        return true;
    };
    SimpleCommandOutputError.prototype.getStringValue = function () {
        return this.error.getStringValue();
    };
    SimpleCommandOutputError.prototype.getUserValue = function () {
        return this.error.getUserValue();
    };
    SimpleCommandOutputError.prototype.getValueType = function () {
        return "string";
    };
    SimpleCommandOutputError.prototype.getValue = function () {
        return this.error.getValue();
    };
    return SimpleCommandOutputError;
}());
exports.SimpleCommandOutputError = SimpleCommandOutputError;
var CommandObjectArray = /** @class */ (function () {
    function CommandObjectArray(values) {
        this.arrayValues = values;
    }
    CommandObjectArray.prototype.hasNumberValue = function () {
        return true;
    };
    CommandObjectArray.prototype.getNumberValue = function () {
        return this.arrayValues.length;
    };
    CommandObjectArray.prototype.hasStringValue = function () {
        return this.arrayValues.map(function (value) { return value.hasStringValue(); }).reduce(function (pre, cur) { return pre && cur; });
    };
    CommandObjectArray.prototype.getStringValue = function () {
        if (this.hasStringValue) {
            return this.arrayValues.map(function (value) { return value.getStringValue(); }).join("\n");
        }
        else {
            return null;
        }
    };
    CommandObjectArray.prototype.getUserValue = function () {
        return this.arrayValues.map(function (value) { return value.getUserValue(); }).join("\n");
    };
    CommandObjectArray.prototype.getValueType = function () {
        return "Array";
    };
    CommandObjectArray.prototype.getValue = function () {
        return this.arrayValues;
    };
    return CommandObjectArray;
}());
exports.CommandObjectArray = CommandObjectArray;
var CommandOutputArray = /** @class */ (function (_super) {
    __extends(CommandOutputArray, _super);
    function CommandOutputArray(values, error) {
        var _this = _super.call(this, values) || this;
        _this.error = error;
        return _this;
    }
    CommandOutputArray.prototype.hadError = function () {
        return this.error != undefined;
    };
    CommandOutputArray.prototype.getError = function () {
        return this.error;
    };
    return CommandOutputArray;
}(CommandObjectArray));
exports.CommandOutputArray = CommandOutputArray;
var CommandString = /** @class */ (function () {
    function CommandString(value) {
        this.value = value;
    }
    CommandString.prototype.hasNumberValue = function () {
        return false;
    };
    CommandString.prototype.getNumberValue = function () {
        return null;
    };
    CommandString.prototype.hasStringValue = function () {
        return true;
    };
    CommandString.prototype.getStringValue = function () {
        return this.value;
    };
    CommandString.prototype.getUserValue = function () {
        return this.value;
    };
    CommandString.prototype.getValueType = function () {
        return "string";
    };
    CommandString.prototype.getValue = function () {
        return this.value;
    };
    return CommandString;
}());
exports.CommandString = CommandString;
var CommandNumber = /** @class */ (function () {
    function CommandNumber(value) {
        this.value = value;
    }
    CommandNumber.prototype.hasNumberValue = function () {
        return true;
    };
    CommandNumber.prototype.getNumberValue = function () {
        return this.value;
    };
    CommandNumber.prototype.hasStringValue = function () {
        return true;
    };
    CommandNumber.prototype.getStringValue = function () {
        return this.value.toString();
    };
    CommandNumber.prototype.getUserValue = function () {
        return this.value.toString();
    };
    CommandNumber.prototype.getValueType = function () {
        return "number";
    };
    CommandNumber.prototype.getValue = function () {
        return this.value;
    };
    return CommandNumber;
}());
exports.CommandNumber = CommandNumber;
var CommandStringOutput = /** @class */ (function (_super) {
    __extends(CommandStringOutput, _super);
    function CommandStringOutput(value, error) {
        var _this = _super.call(this, value) || this;
        _this.error = error;
        return _this;
    }
    CommandStringOutput.prototype.hadError = function () {
        return this.error != null;
    };
    CommandStringOutput.prototype.getError = function () {
        return this.error;
    };
    return CommandStringOutput;
}(CommandString));
exports.CommandStringOutput = CommandStringOutput;
var Scope = /** @class */ (function () {
    function Scope() {
        this.scopeMap = new Map();
    }
    Scope.prototype.has = function (key) {
        return this.scopeMap.has(key);
    };
    Scope.prototype.get = function (key) {
        var value = this.scopeMap.get(key);
        if (value == undefined) {
            return new CommandNull("Variable '" + key + "' does not exist in the current scope.");
        }
        else {
            return value;
        }
    };
    Scope.prototype.set = function (key, value) {
        this.scopeMap.set(key, value);
    };
    return Scope;
}());
var ScopeStack = /** @class */ (function () {
    function ScopeStack() {
        this.scopes = new Array();
        this.scopes.push(new Scope());
    }
    ScopeStack.prototype.getValue = function (name, down) {
        if (down == undefined) {
            down = 0;
        }
        for (var n = this.scopes.length - 1 - down; n >= 0; n--) {
            if (this.scopes[n].has(name)) {
                return this.scopes[n].get(name);
            }
        }
        return new CommandNull("Variable '" + name + "' does not exist in the current scope.");
        ;
    };
    ScopeStack.prototype.hasValue = function (name, down) {
        if (down == null) {
            down = 0;
        }
        for (var n = this.scopes.length - 1 - down; n >= 0; n--) {
            if (this.scopes[n].has(name)) {
                return true;
            }
        }
        return false;
    };
    ScopeStack.prototype.setValue = function (name, value, down) {
        if (down == null) {
            down = 0;
        }
        var n = this.scopes.length - 1 - down;
        this.scopes[n].set(name, value);
    };
    ScopeStack.prototype.pop = function () {
        if (this.scopes.length > 1) {
            return this.scopes.pop();
        }
        else {
            return null;
        }
    };
    ScopeStack.prototype.push = function (scope) {
        if (scope == null) {
            scope = new Scope();
        }
        this.scopes.push(scope);
    };
    ScopeStack.prototype.getStackDepth = function () {
        return this.scopes.length;
    };
    return ScopeStack;
}());
exports.ScopeStack = ScopeStack;
var ConsoleCaller = /** @class */ (function () {
    function ConsoleCaller(bot) {
        this.bot = bot;
    }
    ConsoleCaller.prototype.getType = function () {
        return "CONSOLE";
    };
    ConsoleCaller.prototype.hasPermission = function (permission) {
        return true;
    };
    ConsoleCaller.prototype.message = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var mentionRegex, mentionMatches, index, mention, userId, user, username, replaceRegex, channelRegex, channelMatches, index, channelmention, channelId, channel, channelname, replaceRegex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mentionRegex = /<@\![0-9]*>/g;
                        mentionMatches = mentionRegex.exec(message);
                        if (!(mentionMatches != null)) return [3 /*break*/, 4];
                        index = 0;
                        _a.label = 1;
                    case 1:
                        if (!(index < mentionMatches.length)) return [3 /*break*/, 4];
                        mention = mentionMatches[index];
                        userId = mention.substring(3, mention.length - 1);
                        return [4 /*yield*/, this.bot.getClient().fetchUser(userId)];
                    case 2:
                        user = _a.sent();
                        username = "@" + user.tag;
                        replaceRegex = new RegExp("<@\!" + userId + ">");
                        message = message.replace(replaceRegex, username);
                        _a.label = 3;
                    case 3:
                        index++;
                        return [3 /*break*/, 1];
                    case 4:
                        channelRegex = /<#[0-9]*>/g;
                        channelMatches = channelRegex.exec(message);
                        if (channelMatches != null) {
                            for (index = 0; index < channelMatches.length; index++) {
                                channelmention = channelMatches[index];
                                channelId = channelmention.substring(2, channelmention.length - 1);
                                channel = this.bot.getClient().channels.get(channelId);
                                channelname = "#" + channel.name;
                                replaceRegex = new RegExp("<#" + channelId + ">");
                                message = message.replace(replaceRegex, channelname);
                            }
                        }
                        console.log(marked(message));
                        return [2 /*return*/, Promise.resolve(message)];
                }
            });
        });
    };
    ConsoleCaller.prototype.directMessage = function (message) {
        return this.message(message);
    };
    return ConsoleCaller;
}());
exports.ConsoleCaller = ConsoleCaller;
var UserCaller = /** @class */ (function () {
    function UserCaller(message, bot) {
        this.permissionNode = bot.getPermissionManager().getPermissionsForUser(message.author);
        this.initMessage = message;
    }
    UserCaller.prototype.getType = function () {
        return "USER";
    };
    UserCaller.prototype.hasPermission = function (permission) {
        return this.permissionNode.hasPermission(permission);
    };
    UserCaller.prototype.message = function (message) {
        return this.initMessage.reply(message);
    };
    UserCaller.prototype.directMessage = function (message) {
        return this.initMessage.author.dmChannel.send(message);
    };
    UserCaller.prototype.getRawMessage = function () {
        return this.initMessage;
    };
    return UserCaller;
}());
exports.UserCaller = UserCaller;
var PermissionManager = /** @class */ (function () {
    function PermissionManager() {
        this.userPermission = new Map();
        this.discordRolePermission = new Map();
        this.everyonePermission = new PermissionNode();
    }
    PermissionManager.prototype.getPermissionsForUser = function (user) {
        var _this = this;
        var permissions = this.everyonePermission;
        var userId = user.id;
        if (this.userPermission.has(userId)) {
            permissions = PermissionNode.merge(permissions, this.userPermission.get(userId));
        }
        if (user instanceof discord_js_1.GuildMember) {
            var guildMember = user;
            guildMember.roles.forEach(function (role) {
                var roleId = role.id;
                if (_this.discordRolePermission.has(roleId)) {
                    permissions = PermissionNode.merge(permissions, _this.discordRolePermission.get(roleId));
                }
            });
        }
        return permissions;
    };
    PermissionManager.prototype.loadFromConfig = function (config) {
        if (config == undefined) {
            return;
        }
        if (config["everyone"] != undefined) {
            this.everyonePermission = PermissionNode.fromJson(config["everyone"]);
        }
        if (config["userPermission"] != undefined) {
            for (var key in config["userPermission"]) {
                this.userPermission.set(key, PermissionNode.fromJson(config["userPermission"][key]));
            }
        }
        if (config["discordRolePermission"] != undefined) {
            for (var key in config["discordRolePermission"]) {
                this.discordRolePermission.set(key, PermissionNode.fromJson(config["discordRolePermission"][key]));
            }
        }
    };
    PermissionManager.prototype.saveToConfig = function () {
        var config = {};
        config["everyone"] = this.everyonePermission.toJson();
        config["userPermission"] = {};
        this.userPermission.forEach(function (value, key, map) {
            config["userPermission"][key] = value.toJson();
        });
        config["discordRolePermission"] = {};
        this.discordRolePermission.forEach(function (value, key, map) {
            config["discordRolePermission"][key] = value.toJson();
        });
        return config;
    };
    PermissionManager.prototype.grantPermissionToUser = function (user, permission) {
        if (!this.userPermission.has(user.id)) {
            this.userPermission.set(user.id, new PermissionNode());
        }
        this.userPermission.get(user.id).grant(permission);
    };
    PermissionManager.prototype.grantPermissionToRole = function (role, permission) {
        if (!this.discordRolePermission.has(role.id)) {
            this.discordRolePermission.set(role.id, new PermissionNode());
        }
        this.discordRolePermission.get(role.id).grant(permission);
    };
    PermissionManager.prototype.grantPermissionToEveryone = function (permission) {
        this.everyonePermission.grant(permission);
    };
    PermissionManager.prototype.removePermissionToUser = function (user, permission) {
        if (!this.userPermission.has(user.id)) {
            this.userPermission.set(user.id, new PermissionNode());
        }
        this.userPermission.get(user.id).revoke(permission);
    };
    PermissionManager.prototype.removePermissionToRole = function (role, permission) {
        if (!this.discordRolePermission.has(role.id)) {
            this.discordRolePermission.set(role.id, new PermissionNode());
        }
        this.discordRolePermission.get(role.id).revoke(permission);
    };
    PermissionManager.prototype.removePermissionToEveryone = function (permission) {
        this.everyonePermission.revoke(permission);
    };
    PermissionManager.prototype.listPermissionForUser = function (user) {
        if (!this.userPermission.has(user.id)) {
            this.userPermission.set(user.id, new PermissionNode());
        }
        return this.userPermission.get(user.id).getAllPermissions();
    };
    PermissionManager.prototype.listPermissionForRole = function (role) {
        if (!this.discordRolePermission.has(role.id)) {
            this.discordRolePermission.set(role.id, new PermissionNode());
        }
        return this.discordRolePermission.get(role.id).getAllPermissions();
    };
    PermissionManager.prototype.listPermissionForEveryone = function () {
        return this.everyonePermission.getAllPermissions();
    };
    return PermissionManager;
}());
var PermissionNode = /** @class */ (function () {
    function PermissionNode() {
        this.children = new Map();
    }
    PermissionNode.prototype.hasPermission = function (permissionArray) {
        if (typeof permissionArray == "string") {
            permissionArray = permissionArray.split(".");
        }
        if (permissionArray.length == 0) {
            return true;
        }
        if (this.children.has("*")) {
            return true;
        }
        if (this.children.has(permissionArray[0])) {
            var newPermissionArray = permissionArray.slice(1, permissionArray.length);
            return this.children.get(permissionArray[0]).hasPermission(newPermissionArray);
        }
        return false;
    };
    PermissionNode.prototype.clone = function () {
        var clone = new PermissionNode();
        this.children.forEach(function (value, key, map) {
            clone.children.set(key, value);
        });
        return clone;
    };
    PermissionNode.merge = function (a, b) {
        var _this = this;
        var c = new PermissionNode();
        a.children.forEach(function (value, key, map) {
            if (b.children.has(key)) {
                c.children.set(key, _this.merge(value, b.children.get(key)));
            }
            else {
                c.children.set(key, value.clone());
            }
        });
        b.children.forEach(function (value, key, map) {
            if (!c.children.has(key)) {
                c.children.set(key, value.clone());
            }
        });
        return c;
    };
    PermissionNode.prototype.grant = function (permissionArray) {
        if (typeof permissionArray == "string") {
            permissionArray = permissionArray.split(".");
        }
        if (permissionArray.length == 0) {
            return;
        }
        if (permissionArray[0] == "*") {
            this.children = new Map();
            this.children.set("*", new PermissionNode());
            return;
        }
        if (!this.children.has(permissionArray[0])) {
            this.children.set(permissionArray[0], new PermissionNode());
        }
        var newPermissionArray = permissionArray.slice(1, permissionArray.length);
        this.children.get(permissionArray[0]).grant(newPermissionArray);
    };
    PermissionNode.prototype.revoke = function (permissionArray) {
        if (typeof permissionArray == "string") {
            permissionArray = permissionArray.split(".");
        }
        if (permissionArray[0] == "*") {
            this.children = new Map();
            return;
        }
        if (!this.children.has(permissionArray[0])) {
            return;
        }
        if (permissionArray.length == 1) {
            this.children.delete(permissionArray[0]);
        }
        var newPermissionArray = permissionArray.slice(1, permissionArray.length);
        this.children.get(permissionArray[0]).revoke(newPermissionArray);
    };
    PermissionNode.prototype.getAllPermissions = function () {
        if (this.children.size == 0) {
            return [];
        }
        var permissions = [];
        this.children.forEach(function (value, key, map) {
            var nodePermissions = value.getAllPermissions();
            if (nodePermissions.length == 0) {
                permissions.push(key);
            }
            else {
                nodePermissions.forEach(function (permission) {
                    permissions.push(key + "." + permission);
                });
            }
        });
        return permissions;
    };
    PermissionNode.fromJsonString = function (jsonString) {
        return PermissionNode.fromJson(JSON.parse(jsonString));
    };
    PermissionNode.fromJson = function (rawJson) {
        var newNode = new PermissionNode();
        for (var key in rawJson) {
            if (key == ".") {
                continue;
            }
            newNode.children.set(key, PermissionNode.fromJson(rawJson[key]));
        }
        return newNode;
    };
    PermissionNode.prototype.toJson = function () {
        var asJson = { ".": true };
        var keys = this.children.keys();
        console.log(keys);
        var nodeKey;
        while (!(nodeKey = keys.next()).done) {
            console.log(nodeKey);
            asJson[nodeKey.value] = this.children.get(nodeKey.value).toJson();
        }
        console.log(asJson);
        console.log(this.children);
        return asJson;
    };
    return PermissionNode;
}());
