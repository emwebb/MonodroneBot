"use strict";
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
        try {
            var lex = new Lexer(this.commandQuery, this.bot.commandIndicator);
            var commandNameToken = lex.next();
            var commandArguments = new Array();
            var nextToken = void 0;
            while ((nextToken = lex.next()).type != TokenType.END_OF_COMMAND) {
                switch (nextToken.type) {
                    case TokenType.STRING:
                        commandArguments.push(new monodronebot_1.CommandString(nextToken.value));
                        break;
                    case TokenType.NUMBER:
                        commandArguments.push(new monodronebot_1.CommandNumber(nextToken.value));
                        break;
                    case TokenType.COMMAND_NAME:
                        commandArguments.push(new monodronebot_1.CommandString(nextToken.lexeme));
                        break;
                    case TokenType.VARIABLE:
                        var variableValue = this.scope.getValue(nextToken.value);
                        if (variableValue == undefined) {
                        }
                        else {
                            commandArguments.push(variableValue);
                        }
                        break;
                    case TokenType.IMBEDDED_COMMAND:
                        this.scope.push();
                        var interpreter = new CommandInterpreter(this.bot, nextToken.value, this.caller, this.scope);
                        var commandOutput = interpreter.interpret();
                        commandArguments.push(commandOutput);
                        this.scope.pop();
                        break;
                    case TokenType.WHITE_SPACE:
                        break;
                    default:
                        break;
                }
            }
            return this.bot.runCommand(commandNameToken.value, commandArguments, this.scope, this.caller);
        }
        catch (error) {
            if (error instanceof monodronebot_1.SimpleCommandOutputError) {
                return error;
            }
            else {
                return new monodronebot_1.SimpleCommandOutputError(error.message + "\n" + error.stack, "Error : There was an unexpected while interpreting the command : " + error.message + "\n" + error.stack);
            }
        }
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
