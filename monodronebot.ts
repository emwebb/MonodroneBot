import {Client, GuildChannel, Message} from "discord.js";
import { CommandInterpreter } from "./commandinterpreter";
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
    scopes : Map<string, ScopeStack>;
    constructor(token :string) {
        this.token = token;
        this.client = new Client();
        this.commands = new Map<string,Command>();
        this.consoleCaller = new ConsoleCaller(this);
        this.scopes = new Map<string,ScopeStack>();
        this.client.on("message",(message : Message) => {
            console.log("Recieved message! : " + message.content);
            if(message.content.startsWith("$")) {
                this.consoleCaller.message("Command Recieved : \n" + message.content);
                let caller = new UserCaller(message);
                let scope = this.getScope("discord:" + message.channel.id);
                let interpreter = new CommandInterpreter(this,message.content,caller,scope);
                let output : CommandOutput = interpreter.interpret();
                message.reply(output.getUserValue());
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

    public getScope(id : string) : ScopeStack{
        if(this.scopes.has(id)){
            return this.scopes.get(id)!;
        } else {
            this.scopes.set(id,new ScopeStack());
            return this.scopes.get(id)!; 
        }
    }

    public runCommand(name : string, commandArguments : CommandObject[], scope : ScopeStack, caller : CommandCaller ) : CommandOutput {
        try {
            if(this.commands.has(name)) {
                return this.commands.get(name)!.call(commandArguments, scope, caller);
            } else {
                return new SimpleCommandOutputError("Command does not exist", "Error :  Command '" + name + "' does not exist!");
            }
        } catch(error) {
            return new SimpleCommandOutputError(JSON.stringify(error), "Error :  Command failed with an error : " + JSON.stringify(error));
        }
    }

    public registerCommand(command : Command) {
        this.commands.set(command.getName(),command);
    }
}

export interface CommandObject {
    hasNumberValue() : boolean;
    getNumberValue() : number | null;
    hasStringValue() : boolean;
    getStringValue() : string | null;
    getUserValue() : string;
    getValueType() :string;
    getValue() : any;
}

export interface CommandObjectWithError {
    getUserReadibleError() : string;
    getErrorString() : string;
}

export abstract class CommandError implements CommandObject , CommandObjectWithError{
    hasNumberValue(): boolean {
        return false;
    }    
    getNumberValue(): null {
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

export class SimpleCommandError extends CommandError {
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

export class CommandNull implements CommandObject, CommandObjectWithError {
    causeOfNull : string;

    constructor(causeOfNull : string) {
        this.causeOfNull = causeOfNull;
    }

    getUserReadibleError(): string {
        return "Error : A value was null. Reason : " + this.causeOfNull;
    }    
    
    getErrorString(): string {
        return "Null value : " + this.causeOfNull;
    }

    hasNumberValue(): boolean {
        return false;
    }    
    getNumberValue(): null {
        return null;
    }
    hasStringValue(): boolean {
        return true;
    }
    getStringValue(): string {
        return "null"
    }
    getUserValue(): string {
       return "NULL";
    }
    getValueType(): string {
        return "null";
    }
    getValue() : null {
        return null;
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
    getNumberValue(): null{
        return null;
    }
    hasStringValue(): boolean {
        return true;
    }
    getStringValue(): string {
        return this.error.getStringValue();
        
    }
    getUserValue(): string {
        return this.error.getUserValue();
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
    getError() : CommandError | undefined;
}

export class CommandString implements CommandObject {

    value : string;

    constructor(value : string) {
        this.value = value;
    }

    hasNumberValue(): boolean {
        return false;
    }    
    getNumberValue(): null {
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

export class CommandStringOutput extends CommandString implements CommandOutput {

    error : CommandError | undefined;
    constructor(value : string, error? : CommandError) {
        super(value);
        this.error = error;
    }

    hadError(): boolean {
        return this.error != null;
    }    
    getError(): CommandError | undefined{
        return this.error;
    }
}

class Scope {
    scopeMap : Map<string,CommandObject> = new Map<string,CommandObject>();
    has(key : string) : boolean {
        return this.scopeMap.has(key);
    }

    get(key : string) : CommandObject {
        let value : CommandObject | undefined = this.scopeMap.get(key);
        if(value == undefined) {
            return new CommandNull("Variable '" + key + "' does not exist in the current scope.");
        } else {
            return value;
        }

    }
}

export class ScopeStack {
    scopes: Array<Scope>;
    constructor() {
        this.scopes = new Array<Scope>();
        this.scopes.push(new Scope())
    }
    getValue(name : string, down? :number) : CommandObject {
        if(down == undefined) {
            down = 0;
        }
        for(let n = this.scopes.length - 1 - down ; n >= 0; n--) {
            if(this.scopes[n].has(name)){
                return this.scopes[n].get(name)
            }
        }

        return new CommandNull("Variable '" + name + "' does not exist in the current scope.");;
    }

    hasValue(name : string, down? :number) : boolean {
        if(down == null) {
            down = 0;
        }
        for(let n = this.scopes.length - 1 - down ; n >= 0; n--) {
            if(this.scopes[n].has(name)){
                return true;
            }
        }

        return false;
    }

    pop() : Scope | null{
        if(this.scopes.length > 1) {
            return this.scopes.pop()!;
        } else {
            return null;
        }
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


