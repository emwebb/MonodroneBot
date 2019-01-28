import {MonodroneBot, Command, CommandObject, ScopeStack, CommandCaller, CommandOutput, CommandString, CommandStringOutput} from "./monodronebot";

let token = process.argv[2];
let bot =  new MonodroneBot(token);

class PingCommand implements Command{
    getName(): string {
        return "ping";
    }    
    call(input: CommandObject[], scope: ScopeStack, caller: CommandCaller): CommandOutput {
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
        return "Replies Pong! plus any other argumenst you sent it."
    }


}

bot.registerCommand(new PingCommand());

bot.login();


process.on("SIGINT", () : void => {
    console.log("Stopping");
    bot.stop();
});