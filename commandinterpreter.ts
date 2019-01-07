import { MonodroneBot, CommandCaller, CommandOutput, SimpleCommandOutputError, ScopeStack, CommandObject, CommandString, CommandNumber } from "./monodronebot";

class CommandInterpreter {
    bot : MonodroneBot;
    commandQuery : string;
    caller : CommandCaller;
    scope : ScopeStack;
    constructor(bot : MonodroneBot, command : string, caller : CommandCaller, scope : ScopeStack) {
        this.bot = bot;    
        this.commandQuery = command;
        this.caller = caller;
        this.scope = scope;
    }

    interpret() : CommandOutput {
        let lex : Lexer = new Lexer(this.commandQuery, this.bot.commandIndicator);
        let commandNameToken : Token; 
        try {
            commandNameToken = lex.next();
        } catch (error) {
            if(error instanceof SimpleCommandOutputError) {
                return error;
            } else {
                return new SimpleCommandOutputError(JSON.stringify(error),"Error : There was an unexpected while interpreting the command : " + JSON.stringify(error));
            }
        }
        let commandArguments : Array<CommandObject> = new Array();
        let nextToken : Token;
        while((nextToken = lex.next()).type != TokenType.END_OF_COMMAND) {
            switch (nextToken.type) {
                case TokenType.STRING:
                    commandArguments.push(new CommandString(nextToken.value));
                    break;
                case TokenType.NUMBER:
                    commandArguments.push(new CommandNumber(nextToken.value));
                    break;
                case TokenType.COMMAND_NAME:
                    commandArguments.push(new CommandString(nextToken.lexeme));
                    break;
                case TokenType.VARIABLE:
                    let variableValue : CommandObject = this.scope.getValue(nextToken.value);
                    commandArguments.push(variableValue);
                    break;
                case TokenType.IMBEDDED_COMMAND:
                    this.scope.push();
                    let interpreter : CommandInterpreter = new CommandInterpreter(this.bot,nextToken.value,this.caller, this.scope);
                    let commandOutput : CommandOutput = interpreter.interpret();
                    commandArguments.push(commandOutput);
                    this.scope.pop();
                    break;
                case TokenType.WHITE_SPACE :
                    break;
                default:
                    break;
            }
        }

        this.bot.runCommand(commandNameToken.value, commandArguments, this.scope, this.caller);
    }
}

enum TokenType {
    STRING,
    NUMBER,
    COMMAND_NAME,
    VARIABLE,
    IMBEDDED_COMMAND,
    WHITE_SPACE,
    END_OF_COMMAND
}

class Token {
    lexeme : string;
    type : TokenType;
    value : any ;

    constructor(lexeme : string, type : TokenType, value : any) {
        this.lexeme = lexeme;
        this.type = type;
        this.value = value;
    }
}

class Lexer {
    command : string;
    commandIndicator : string;
    charIndex : number;
    lexeme : string;
    stringValue : string;
    constructor(command : string, commandIndicator : string) {
        this.command = command;
        this.commandIndicator = commandIndicator;
        this.charIndex = 0;
    }

    next() : Token {
        this.lexeme = "";
        this.stringValue = "";

        if(this.command.substr(this.charIndex, this.charIndex + this.commandIndicator.length) == this.commandIndicator) {
            this.lexeme += this.command.substr(this.charIndex, this.charIndex + this.commandIndicator.length);
            this.charIndex += this.commandIndicator.length;
            return this.commandName();
        }

        if(this.command.charAt(this.charIndex) == "[") {
            this.lexeme += this.command.charAt(this.charIndex);
            this.charIndex++;
            return this.imbeddedCommand();
        }

        if(this.command.charAt(this.charIndex) == "\""){
            this.lexeme += this.command.charAt(this.charIndex);
            this.charIndex++;
            return 

        }
    }

    commandName() : Token {
        while(LexerUtils.isAlphanumeric(this.command.charAt(this.charIndex))){
            this.lexeme += this.command.charAt(this.charIndex);
            this.stringValue += this.command.charAt(this.charIndex);
            this.charIndex++;
        }
        if(this.command.charAt(this.charIndex) != " " && this.charIndex < this.command.length) {
            throw new SimpleCommandOutputError("Command names must be alphanumeric. None Alphanumeric character at " + this.charIndex + ".",
                "Error: The command you have inputted has a syntax error. You have not used an alphanumeric command.\n" + 
                "```\n" + this.command + "\n" + " ".repeat(this.charIndex-1) + "^\n```");
        }
        return new Token(this.lexeme, TokenType.COMMAND_NAME, this.stringValue);
    }

    imbeddedCommand() : Token {
        let stackCounter = 1;
        let initBracketPos = this.charIndex - 1;
        while(stackCounter > 0 && this.charIndex < this.command.length) {
            if(this.command.charAt(this.charIndex) == "[") {
                stackCounter++;
                this.stringValue += this.command.charAt(this.charIndex) ;
            } else if(this.command.charAt(this.charIndex) == "]") {
                stackCounter--;
                if(stackCounter != 0) {
                    this.stringValue += this.command.charAt(this.charIndex) ;
                }
            } else {
                this.stringValue += this.command.charAt(this.charIndex) ;
            }
            this.lexeme += this.command.charAt(this.charIndex) ;
        }
        if(stackCounter == 0) {
            return new Token(this.lexeme,TokenType.IMBEDDED_COMMAND, this.stringValue);
        } else {
            throw new SimpleCommandOutputError("Imbedded command bracket at " + this.charIndex,
                "Error: The command you have inputted has a syntax error. An imbedded command bracket does not have a matching close bracket.\n" + 
                "```\n" + this.command + "\n" + " ".repeat(initBracketPos-1) + "^\n```");
        }
    }

    quotedString() {

    }
}

class LexerUtils {
    static isAlphanumeric(checkee : string) {
        return checkee.match(/^[a-Z0-9]+$/i).length > 0;
    }

    static isValidStringStarter(checkee : string) {
        return checkee.match(/^[^0-9 ]+$/i).length > 0;
    }

    static isNumeric(checkee : string) {
        return checkee.match(/^[0-9]+$/i).length > 0;
    }
}