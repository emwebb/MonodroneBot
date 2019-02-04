import {Module, MonodroneBot, Command, CommandObject, ScopeStack, CommandCaller, CommandOutput, CommandStringOutput, SimpleCommandOutputError, UserCaller, CommandNull} from "../../monodronebot"
import { User, Role } from "discord.js";
import { setTimeout } from "timers";
import * as fs from "fs";

export default class ControlModule implements Module {
    private bot! : MonodroneBot;

    getId(): string {
        return "control";
    }

    getName(): string {
        return "Control";
    }

    register(bot: MonodroneBot): void {
        this.bot = bot;
        this.bot.registerCommand(new PrintCommand());
        this.bot.registerCommand(new EchoCommand());
    }

    deregister(): void {
        this.bot.deregisterCommand("print");
        this.bot.deregisterCommand("echo");
    }

    configsSave(): void {

    }


}

class EchoCommand implements Command{
    getName(): string {
        return "echo";
    }    
    async call(input: CommandObject[], scope: ScopeStack, caller: CommandCaller, bot : MonodroneBot): Promise<CommandOutput> {
        let echo : string = "";
        input.forEach(element => {
            echo += element.getUserValue() + "\n";
        });
        return new CommandStringOutput(echo);
    }
    getRequiredPermission(): string {
        return "control.echo";
    }
    getShortHelpText(): string {
        return "Echos input.";
    }
    getLongHelpText(): string {
        return "Returns the user value for each item in the arguments.";
    }
}

class PrintCommand implements Command{
    getName(): string {
        return "print";
    }    
    async call(input: CommandObject[], scope: ScopeStack, caller: CommandCaller, bot : MonodroneBot): Promise<CommandOutput> {
        let print : string = "";
        input.forEach(element => {
            print += element.getUserValue() + "\n";
        });
        caller.message(print);
        return new CommandStringOutput("Printed");
    }
    getRequiredPermission(): string {
        return "control.print";
    }
    getShortHelpText(): string {
        return "Prints input.";
    }
    getLongHelpText(): string {
        return "Prints the inputted arguments directly to the channel rather than simply returning them.";
    }
}