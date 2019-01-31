import {Module, MonodroneBot, Command, CommandObject, ScopeStack, CommandCaller, CommandOutput, CommandStringOutput} from "../../monodronebot"

export default class CoreModule implements Module {
    private bot! : MonodroneBot;

    getId(): string {
        return "core";
    }

    getName(): string {
        return "Core";
    }

    register(bot: MonodroneBot): void {
        this.bot = bot;
        this.bot.registerCommand(new PingCommand());
        this.bot.registerCommand(new HelpCommand());
    }

    deregister(): void {
        this.bot.deregisterCommand("ping");
        this.bot.deregisterCommand("help");
    }

    configsSave(): void {

    }


}

class PingCommand implements Command{
    getName(): string {
        return "ping";
    }    
    call(input: CommandObject[], scope: ScopeStack, caller: CommandCaller, bot : MonodroneBot): CommandOutput {
        let reply = JSON.stringify(input);
        return new CommandStringOutput("Pong! : " + reply);
    }
    getRequiredPermission(): string {
        return "core.ping";
    }
    getShortHelpText(): string {
        return "Bounces back!"
    }
    getLongHelpText(): string {
        return "Replies Pong! Plus any other argumenst you sent it."
    }


}

class HelpCommand implements Command{
    getName(): string {
        return "help";
    }    
    call(input: CommandObject[], scope: ScopeStack, caller: CommandCaller, bot : MonodroneBot): CommandOutput {
        let iterator = bot.getCommands().values();
        let value : IteratorResult<Command>;
        let helpString : string = "";

        while(true) {
            value = iterator.next();
            if(value.done) {
                break;
            }
            let command : Command = value.value
            helpString += bot.getCommandIndicator() + command.getName() + " - " + command.getShortHelpText() + "\n";
        }

        return new CommandStringOutput(helpString);
    }
    getRequiredPermission(): string {
        return "core.help";
    }
    getShortHelpText(): string {
        return "Shows a list of commands and description."
    }
    getLongHelpText(): string {
        return "Shows a list of commands and descriptions."
    }


}


