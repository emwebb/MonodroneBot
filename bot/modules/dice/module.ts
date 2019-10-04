import {Module, MonodroneBot, Command, CommandObject, ScopeStack, CommandCaller, CommandOutput, CommandStringOutput, SimpleCommandOutputError, UserCaller} from "../../monodronebot"
import { User, Role } from "discord.js";
import { setTimeout } from "timers";
import * as fs from "fs";
import Tokenizr from "tokenizr"

export default class DiceModule implements Module {
    private bot! : MonodroneBot;

    getId(): string {
        return "dice";
    }

    getName(): string {
        return "Dice";
    }

    register(bot: MonodroneBot): void {
        this.bot = bot;
        this.bot.registerCommand(new RollCommand());
    }

    deregister(): void {
        this.bot.deregisterCommand("role");
    }

    configsSave(): void {

    }


}

class RollCommand implements Command{
    getName(): string {
        return "roll";
    }    
    async call(input: CommandObject[], scope: ScopeStack, caller: CommandCaller, bot : MonodroneBot): Promise<CommandOutput> {
        let query = input.map((value) => {
            return value.getStringValue();
        }).join(" ");

        return new CommandStringOutput("Pong! : " + reply);
    }
    getRequiredPermission(): string {
        return "dice.roll";
    }
    getShortHelpText(): string {
        return "Roles a dice."
    }
    getLongHelpText(): string {
        return "Roles a dice."
    }
}

enum TokenType {
    Number,
    Dice,
    Advantage,
    Disadvantage,
    ChooseHighest,
    ChooseLowest,
    ChooseSpecific,
    OpenBracket,
    CloseBreacket,
    Multiply,
    Divide,
    Add,
    Subtract,
    Comment,
    Whitespace
}

class Lexer {
    tokinizer : Tokenizr
    constructor() {
        this.tokinizer = new Tokenizr();
        this.tokinizer.rule(/d/,(ctx, match) => {
            ctx.accept(TokenType.Dice.toString());
        });
        this.tokinizer.rule(/[+-]?[0-9]+/,(ctx, match) => {
            ctx.accept(TokenType.Number.toString(),parseInt(match[0]));
        });
        this.tokinizer.rule(/\(/,(ctx, match) => {
            ctx.accept(TokenType.OpenBracket.toString());
        });
        this.tokinizer.rule(/\)/,(ctx, match) => {
            ctx.accept(TokenType.CloseBreacket.toString());
        });
        this.tokinizer.rule(/ch/,(ctx, match) => {
            ctx.accept(TokenType.ChooseHighest.toString());
        });
        this.tokinizer.rule(/cl/,(ctx, match) => {
            ctx.accept(TokenType.ChooseLowest.toString());
        });
        this.tokinizer.rule(/@/,(ctx, match) => {
            ctx.accept(TokenType.ChooseSpecific.toString());
        });
        this.tokinizer.rule(/\+/,(ctx, match) => {
            ctx.accept(TokenType.Add.toString());
        });
        this.tokinizer.rule(/\+/,(ctx, match) => {
            ctx.accept(TokenType.Subtract.toString());
        });
        this.tokinizer.rule(/a/,(ctx, match) => {
            ctx.accept(TokenType.Advantage.toString());
        });
        this.tokinizer.rule(/d/,(ctx, match) => {
            ctx.accept(TokenType.Disadvantage.toString());
        });
    }
}