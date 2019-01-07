import {Client, GuildChannel, Message} from "discord.js";
import { stringify } from "querystring";
let marked = require("marked");
let TerminalRenderer  = require("marked-terminal");

marked.setOptions({
    // Define custom renderer
    renderer: new TerminalRenderer()
});

export class MonodroneBot {
    client : Client;
    token : string;
    commands : Map<string,Command>;
    commandIndicator : string = "$";
    consoleCaller : ConsoleCaller;
    constructor(token :string) {
        this.token = token;
        this.client = new Client();
        this.commands = new Map<string,Command>();
        this.consoleCaller = new ConsoleCaller(this);
        this.client.on("message",(message : Message) => {
            if(message.content.startsWith("$")) {
                this.consoleCaller.message("Command Recieved : \n" + message.content);
            }
            
        });
    }

    public login() {
        this.client.login(this.token)
            .then(console.log)
            .catch(console.error);
    }

    public stop() {
        this.client.destroy()
            .then(console.log)
            .catch(console.error);
    }

    public runCommand(name : string, commandArguments : CommandObject[], scope : ScopeStack, caller : CommandCaller ) : CommandOutput {
        try {
            if(this.commands.has(name)) {
                return this.commands.get(name).call(commandArguments, scope, caller);
            } else {
                return new SimpleCommandOutputError("Command does not exist", "Error :  Command '" + name + "' does not exist!");
            }
        } catch(error) {
            return new SimpleCommandOutputError(JSON.stringify(error), "Error :  Command failed with an error : " + JSON.stringify(error));
        }
    }
}

export interface CommandObject {
    hasNumberValue() : boolean;
    getNumberValue() : number;
    hasStringValue() : boolean;
    getStringValue() : string;
    getUserValue() : string;
    getValueType() :string;
    getValue() : any;
}

export abstract class CommandError implements CommandObject {
    hasNumberValue(): boolean {
        return false;
    }    
    getNumberValue(): number {
        return null;
    }
    hasStringValue(): boolean {
        return true;
    }
    getStringValue(): string {
        return this.getErrorString();
    }
    getUserValue(): string {
       return this.getUserReadibleError();
    }
    getValueType(): string {
        return "string";
    }
    getValue() {
        return this.getErrorString();
    }

    abstract getUserReadibleError() : string;
    abstract getErrorString() : string;
    
}

class SimpleCommandError extends CommandError {
    error : string;
    userError : string;
        
    constructor(error : string, userError : string) {
        super();
        this.error = error;
        this.userError = userError;
    }
        
    getUserReadibleError(): string {
        return this.userError;
    }

    getErrorString(): string {
        return this.error;
    }
}

export class SimpleCommandOutputError implements CommandOutput {

    error : CommandError;

    constructor(error : string, userError : string) {
        this.error = new SimpleCommandError(error, userError);
    }

    hadError(): boolean {
        return true;
    }
    getError(): CommandError {
        return this.error;
        
    }
    hasNumberValue(): boolean {
        return false;
    }
    getNumberValue(): number {
        return null;
    }
    hasStringValue(): boolean {
        return true;
    }
    getStringValue(): string {
        return this.error.getStringValue();
        
    }
    getUserValue(): string {
        throw this.error.getUserValue();
    }
    getValueType(): string {
        return "string";
    }
    getValue() {
       return this.error.getValue();
    }
   


}

export interface CommandOutput extends CommandObject {
    hadError() : boolean;
    getError() : CommandError;
}

export class CommandString implements CommandObject {

    value : string;

    constructor(value : string) {
        this.value = value;
    }

    hasNumberValue(): boolean {
        return false;
    }    
    getNumberValue(): number {
        return null;
    }
    hasStringValue(): boolean {
        return true;
    }
    getStringValue(): string {
        return this.value;
    }
    getUserValue(): string {
        return this.value;
    }
    getValueType(): string {
        return "string";
    }
    getValue() {
        return this.value;
    }
}

export class CommandNumber implements CommandObject {

    value : number;
    
    constructor(value : number) {
        this.value = value;
    }

    hasNumberValue(): boolean {
        return true;
    }    

    getNumberValue(): number {
        return this.value;
    }

    hasStringValue(): boolean {
        return true;
    }

    getStringValue(): string {
        return this.value.toString();
    }

    getUserValue(): string {
        return this.value.toString();
    }

    getValueType(): string {
        return "number";
    }

    getValue() {
        return this.value;
    }
}

class Scope extends Map<string,CommandObject> {

}

export class ScopeStack {
    scopes : Array<Scope>
    getValue(name : string, down? :number) : CommandObject {
        if(down == null) {
            down = 0;
        }
        for(let n = this.scopes.length - 1 - down ; n >= 0; n++) {
            if(this.scopes[n].has(name)){
                return this.scopes[n].get(name)
            }
        }

        return null;
    }

    hasValue(name : string, down? :number) : boolean {
        if(down == null) {
            down = 0;
        }
        for(let n = this.scopes.length - 1 - down ; n >= 0; n++) {
            if(this.scopes[n].has(name)){
                return true;
            }
        }

        return false;
    }

    pop() : Scope {
        return this.scopes.pop();
    }

    push(scope? : Scope) {
        if(scope == null) {
            scope = new Scope();
        }

        this.scopes.push(scope);
    }

    getStackDepth() : number {
        return this.scopes.length;
    }
}

export interface CommandCaller {
    getType() : string;
    hasPermission(permission : string) : boolean;
    message(message : string) : Promise<any>;
    directMessage(message : string) : Promise<any>;
}

class ConsoleCaller implements CommandCaller{
    
    bot : MonodroneBot;

    constructor(bot : MonodroneBot) {
        this.bot = bot;
    }
    getType(): string {
        return "CONSOLE";
    }    
    hasPermission(permission: string): boolean {
        return true;
    }
    async message(message: string) : Promise<string> {
        let mentionRegex = /<@\![0-9]*>/g;
        let mentionMatches = mentionRegex.exec(message);
        if(mentionMatches != null) {
            for (let index = 0; index < mentionMatches.length; index++) {
                const mention = mentionMatches[index];
                let userId = mention.substring(3,mention.length - 1);
                let user = await this.bot.client.fetchUser(userId);
                let username = "@" + user.tag;
                let replaceRegex = new RegExp("<@\!" + userId + ">");
                message = message.replace(replaceRegex,username);
            }
        }
        

        let channelRegex = /<#[0-9]*>/g;
        let channelMatches = channelRegex.exec(message);
        if(channelMatches != null) {
            for (let index = 0; index < channelMatches.length; index++) {
                const channelmention = channelMatches[index];
                let channelId = channelmention.substring(2,channelmention.length - 1);
                let channel = this.bot.client.channels.get(channelId);
                let channelname = "#" + (<GuildChannel>channel).name;
                let replaceRegex = new RegExp("<#" + channelId + ">");
                message = message.replace(replaceRegex,channelname);
            }
        }

        console.log(marked(message));
        return Promise.resolve(message);

    }

    directMessage(message: string) : Promise<string> {
        return this.message(message);
    }
}

class UserCaller implements CommandCaller {

    private initMessage : Message;

    constructor(message : Message) {
        this.initMessage = message;
    }
    getType(): string {
        return "USER";
    }    
    hasPermission(permission: string): boolean {
        return true; // TODO : Implement proper permission system.
    }

    message(message: string): Promise<any> {
        return this.initMessage.reply(message);
    }

    directMessage(message: string): Promise<any> {
        return this.initMessage.author.dmChannel.send(message);
    }


}

export interface Command {
    getName() : string;
    call(input : CommandObject[], scope : ScopeStack, caller : CommandCaller) : CommandOutput;
    getRequiredPermission() : string;
    getShortHelpText() : string;
    getLongHelpText() : string;
}


