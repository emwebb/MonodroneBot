import {Module, MonodroneBot, Command, CommandObject, ScopeStack, CommandCaller, CommandOutput, CommandStringOutput, SimpleCommandOutputError, UserCaller} from "../../monodronebot"
import { User, Role } from "discord.js";

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
        this.bot.registerCommand(new PermissionCommand());
    }

    deregister(): void {
        this.bot.deregisterCommand("ping");
        this.bot.deregisterCommand("help");
        this.bot.deregisterCommand("permission");
    }

    configsSave(): void {

    }


}

class PingCommand implements Command{
    getName(): string {
        return "ping";
    }    
    async call(input: CommandObject[], scope: ScopeStack, caller: CommandCaller, bot : MonodroneBot): Promise<CommandOutput> {
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
    async call(input: CommandObject[], scope: ScopeStack, caller: CommandCaller, bot : MonodroneBot): Promise<CommandOutput> {
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

class PermissionCommand implements Command{
    getName(): string {
        return "permission";
    }    
    async call(input: CommandObject[], scope: ScopeStack, caller: CommandCaller, bot : MonodroneBot): Promise<CommandOutput> {
        if(input.length < 2) {
            return new SimpleCommandOutputError("Need atleast 2 arguments", "Error : This command needs atleast 2 argumenst");
        }
        if(!(caller instanceof UserCaller)) {
            return new SimpleCommandOutputError("This command can only be called from a discord guild.", "Error : This command can only be called from a discord guild.");
        }
        let subCommand : CommandObject = input[0];
        let grantee : CommandObject = input[1];
        if(subCommand.hasStringValue() && grantee.hasStringValue()){
            
            let granteeValue : User | Role | string | undefined;
            granteeValue = await bot.getUserFromString(grantee.getStringValue()!,caller.getRawMessage().guild);
            if(granteeValue == undefined) {
                granteeValue = await bot.getRoleFromString(grantee.getStringValue()!,caller.getRawMessage().guild);
            }
            if(granteeValue == undefined) {
                if(grantee.getStringValue() == "everyone" || grantee.getStringValue() == "@everyone" ) {
                    granteeValue = "everyone";
                }
            }

            if(granteeValue == undefined) {
                return new SimpleCommandOutputError("Could not resolve '" + grantee.getUserValue() + "' to Role or User", "Error : Could not resolve '" + grantee.getUserValue() + "' to Role or User");
            }
            let permissionManager = bot.getPermissionManager();
            let grant = false;
            switch (subCommand.getStringValue()!.toLocaleLowerCase()) {
                case "grant":
                grant = true;
                case "revoke":
                    for(let n = 2; n < input.length; n++) {
                        let permissionObject = input[n];
                        if(permissionObject.hasStringValue()) {
                            if(grant) {
                                if(granteeValue instanceof User) {
                                    permissionManager.grantPermissionToUser(granteeValue,permissionObject.getStringValue()!);
                                    return new CommandStringOutput("Granted " + permissionObject.getStringValue()! + " to user " + granteeValue.tag);
                                }

                                if(granteeValue instanceof Role) {
                                    permissionManager.grantPermissionToRole(granteeValue,permissionObject.getStringValue()!);
                                    return new CommandStringOutput("Granted " + permissionObject.getStringValue()! + " to role" + granteeValue.name);
                                }

                                if(granteeValue == "everyone") {
                                    permissionManager.grantPermissionToEveryone(permissionObject.getStringValue()!);
                                    return new CommandStringOutput("Granted " + permissionObject.getStringValue()! + " to " + granteeValue);
                                }
                            } else {
                                if(granteeValue instanceof User) {
                                    permissionManager.removePermissionToUser(granteeValue,permissionObject.getStringValue()!);
                                    return new CommandStringOutput("Revoked " + permissionObject.getStringValue()! + " from user " + granteeValue.tag);
                                }

                                if(granteeValue instanceof Role) {
                                    permissionManager.removePermissionToRole(granteeValue,permissionObject.getStringValue()!);
                                    return new CommandStringOutput("Revoked " + permissionObject.getStringValue()! + " from role" + granteeValue.name);
                                }

                                if(granteeValue == "everyone") {
                                    permissionManager.removePermissionToEveryone(permissionObject.getStringValue()!);
                                    return new CommandStringOutput("Revoked " + permissionObject.getStringValue()! + " from " + granteeValue);
                                }
                            }
                        }
                    }
                    break;
                case "list" :
                    if(granteeValue instanceof User) {
                        return new CommandStringOutput(granteeValue.tag + " has permissions :\n" + permissionManager.listPermissionForUser(granteeValue).join("\n"));
                    }

                    if(granteeValue instanceof Role) {
                        return new CommandStringOutput(granteeValue.name + " has permissions :\n" + permissionManager.listPermissionForRole(granteeValue).join("\n"));
                    }

                    if(granteeValue == "everyone") {
                        return new CommandStringOutput(granteeValue + " has permissions :\n" + permissionManager.listPermissionForEveryone().join("\n"));
                    }
                    break;
                default:
                    break;
            }
        } else {
            return new SimpleCommandOutputError("First and Second argument must have string value!", "Error : First and Second argument must have string value! Got '" + subCommand.getUserValue() + "' and '" + grantee.getUserValue() + "' instead.");
        }

        return new CommandStringOutput("");
    }
    getRequiredPermission(): string {
        return "core.permission";
    }
    getShortHelpText(): string {
        return "Grant , Remove or List permissions a role or user has.";
    }
    getLongHelpText(): string {
        return "$permission <grant/revoke/list> <username/userid/role name/role id/everyone> [permission name..]";
    }
}
