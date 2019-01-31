import {Client, GuildChannel, Message, User, GuildMember} from "discord.js";
import { CommandInterpreter } from "./commandinterpreter";
import fs = require("fs");
import { EventEmitter } from "events";
import {Mongoose, ConnectionOptions} from "mongoose";
import { MongoError } from "mongodb";

let marked = require("marked");
let TerminalRenderer  = require("marked-terminal");

marked.setOptions({
    // Define custom renderer
    renderer: new TerminalRenderer()
});

export class MonodroneBot extends EventEmitter{
    private client : Client;
    private token : string;
    private commands : Map<string,Command>;
    private commandIndicator : string = "$";
    private consoleCaller : ConsoleCaller;
    private scopes : Map<string, ScopeStack>;
    private permissionManager : PermissionManager;
    private modules : Map<string, Module>;
    private configLoader : ConfigLoader;
    private database : Mongoose;

    constructor(token? :string) {

        
        super();
        this.client = new Client();
        this.commands = new Map<string,Command>();
        this.consoleCaller = new ConsoleCaller(this);
        this.scopes = new Map<string,ScopeStack>();
        this.permissionManager = new PermissionManager();
        this.modules = new Map<string,Module>();
        this.configLoader = new ConfigLoader();
        
        this.permissionManager.loadFromConfig(this.configLoader.get("permissions"));
        
        this.database = new Mongoose();

        let databaseUrl : string | undefined = this.configLoader.get("mongoDBURL");
        if(databaseUrl == undefined) {
            throw new Error("Fatal Error : No mongoDBURL in config.");
        }  
        
        this.database.connect(databaseUrl, {useNewUrlParser: true}, (err: MongoError) => {
            console.error("Fatal Error : Could Not Connect to MongoDB.");
            if(err.code) {
                console.error(err.name);
                console.error(err.message);
                console.error(err.stack);
                process.exit(1);
            }
        });
        
        if(token != undefined) {
            this.token = token;
        } else {
            this.token = this.configLoader.get("token");
        }

        let commandIndicator = this.configLoader.get("commandIndicator");
        if(commandIndicator == undefined) {
            commandIndicator = "$";
        }
        this.commandIndicator = commandIndicator;

        this.client.on("message",(message : Message) => {
            console.log("Recieved message! : " + message.content);
            if(message.content.startsWith("$")) {
                this.consoleCaller.message("Command Recieved : \n" + message.content);
                let caller = new UserCaller(message,this);
                let scope = this.getScope("discord:" + message.channel.id);
                let interpreter = new CommandInterpreter(this,message.content,caller,scope);
                let output : CommandOutput = interpreter.interpret();
                message.reply(output.getUserValue());
            }
            
        });
        this.emit("start");
    }

    public login() {
        this.client.login(this.token)
            .then(console.log)
            .catch(console.error);
    }

    public stop() {
        this.emit("stop");
        this.configLoader.set("permissions",this.permissionManager.saveToConfig());
        this.configLoader.set("token",this.token);
        this.configLoader.set("commandIndicator",this.commandIndicator)
        for(let moduleName in this.modules.keys()) {
            this.modules.get(moduleName)!.configsSave();
            this.modules.get(moduleName)!.deregister();
            this.modules.delete(moduleName);
        }
        
        this.configLoader.save();

        this.database.disconnect();
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
                return this.commands.get(name)!.call(commandArguments, scope, caller, this);
            } else {
                return new SimpleCommandOutputError("Command does not exist", "Error :  Command '" + name + "' does not exist!");
            }
        } catch(error) {
            console.log(error);
            if(error instanceof Error) {
                return new SimpleCommandOutputError(error.name + "\n" + error.message + "\n" + error.stack, "Error :  Command failed with an error : " + error.message);
            }
            return new SimpleCommandOutputError(JSON.stringify(error), "Error :  Command failed with an error : " + JSON.stringify(error));
        }
    }

    public registerCommand(command : Command) {
        this.commands.set(command.getName(),command);
    }

    public deregisterCommand(commandName : string) {
        this.commands.delete(commandName);
    }

    public registerModule(module : Module) {
        module.register(this);
        this.modules.set(module.getId(),module);
    }

    public dergisterModule(moduleId : string) {
        if(this.modules.has(moduleId)) {
            this.modules.get(moduleId)!.deregister();
            this.modules.delete(moduleId);
        }
    }

    public getModule(moduleName : string) : Module | undefined {
        return this.modules.get(moduleName);
    }

    public getClient() : Client {
        return this.client;
    }

    public getCommandIndicator() : string {
        return this.commandIndicator;
    }

    public getConfigLoader() : ConfigLoader {
        return this.configLoader;
    }

    public getPermissionManager() : PermissionManager {
        return this.permissionManager;
    }

    public getCommands() : Map<string,Command> {
        return this.commands;
    }

    public getDatabase() : Mongoose {
        return this.database;
    }
}

export class ConfigLoader {
    private config : any;
    
    constructor() {
        if(fs.existsSync("config.json")) {
            let configString : string = fs.readFileSync("config.json",{"encoding" : "utf8"});
            this.config = JSON.parse(configString);
        } else {
            this.config = {};
        }
    }

    get(key : string) : any {
        return this.config[key];
    }

    set(key :string, value : any) {
        this.config[key] = value;
    }

    save() {
        let configString : string = JSON.stringify(this.config,undefined,4);
        fs.writeFileSync("config.json",configString,{encoding:"utf8"});
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
                let user = await this.bot.getClient().fetchUser(userId);
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
                let channel = this.bot.getClient().channels.get(channelId);
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
    private permissionNode : PermissionNode;

    constructor(message : Message, bot : MonodroneBot) {
        this.permissionNode = bot.getPermissionManager().getPermissionsForUser(message.author);
        this.initMessage = message;
    }
    getType(): string {
        return "USER";
    }    
    hasPermission(permission: string): boolean {
        return this.permissionNode.hasPermission(permission);
    }

    message(message: string): Promise<any> {
        return this.initMessage.reply(message);
    }

    directMessage(message: string): Promise<any> {
        return this.initMessage.author.dmChannel.send(message);
    }

    getRawMessage() : Message {
        return this.initMessage;
    }
}

class PermissionManager {
    private userPermission: Map<string, PermissionNode> = new Map();
    private discordRolePermission: Map<string, PermissionNode>  = new Map();
    private everyonePermission: PermissionNode  = new PermissionNode();

    getPermissionsForUser(user : User) {
        let permissions = this.everyonePermission;

        let userId = user.id;
        if(this.userPermission.has(userId)){
            permissions = PermissionNode.merge(permissions,this.userPermission.get(userId)!);
        }

        if(user instanceof GuildMember) {
            let guildMember = <GuildMember>user;
            guildMember.roles.forEach(role => {
                let roleId = role.id;
                if(this.discordRolePermission.has(roleId)){
                    permissions = PermissionNode.merge(permissions,this.discordRolePermission.get(roleId)!);
                }
            });
        }

        return permissions;
    }

    loadFromConfig(config : any) {

        if(config == undefined) {
            return;
        }
        if(config["everyone"] != undefined) {
            this.everyonePermission = PermissionNode.fromJson(config["everyone"]);
        }

        if(config["userPermission"] != undefined) {
            for(let key in config["userPermission"]) {
                this.userPermission.set(key, PermissionNode.fromJson(config["userPermission"][key]));
            }
        }

        if(config["discordRolePermission"] != undefined) {
            for(let key in config["discordRolePermission"]) {
                this.discordRolePermission.set(key, PermissionNode.fromJson(config["discordRolePermission"][key]));
            }
        }
    }
    
    saveToConfig() : any {
        let config : any = {};
        config["everyone"] = this.everyonePermission.toJson();

        config["userPermission"] = {};
        for(let permissionKey in this.userPermission.keys()) {
            config["userPermission"][permissionKey] = this.userPermission.get(permissionKey)!.toJson();
        }

        config["discordRolePermission"] = {};
        for(let permissionKey in this.discordRolePermission.keys()) {
            config["discordRolePermission"][permissionKey] = this.discordRolePermission.get(permissionKey)!.toJson();
        }

        return config;
    }
}

class PermissionNode {
    protected children : Map<string,PermissionNode> = new Map();

    hasPermission(permissionArray : Array<string> | string) {

        if(permissionArray instanceof String) {
            permissionArray = permissionArray.split(".");
        }

        if(permissionArray.length == 0){
            return true;
        }

        if(this.children.has("*")) {
            return true;
        }

        if(this.children.has(permissionArray[0])){
            let newPermissionArray = permissionArray.slice(1,permissionArray.length);
            this.children.get(permissionArray[0])!.hasPermission(newPermissionArray);
        }

        return false;
    }

    clone() : PermissionNode {
        let clone : PermissionNode = new PermissionNode();
        for(let key in this.children.keys()) {
            clone.children.set(key,this.children.get(key)!.clone());
        }
        return clone;
        
    }
    
    static merge(a : PermissionNode, b : PermissionNode) : PermissionNode {
        let c = new PermissionNode();
        for(let key in a.children.keys()) {
            if(b.children.has(key)){
                c.children.set(key,this.merge(a.children.get(key)!,b.children.get(key)!));
            } else {
                c.children.set(key,a.clone());
            }
        }

        for(let key in b.children.keys()) {
            if(!c.children.has(key)){
                c.children.set(key,b.clone());
            }
        }

        return c;
    }
    
    static fromJsonString(jsonString : string) : PermissionNode {
        return PermissionNode.fromJson(JSON.parse(jsonString));
    }

    static fromJson(rawJson : any) : PermissionNode {
        let newNode = new PermissionNode();
        for(let key in rawJson) {
            newNode.children.set(key,PermissionNode.fromJson(rawJson[key]));
        }
        return newNode;
    }

    toJson() : any {
        let asJson : any = {};
        for(let nodeKey in this.children.keys()) {
            asJson[nodeKey] = this.children.get(nodeKey)!.toJson();
        }

        return asJson;
    }
}

export interface Command {
    getName() : string;
    call(input : CommandObject[], scope : ScopeStack, caller : CommandCaller, bot : MonodroneBot) : CommandOutput;
    getRequiredPermission() : string;
    getShortHelpText() : string;
    getLongHelpText() : string;
}

export interface Module {
    getId() : string;
    getName() : string;
    register(bot : MonodroneBot) : void;
    deregister() : void;
    configsSave() : void;
}
