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
var googleapis_1 = require("googleapis");
var readline = require("readline");
var mongoose_1 = require("mongoose");
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
var CharacterLinkSchema = new mongoose_1.Schema({
    characterID: String,
    spreadsheetID: String,
    userID: String,
    alive: Boolean
});
var CharacterLink = mongoose_1.model("CharacterLink", CharacterLinkSchema);
var CharacterConnectionModule = /** @class */ (function () {
    function CharacterConnectionModule() {
    }
    CharacterConnectionModule.prototype.getId = function () {
        return "characterConnection";
    };
    CharacterConnectionModule.prototype.getName = function () {
        return "Character Connection";
    };
    CharacterConnectionModule.prototype.register = function (bot) {
        var _this = this;
        this.bot = bot;
        this.googleAuthorize(this.bot.getConfigLoader().get("googleAuth"), function (oauth2) {
            _this.oAuth = oauth2;
        });
        bot.registerCommand(new LinkCharacterCommand(this));
    };
    CharacterConnectionModule.prototype.deregister = function () {
        this.bot.deregisterCommand("linkcharacter");
    };
    CharacterConnectionModule.prototype.configsSave = function () {
        if (this.oAuth != undefined) {
            this.bot.getConfigLoader().set("googleToken", this.oAuth.credentials);
        }
    };
    CharacterConnectionModule.prototype.googleAuthorize = function (credentials, callback) {
        var _a = credentials.installed, client_secret = _a.client_secret, client_id = _a.client_id, redirect_uris = _a.redirect_uris;
        var oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        var token = this.bot.getConfigLoader().get("googleToken");
        if (token == undefined) {
            this.getNewToken(oAuth2Client, callback);
            return;
        }
        oAuth2Client.setCredentials(token);
        callback(oAuth2Client);
    };
    CharacterConnectionModule.prototype.getNewToken = function (oAuth2Client, callback) {
        var authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', function (code) {
            rl.close();
            oAuth2Client.getToken(code, function (err, token) {
                if (err)
                    return console.error('Error while trying to retrieve access token', err);
                oAuth2Client.setCredentials(token);
                callback(oAuth2Client);
            });
        });
    };
    CharacterConnectionModule.prototype.getOAuth = function () {
        return this.oAuth;
    };
    return CharacterConnectionModule;
}());
exports.default = CharacterConnectionModule;
var LinkCharacterCommand = /** @class */ (function () {
    function LinkCharacterCommand(module) {
        this.module = module;
    }
    LinkCharacterCommand.prototype.getName = function () {
        return "linkcharacter";
    };
    LinkCharacterCommand.prototype.call = function (input, scope, caller, bot) {
        return __awaiter(this, void 0, void 0, function () {
            var user, guild, characterCode, oAuth, sheets, p;
            return __generator(this, function (_a) {
                if (input.length != 1) {
                    return [2 /*return*/, new monodronebot_1.SimpleCommandOutputError("Command requires 1 argument")];
                }
                if (!input[0].hasStringValue()) {
                    return [2 /*return*/, new monodronebot_1.SimpleCommandOutputError("Argument 1 must have a string value")];
                }
                if (caller instanceof monodronebot_1.UserCaller) {
                    user = caller.getRawMessage().author;
                    guild = caller.getRawMessage().guild;
                }
                else {
                    return [2 /*return*/, new monodronebot_1.SimpleCommandOutputError("Argument 1 must have a string value")];
                }
                characterCode = input[0].getStringValue();
                oAuth = this.module.getOAuth();
                if (oAuth == undefined) {
                    return [2 /*return*/, new monodronebot_1.SimpleCommandOutputError("No google authentication. Contact one of the Admins")];
                }
                sheets = googleapis_1.google.sheets({ version: 'v4', auth: oAuth });
                p = new Promise(function (resolve, reject) {
                    sheets.spreadsheets.values.get({
                        spreadsheetId: '1OFrpKUUEsH0I34dcj1gVXHeC89rwnkIhRf7H-G_X03g',
                        range: 'Sheet1!A2:D',
                    }, function (err, res) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            var values = res.data.values;
                            values.forEach(function (value, index, array) {
                                if (value[0] == characterCode) {
                                    var sheetID_1 = value[1];
                                    var alive = value[2];
                                    if (!alive) {
                                        resolve(new monodronebot_1.SimpleCommandOutputError("Charatcer in question is Dead"));
                                        return;
                                    }
                                    sheets.spreadsheets.values.get({
                                        spreadsheetId: sheetID_1,
                                        range: 'Character Sheet!I1'
                                    }, function (err, characterSheet) {
                                        if (err) {
                                            reject(err);
                                        }
                                        else {
                                            var characterName_1 = characterSheet.data.values[0][0];
                                            var characterLink = new CharacterLink({
                                                characterID: characterCode,
                                                spreadsheetID: sheetID_1,
                                                userID: user.id,
                                                alive: true
                                            });
                                            characterLink.save().then(function (value) {
                                                resolve(new monodronebot_1.CommandStringOutput('Your character ' + characterName_1 + ' has been linked'));
                                            }, function (error) {
                                                resolve(new monodronebot_1.SimpleCommandOutputError(JSON.stringify(error)));
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
                return [2 /*return*/, p];
            });
        });
    };
    LinkCharacterCommand.prototype.getRequiredPermission = function () {
        return "characterConnection.linkcharacter";
    };
    LinkCharacterCommand.prototype.getShortHelpText = function () {
        return "Links your character sheet to your discord account.";
    };
    LinkCharacterCommand.prototype.getLongHelpText = function () {
        return "Links your character sheet to your discord account. linkcharacter <character-code>";
    };
    return LinkCharacterCommand;
}());
