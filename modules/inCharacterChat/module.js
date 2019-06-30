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
var InCharacterChatModule = /** @class */ (function () {
    function InCharacterChatModule() {
    }
    InCharacterChatModule.prototype.getId = function () {
        return "inCharacterChat";
    };
    InCharacterChatModule.prototype.getName = function () {
        return "In Character Chat";
    };
    InCharacterChatModule.prototype.register = function (bot) {
        this.bot = bot;
        bot.getClient().on("message", function (message) {
            var channelId = message.channel.id;
            if (message.author.bot || message.content.startsWith(bot.getCommandIndicator()) || message.content.startsWith("OC")) {
                return;
            }
            var inCharacterChannelCollection = bot.getDatabase().db("MonodroneBot").collection("InCharacterChannel");
            console.log("Messafe Recieved 2!");
            inCharacterChannelCollection.findOne({ "channelId": channelId }).then(function (value) {
                if (value == null) {
                    return;
                }
                if (value.icChannel) {
                    message.delete();
                    var discordInCharacterNameCollection = bot.getDatabase().db("MonodroneBot").collection("DiscordInCharacterName");
                    discordInCharacterNameCollection.findOne({
                        "discordUserId": message.author.id
                    }).then(function (inCharacterName) {
                        if (inCharacterChannelCollection == null) {
                            message.author.sendMessage("You need to set your IC name in order to talk in this channel. Use the help command to find out how.");
                            return;
                        }
                        var channel = message.channel;
                        if (channel instanceof discord_js_1.TextChannel) {
                            channel.fetchWebhooks().then(function (webhooks) {
                                webhooks.get(value.wbId).sendMessage(message.content, {
                                    "username": inCharacterName.discordInCharacterName
                                });
                            });
                        }
                    });
                }
            }, function (reason) {
            });
        });
        bot.registerCommand(new SetICName());
        bot.registerCommand(new RegisterInCharacterChannel());
    };
    InCharacterChatModule.prototype.deregister = function () {
        this.bot.deregisterCommand("seticname");
        this.bot.deregisterCommand("registericchannel");
    };
    InCharacterChatModule.prototype.configsSave = function () {
    };
    return InCharacterChatModule;
}());
exports.default = InCharacterChatModule;
var RegisterInCharacterChannel = /** @class */ (function () {
    function RegisterInCharacterChannel() {
    }
    RegisterInCharacterChannel.prototype.getName = function () {
        return "registericchannel";
    };
    RegisterInCharacterChannel.prototype.call = function (input, scope, caller, bot) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, channel_, inCharacterChannelCollection, p;
            return __generator(this, function (_a) {
                if (input.length != 0) {
                    return [2 /*return*/, new monodronebot_1.SimpleCommandOutputError("Command requires 0 arguments")];
                }
                if (caller instanceof monodronebot_1.UserCaller) {
                    channel_ = caller.getRawMessage().channel;
                    if (channel_ instanceof discord_js_1.TextChannel) {
                        channel = channel_;
                    }
                    else {
                        return [2 /*return*/, new monodronebot_1.SimpleCommandOutputError("Must be called from a guild text channel.")];
                    }
                }
                else {
                    return [2 /*return*/, new monodronebot_1.SimpleCommandOutputError("Must be called from discord.")];
                }
                inCharacterChannelCollection = bot.getDatabase().db("MonodroneBot").collection("InCharacterChannel");
                p = new Promise(function (resolve, reject) {
                    var result = inCharacterChannelCollection.find({
                        "channelId": channel.id
                    });
                    result.hasNext().then(function (hasNext) {
                        if (hasNext) {
                            result.next().then(function (value) {
                                if (value["icChannel"]) {
                                    resolve(new monodronebot_1.CommandStringOutput("This channel is already an IC channel"));
                                }
                                else {
                                    inCharacterChannelCollection.update({
                                        "channelId": channel.id
                                    }, {
                                        "$set": {
                                            "icChannel": true
                                        }
                                    });
                                    resolve(new monodronebot_1.CommandStringOutput("Registered"));
                                }
                            });
                        }
                        else {
                            channel.createWebhook("IC Chat", "").then(function (wb) {
                                inCharacterChannelCollection.insert({
                                    "wbId": wb.id,
                                    "wbToken": wb.token,
                                    "icChannel": true,
                                    "channelId": channel.id
                                }).then(function (value) {
                                    resolve(new monodronebot_1.CommandStringOutput("Registered"));
                                });
                            });
                        }
                    });
                });
                return [2 /*return*/, p];
            });
        });
    };
    RegisterInCharacterChannel.prototype.getRequiredPermission = function () {
        return "incharacterchate.registericchannel";
    };
    RegisterInCharacterChannel.prototype.getShortHelpText = function () {
        return "Sets the channel this command is sent in to an In Character Channel.";
    };
    RegisterInCharacterChannel.prototype.getLongHelpText = function () {
        return "Sets the channel this command is sent in to an In Character Channel. registericchannel";
    };
    return RegisterInCharacterChannel;
}());
var SetICName = /** @class */ (function () {
    function SetICName() {
    }
    SetICName.prototype.getName = function () {
        return "seticname";
    };
    SetICName.prototype.call = function (input, scope, caller, bot) {
        return __awaiter(this, void 0, void 0, function () {
            var user, guild, characterName, discordInCharacterNameCollection;
            return __generator(this, function (_a) {
                if (input.length != 1) {
                    return [2 /*return*/, new monodronebot_1.SimpleCommandOutputError("Command requires 1 argument")];
                }
                if (!input[0].hasStringValue()) {
                    return [2 /*return*/, new monodronebot_1.SimpleCommandOutputError("Argument 1 must have a string value")];
                }
                if (caller instanceof monodronebot_1.UserCaller) {
                    user = caller.getRawMessage().author;
                }
                else {
                    return [2 /*return*/, new monodronebot_1.SimpleCommandOutputError("Must be called from discord.")];
                }
                characterName = input[0].getStringValue();
                discordInCharacterNameCollection = bot.getDatabase().db("MonodroneBot").collection("DiscordInCharacterName");
                discordInCharacterNameCollection.updateOne({
                    "discordUserId": user.id
                }, {
                    "$set": {
                        "discordUserId": user.id,
                        "discordInCharacterName": input[0].getStringValue()
                    }
                }, {
                    "upsert": true
                });
                return [2 /*return*/, new monodronebot_1.CommandStringOutput("Success")];
            });
        });
    };
    SetICName.prototype.getRequiredPermission = function () {
        return "incharacterchat.seticname";
    };
    SetICName.prototype.getShortHelpText = function () {
        return "Sets you In Character Name.";
    };
    SetICName.prototype.getLongHelpText = function () {
        return "Sets you In Character Name. seticname <Name>";
    };
    return SetICName;
}());
