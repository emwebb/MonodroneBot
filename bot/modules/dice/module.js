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
var nearley = require("nearley");
var util_1 = require("util");
var grammar = require('./diceGrammar');
var DiceModule = /** @class */ (function () {
    function DiceModule() {
    }
    DiceModule.prototype.getId = function () {
        return "dice";
    };
    DiceModule.prototype.getName = function () {
        return "Dice";
    };
    DiceModule.prototype.register = function (bot) {
        this.bot = bot;
        this.bot.registerCommand(new RollCommand());
    };
    DiceModule.prototype.deregister = function () {
        this.bot.deregisterCommand("role");
    };
    DiceModule.prototype.configsSave = function () {
    };
    return DiceModule;
}());
exports.default = DiceModule;
var RollCommand = /** @class */ (function () {
    function RollCommand() {
    }
    RollCommand.prototype.getName = function () {
        return "roll";
    };
    RollCommand.prototype.call = function (input, scope, caller, bot) {
        return __awaiter(this, void 0, void 0, function () {
            var query, parser, parseResult, diceN, dice, result;
            return __generator(this, function (_a) {
                query = input.map(function (value) {
                    return value.getStringValue();
                }).join(" ");
                parser = new nearley.Parser(nearley.Grammar.fromCompiled((grammar.ParserRules)));
                parseResult = parser.feed(query).results[0];
                diceN = convert(parseResult["dice"]);
                if (typeof diceN == "number") {
                    dice = {
                        mdResult: diceN.toString(),
                        integerResult: diceN
                    };
                }
                else {
                    dice = diceN.compute();
                }
                result = {
                    comment: parseResult["comment"],
                    dice: dice
                };
                return [2 /*return*/, new CommandDiceOutput(result)];
            });
        });
    };
    RollCommand.prototype.getRequiredPermission = function () {
        return "dice.roll";
    };
    RollCommand.prototype.getShortHelpText = function () {
        return "Roles a dice.";
    };
    RollCommand.prototype.getLongHelpText = function () {
        return "Roles a dice.";
    };
    return RollCommand;
}());
var RepeatedRollCommand = /** @class */ (function () {
    function RepeatedRollCommand() {
    }
    RepeatedRollCommand.prototype.getName = function () {
        return "repeatedroll";
    };
    RepeatedRollCommand.prototype.call = function (input, scope, caller, bot) {
        return __awaiter(this, void 0, void 0, function () {
            var query, parser, parseResult, diceN, dice, result;
            return __generator(this, function (_a) {
                query = input.map(function (value) {
                    return value.getStringValue();
                }).join(" ");
                parser = new nearley.Parser(nearley.Grammar.fromCompiled((grammar.ParserRules)));
                parseResult = parser.feed(query).results[0];
                diceN = convert(parseResult["dice"]);
                if (typeof diceN == "number") {
                    dice = {
                        mdResult: diceN.toString(),
                        integerResult: diceN
                    };
                }
                else {
                    dice = diceN.compute();
                }
                result = {
                    comment: parseResult["comment"],
                    dice: dice
                };
                return [2 /*return*/, new CommandDiceOutput(result)];
            });
        });
    };
    RepeatedRollCommand.prototype.getRequiredPermission = function () {
        return "dice.repeatedroll";
    };
    RepeatedRollCommand.prototype.getShortHelpText = function () {
        return "Roles a dice.";
    };
    RepeatedRollCommand.prototype.getLongHelpText = function () {
        return "Roles a dice.";
    };
    return RepeatedRollCommand;
}());
var CommandDiceOutput = /** @class */ (function () {
    function CommandDiceOutput(dice) {
        this.dice = dice;
    }
    CommandDiceOutput.prototype.hadError = function () {
        return false;
    };
    CommandDiceOutput.prototype.getError = function () {
        return undefined;
    };
    CommandDiceOutput.prototype.hasNumberValue = function () {
        return true;
    };
    CommandDiceOutput.prototype.getNumberValue = function () {
        return this.dice.dice.integerResult;
    };
    CommandDiceOutput.prototype.hasStringValue = function () {
        return true;
    };
    CommandDiceOutput.prototype.getStringValue = function () {
        return this.dice.dice.mdResult;
    };
    CommandDiceOutput.prototype.getUserValue = function () {
        return this.dice.dice.mdResult + (this.dice.comment ? " " + this.dice.comment : "");
    };
    CommandDiceOutput.prototype.getValueType = function () {
        return "DiceParserResult";
    };
    CommandDiceOutput.prototype.getValue = function () {
        return this.dice;
    };
    return CommandDiceOutput;
}());
function convert(value) {
    if (typeof value === "number") {
        return value;
    }
    switch (value["type"]) {
        case "Role":
            return new DiceParserResultPartDice(value);
            break;
        case "Add":
        case "Subtract":
            return new DiceParserResultPartMaths(value);
            break;
        default:
            throw "Unknown type " + value["type"];
    }
}
var DiceParserResultChoose = /** @class */ (function () {
    function DiceParserResultChoose(jsonValue) {
        this.type = jsonValue["type"];
        if (!util_1.isNullOrUndefined(jsonValue["number"])) {
            this.number = convert(jsonValue["number"]);
        }
    }
    return DiceParserResultChoose;
}());
var DiceParserResultPartDice = /** @class */ (function () {
    function DiceParserResultPartDice(jsonValue) {
        this.type = jsonValue["type"];
        this.roles = convert(jsonValue["roles"]);
        this.range = convert(jsonValue["range"]);
        if (!util_1.isNullOrUndefined(jsonValue["special"])) {
            this.special = new DiceParserResultChoose(jsonValue["special"]);
        }
    }
    DiceParserResultPartDice.prototype.compute = function () {
        var _this = this;
        var rolesNumber;
        var rolesMd;
        if (typeof this.roles === "number") {
            rolesNumber = this.roles;
            rolesMd = this.roles.toString();
        }
        else {
            var roles = this.roles.compute();
            rolesNumber = roles.integerResult;
            rolesMd = roles.mdResult;
        }
        var rangeNumber;
        var rangeMd;
        if (typeof this.range === "number") {
            rangeNumber = this.range;
            rangeMd = this.range.toString();
        }
        else {
            var range = this.range.compute();
            rangeNumber = range.integerResult;
            rangeMd = range.mdResult;
        }
        if (util_1.isNullOrUndefined(this.special)) {
            var roleArray = Array.from({ length: rolesNumber }, function () { return Math.ceil(Math.random() * rangeNumber); });
            var mdValue = roleArray.map(function (value) {
                if (value == 1 || value == rangeNumber) {
                    return "**" + value + "**";
                }
                else {
                    return value.toString();
                }
            }).join();
            var integerValue = roleArray.reduce(function (pre, current) {
                return pre + current;
            });
            mdValue = "(" + rolesMd + "d" + rangeMd + " : (" + mdValue + ") : `" + integerValue + "` )";
            return {
                mdResult: mdValue,
                integerResult: integerValue
            };
        }
        else {
            if (this.special.type == "ChooseHighest" || this.special.type == "ChooseLowest") {
                var roleArray = Array.from({ length: rolesNumber }, function () { return Math.ceil(Math.random() * rangeNumber); });
                var roleArraySorted = roleArray.map(function (value, index) {
                    return {
                        value: value,
                        index: index
                    };
                }).sort(function (a, b) { return (a.value - b.value) * ((_this.special.type == "ChooseLowest") ? 1 : -1); });
                var specialInteger_1 = this.special.number;
                var specialMd = specialInteger_1.toString();
                if (typeof specialInteger_1 !== "number") {
                    var special = specialInteger_1.compute();
                    specialInteger_1 = special.integerResult;
                    specialMd = special.mdResult;
                }
                var roleArrayUnsorted = roleArraySorted.map(function (value, index) {
                    return {
                        index: value.index,
                        value: value.value,
                        kill: index >= specialInteger_1
                    };
                }).sort(function (a, b) { return a.index - b.index; });
                var mdValue = roleArrayUnsorted.map(function (value) {
                    var md;
                    if (value.value == 1 || value.value == rangeNumber) {
                        md = "**" + value.value + "**";
                    }
                    else {
                        md = value.value.toString();
                    }
                    if (value.kill) {
                        return "~~" + md + "~~";
                    }
                    else {
                        return md;
                    }
                }).join();
                var integerValue = roleArrayUnsorted.reduce(function (pre, cur) {
                    if (!pre.kill) {
                        if (!cur.kill) {
                            return {
                                kill: false,
                                index: 0,
                                value: pre.value + cur.value
                            };
                        }
                        else {
                            return pre;
                        }
                    }
                    else {
                        if (!cur.kill) {
                            return {
                                kill: false,
                                index: 0,
                                value: cur.value
                            };
                        }
                        else {
                            return {
                                kill: false,
                                index: 0,
                                value: 0
                            };
                        }
                    }
                }).value;
                var chooseValue = (this.special.type == "ChooseLowest") ? "cl" : "ch";
                mdValue = "(" + rolesMd + "d" + rangeMd + chooseValue + specialMd + " : (" + mdValue + ") : `" + integerValue + "` )";
                return {
                    mdResult: mdValue,
                    integerResult: integerValue
                };
            }
            else {
                var results = Array.from({ length: 2 }, function () {
                    var roleArray = Array.from({ length: rolesNumber }, function () { return Math.ceil(Math.random() * rangeNumber); });
                    var mdValue = "(" + roleArray.map(function (value) {
                        if (value == 1 || value == rangeNumber) {
                            return "**" + value + "**";
                        }
                        else {
                            return value.toString();
                        }
                    }).join() + ")";
                    var integerValue = roleArray.reduce(function (pre, current) {
                        return pre + current;
                    });
                    return {
                        mdvalue: mdValue,
                        integerValue: integerValue
                    };
                });
                var integerValue = void 0;
                if ((results[0].integerValue < results[1].integerValue) != (this.special.type == "Disadvantage")) {
                    integerValue = results[1].integerValue;
                    results[0].mdvalue = "~~" + results[0].mdvalue + "~~";
                }
                else {
                    integerValue = results[0].integerValue;
                    results[1].mdvalue = "~~" + results[1].mdvalue + "~~";
                }
                var chooseValue = (this.special.type == "Disadvantage") ? "disadv" : "adv";
                var mdValue = "(" + rolesMd + "d" + rangeMd + chooseValue + " : " + results[0].mdvalue + "," + results[1].mdvalue + " : `" + integerValue + "` )";
                return {
                    mdResult: mdValue,
                    integerResult: integerValue
                };
            }
        }
    };
    return DiceParserResultPartDice;
}());
var DiceParserResultPartMaths = /** @class */ (function () {
    function DiceParserResultPartMaths(jsonValue) {
        this.type = jsonValue["type"];
        this.left = convert(jsonValue["left"]);
        this.right = convert(jsonValue["right"]);
    }
    DiceParserResultPartMaths.prototype.compute = function () {
        var leftNumber;
        var leftMd;
        if (typeof this.left === "number") {
            leftNumber = this.left;
            leftMd = this.left.toString();
        }
        else {
            var left = this.left.compute();
            leftNumber = left.integerResult;
            leftMd = left.mdResult;
        }
        var rightNumber;
        var rightMd;
        if (typeof this.right === "number") {
            rightNumber = this.right;
            rightMd = this.right.toString();
        }
        else {
            var right = this.right.compute();
            rightNumber = right.integerResult;
            rightMd = right.mdResult;
        }
        if (this.type == "Add") {
            return {
                integerResult: leftNumber + rightNumber,
                mdResult: "(" + leftMd + " + " + rightMd + " : `" + (leftNumber + rightNumber) + "`)"
            };
        }
        else if (this.type == "Subtract") {
            return {
                integerResult: leftNumber - rightNumber,
                mdResult: "(" + leftMd + " - " + rightMd + " : `" + (leftNumber - rightNumber) + "`)"
            };
        }
        else {
            throw "Unknown type " + this.type;
        }
    };
    return DiceParserResultPartMaths;
}());
