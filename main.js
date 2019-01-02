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
var marked = require("marked");
var TerminalRenderer = require("marked-terminal");
marked.setOptions({
    // Define custom renderer
    renderer: new TerminalRenderer()
});
var MonodroneBot = /** @class */ (function () {
    function MonodroneBot(token) {
        var _this = this;
        this.commandIndicator = "$";
        this.token = token;
        this.client = new discord_js_1.Client();
        this.commands = new Map();
        this.consoleCaller = new ConsoleCaller(this);
        this.client.on("message", function (message) {
            if (message.content.startsWith("$")) {
                _this.consoleCaller.message("Command Recieved : \n" + message.content);
            }
        });
    }
    MonodroneBot.prototype.login = function () {
        this.client.login(this.token)
            .then(console.log)
            .catch(console.error);
    };
    MonodroneBot.prototype.stop = function () {
        this.client.destroy()
            .then(console.log)
            .catch(console.error);
    };
    return MonodroneBot;
}());
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
var Scope = /** @class */ (function (_super) {
    __extends(Scope, _super);
    function Scope() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Scope;
}(Map));
var ScopeStack = /** @class */ (function () {
    function ScopeStack() {
    }
    ScopeStack.prototype.getValue = function (name, down) {
        if (down == null) {
            down = 0;
        }
        for (var n = this.scopes.length - 1 - down; n >= 0; n++) {
            if (this.scopes[n].has(name)) {
                return this.scopes[n].get(name);
            }
        }
        return null;
    };
    ScopeStack.prototype.hasValue = function (name, down) {
        if (down == null) {
            down = 0;
        }
        for (var n = this.scopes.length - 1 - down; n >= 0; n++) {
            if (this.scopes[n].has(name)) {
                return true;
            }
        }
        return false;
    };
    ScopeStack.prototype.pop = function () {
        return this.scopes.pop();
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
                        return [4 /*yield*/, bot.client.fetchUser(userId)];
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
                                channel = bot.client.channels.get(channelId);
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
var UserCaller = /** @class */ (function () {
    function UserCaller(message) {
        this.initMessage = message;
    }
    UserCaller.prototype.getType = function () {
        return "USER";
    };
    UserCaller.prototype.hasPermission = function (permission) {
        return true; // TODO : Implement proper permission system.
    };
    UserCaller.prototype.message = function (message) {
        return this.initMessage.reply(message);
    };
    UserCaller.prototype.directMessage = function (message) {
        return this.initMessage.author.dmChannel.send(message);
    };
    return UserCaller;
}());
var token = process.argv[2];
var bot = new MonodroneBot(token);
bot.login();
process.on("SIGINT", function (code) {
    console.log("Stopping");
    bot.stop();
});
