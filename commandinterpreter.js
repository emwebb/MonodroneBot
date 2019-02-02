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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
var monodronebot_1 = require("./monodronebot");
var unescapeString = require("unescape-js");
var CommandInterpreter = /** @class */ (function () {
    function CommandInterpreter(bot, command, caller, scope) {
        this.bot = bot;
        this.commandQuery = command;
        this.caller = caller;
        this.scope = scope;
    }
    CommandInterpreter.prototype.interpret = function () {
        return __awaiter(this, void 0, void 0, function () {
            var lex, commandNameToken, commandArguments, nextToken, _a, variableValue, interpreter, commandOutput, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 13, , 14]);
                        lex = new Lexer(this.commandQuery, this.bot.getCommandIndicator());
                        commandNameToken = lex.next();
                        commandArguments = new Array();
                        nextToken = void 0;
                        _b.label = 1;
                    case 1:
                        if (!((nextToken = lex.next()).type != TokenType.END_OF_COMMAND)) return [3 /*break*/, 11];
                        _a = nextToken.type;
                        switch (_a) {
                            case TokenType.STRING: return [3 /*break*/, 2];
                            case TokenType.NUMBER: return [3 /*break*/, 3];
                            case TokenType.COMMAND_NAME: return [3 /*break*/, 4];
                            case TokenType.VARIABLE: return [3 /*break*/, 5];
                            case TokenType.IMBEDDED_COMMAND: return [3 /*break*/, 6];
                            case TokenType.WHITE_SPACE: return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 9];
                    case 2:
                        commandArguments.push(new monodronebot_1.CommandString(nextToken.value));
                        return [3 /*break*/, 10];
                    case 3:
                        commandArguments.push(new monodronebot_1.CommandNumber(nextToken.value));
                        return [3 /*break*/, 10];
                    case 4:
                        commandArguments.push(new monodronebot_1.CommandString(nextToken.lexeme));
                        return [3 /*break*/, 10];
                    case 5:
                        variableValue = this.scope.getValue(nextToken.value);
                        commandArguments.push(variableValue);
                        return [3 /*break*/, 10];
                    case 6:
                        this.scope.push();
                        interpreter = new CommandInterpreter(this.bot, nextToken.value, this.caller, this.scope);
                        return [4 /*yield*/, interpreter.interpret()];
                    case 7:
                        commandOutput = _b.sent();
                        commandArguments.push(commandOutput);
                        this.scope.pop();
                        return [3 /*break*/, 10];
                    case 8: return [3 /*break*/, 10];
                    case 9: return [3 /*break*/, 10];
                    case 10: return [3 /*break*/, 1];
                    case 11: return [4 /*yield*/, this.bot.runCommand(commandNameToken.value, commandArguments, this.scope, this.caller)];
                    case 12: return [2 /*return*/, _b.sent()];
                    case 13:
                        error_1 = _b.sent();
                        if (error_1 instanceof monodronebot_1.SimpleCommandOutputError) {
                            return [2 /*return*/, error_1];
                        }
                        else {
                            return [2 /*return*/, new monodronebot_1.SimpleCommandOutputError(error_1.message + "\n" + error_1.stack, "Error : There was an unexpected while interpreting the command : " + error_1.message + "\n" + error_1.stack)];
                        }
                        return [3 /*break*/, 14];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    return CommandInterpreter;
}());
exports.CommandInterpreter = CommandInterpreter;
var TokenType;
(function (TokenType) {
    TokenType[TokenType["STRING"] = 0] = "STRING";
    TokenType[TokenType["NUMBER"] = 1] = "NUMBER";
    TokenType[TokenType["COMMAND_NAME"] = 2] = "COMMAND_NAME";
    TokenType[TokenType["VARIABLE"] = 3] = "VARIABLE";
    TokenType[TokenType["IMBEDDED_COMMAND"] = 4] = "IMBEDDED_COMMAND";
    TokenType[TokenType["WHITE_SPACE"] = 5] = "WHITE_SPACE";
    TokenType[TokenType["END_OF_COMMAND"] = 6] = "END_OF_COMMAND";
})(TokenType || (TokenType = {}));
var Token = /** @class */ (function () {
    function Token(lexeme, type, value) {
        this.lexeme = lexeme;
        this.type = type;
        this.value = value;
    }
    return Token;
}());
var Lexer = /** @class */ (function () {
    function Lexer(command, commandIndicator) {
        this.command = command;
        this.commandIndicator = commandIndicator;
        this.charIndex = 0;
        this.lexeme = "";
        this.stringValue = "";
    }
    Lexer.prototype.next = function () {
        this.lexeme = "";
        this.stringValue = "";
        if (this.charIndex == this.command.length) {
            return new Token(this.lexeme, TokenType.END_OF_COMMAND, this.stringValue);
        }
        if (this.command.substr(this.charIndex, this.charIndex + this.commandIndicator.length) == this.commandIndicator) {
            this.lexeme += this.command.substr(this.charIndex, this.charIndex + this.commandIndicator.length);
            this.charIndex += this.commandIndicator.length;
            return this.commandName();
        }
        if (this.command.charAt(this.charIndex) == "[") {
            this.lexeme += this.command.charAt(this.charIndex);
            this.charIndex++;
            return this.imbeddedCommand();
        }
        if (this.command.charAt(this.charIndex) == "\"") {
            this.lexeme += this.command.charAt(this.charIndex);
            this.charIndex++;
            return this.quotedString();
        }
        if (this.command.charAt(this.charIndex) == "{") {
            this.lexeme += this.command.charAt(this.charIndex);
            this.charIndex++;
            return this.variable();
        }
        if (LexerUtils.isWhitespace(this.command.charAt(this.charIndex))) {
            this.lexeme += this.command.charAt(this.charIndex);
            this.stringValue += this.command.charAt(this.charIndex);
            this.charIndex++;
            return this.whitespace();
        }
        return this.stringNumber();
    };
    Lexer.prototype.commandName = function () {
        while (LexerUtils.isAlphanumeric(this.command.charAt(this.charIndex))) {
            this.lexeme += this.command.charAt(this.charIndex);
            this.stringValue += this.command.charAt(this.charIndex);
            this.charIndex++;
        }
        if (this.command.charAt(this.charIndex) != " " && this.charIndex < this.command.length) {
            throw new monodronebot_1.SimpleCommandOutputError("Command names must be alphanumeric. None Alphanumeric character at " + this.charIndex + ".", "Error: The command you have inputted has a syntax error. You have not used an alphanumeric command.\n" +
                "```\n" + this.command + "\n" + " ".repeat(this.charIndex - 1) + "^\n```");
        }
        return new Token(this.lexeme, TokenType.COMMAND_NAME, this.stringValue);
    };
    Lexer.prototype.imbeddedCommand = function () {
        var stackCounter = 1;
        var initBracketPos = this.charIndex - 1;
        while (stackCounter > 0 && this.charIndex < this.command.length) {
            if (this.command.charAt(this.charIndex) == "[") {
                stackCounter++;
                this.stringValue += this.command.charAt(this.charIndex);
            }
            else if (this.command.charAt(this.charIndex) == "]") {
                stackCounter--;
                if (stackCounter != 0) {
                    this.stringValue += this.command.charAt(this.charIndex);
                }
            }
            else {
                this.stringValue += this.command.charAt(this.charIndex);
            }
            this.lexeme += this.command.charAt(this.charIndex);
            this.charIndex++;
        }
        if (stackCounter == 0) {
            return new Token(this.lexeme, TokenType.IMBEDDED_COMMAND, this.stringValue);
        }
        else {
            throw new monodronebot_1.SimpleCommandOutputError("Imbedded command bracket at " + this.charIndex + " has no closing bracket.", "Error: The command you have inputted has a syntax error. An imbedded command bracket does not have a matching close bracket.\n" +
                "```\n" + this.command + "\n" + " ".repeat(initBracketPos - 1) + "^\n```");
        }
    };
    Lexer.prototype.quotedString = function () {
        while (this.charIndex < this.command.length && this.command.charAt(this.charIndex) != "\"") {
            this.lexeme += this.command.charAt(this.charIndex);
            this.stringValue += this.command.charAt(this.charIndex);
            if (this.command.charAt(this.charIndex) == "\\") {
                this.charIndex++;
                if (this.charIndex == this.command.length) {
                    throw new monodronebot_1.SimpleCommandOutputError("Escape string not completed at " + this.charIndex, "Error: The command you have inputted has a syntax error. An escape string was incompleted.\n" +
                        "```\n" + this.command + "\n" + " ".repeat(this.charIndex - 1) + "^\n```");
                }
                this.lexeme += this.command.charAt(this.charIndex);
                this.stringValue += this.command.charAt(this.charIndex);
            }
            this.charIndex++;
        }
        if (this.charIndex == this.command.length) {
            throw new monodronebot_1.SimpleCommandOutputError("String does not have matching close quatation mark.", "Error: The command you have inputted has a syntax error. A string was incomplete.");
        }
        this.lexeme += this.command.charAt(this.charIndex);
        this.stringValue = unescapeString(this.stringValue);
        this.charIndex++;
        return new Token(this.lexeme, TokenType.STRING, this.stringValue);
    };
    Lexer.prototype.stringNumber = function () {
        while (this.charIndex < this.command.length && this.command.charAt(this.charIndex) != " ") {
            this.lexeme += this.command.charAt(this.charIndex);
            this.stringValue += this.command.charAt(this.charIndex);
            this.charIndex++;
        }
        if (isNaN(Number(this.stringValue))) {
            return new Token(this.lexeme, TokenType.STRING, this.stringValue);
        }
        else {
            return new Token(this.lexeme, TokenType.NUMBER, Number(this.stringValue));
        }
    };
    Lexer.prototype.variable = function () {
        while (this.command.charAt(this.charIndex) != "}" && this.charIndex < this.command.length) {
            if (!LexerUtils.isAlphanumeric(this.command.charAt(this.charIndex))) {
                throw new monodronebot_1.SimpleCommandOutputError("None Alphanumeric character at " + this.charIndex, "Error: The command you have inputted has a syntax error. Variable names must be alphanumeric.\n" +
                    "```\n" + this.command + "\n" + " ".repeat(this.charIndex - 1) + "^\n```");
            }
            this.lexeme += this.command.charAt(this.charIndex);
            this.stringValue += this.command.charAt(this.charIndex);
            this.charIndex++;
        }
        if (this.charIndex == this.command.length) {
            throw new monodronebot_1.SimpleCommandOutputError("Variable does not have matching close bracket.", "Error: The command you have inputted has a syntax error. A bracket was incomplete.");
        }
        this.lexeme += this.command.charAt(this.charIndex);
        this.charIndex++;
        return new Token(this.lexeme, TokenType.VARIABLE, this.stringValue);
    };
    Lexer.prototype.whitespace = function () {
        while (this.charIndex < this.command.length && LexerUtils.isWhitespace(this.command.charAt(this.charIndex))) {
            this.lexeme += this.command.charAt(this.charIndex);
            this.stringValue += this.command.charAt(this.charIndex);
            this.charIndex++;
        }
        return new Token(this.lexeme, TokenType.WHITE_SPACE, this.stringValue);
    };
    return Lexer;
}());
var LexerUtils = /** @class */ (function () {
    function LexerUtils() {
    }
    LexerUtils.isAlphanumeric = function (checkee) {
        return checkee.match(/^[A-z0-9]+$/i) != null;
    };
    LexerUtils.isValidStringStarter = function (checkee) {
        return checkee.match(/^[^0-9 ]+$/i) != null;
    };
    LexerUtils.isNumeric = function (checkee) {
        return checkee.match(/^[0-9\-\+]+$/i) != null;
    };
    LexerUtils.isWhitespace = function (checkee) {
        return checkee.match(/^[ \t\n\r]+$/i) != null;
    };
    return LexerUtils;
}());
