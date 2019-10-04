import {Module, MonodroneBot, Command, CommandObject, ScopeStack, CommandCaller, CommandOutput, CommandStringOutput, SimpleCommandOutputError, UserCaller, SimpleCommandError} from "../../monodronebot"
import { Message, User, Role, Guild, GuildChannel, DMChannel, TextChannel, GroupDMChannel, Webhook, Base64Resolvable, MessageEmbedField} from "discord.js";
import { setTimeout } from "timers";
import * as fs from "fs";
import { sheets_v4, drive_v3, google } from "googleapis";
import { GetAccessTokenResponse, OAuth2Client } from "google-auth-library/build/src/auth/oauth2client";
import { Credentials } from "google-auth-library";
import * as readline from "readline"
import { oauth2 } from "googleapis/build/src/apis/oauth2";
import { Gaxios } from "gaxios";
import { Document, Schema, Model, model } from "mongoose";
import { analytics } from "googleapis/build/src/apis/analytics";
import { Server } from "net";
import InCharacterChannel, { IInCharacterChannel } from "../../../common/models/inCharacterChannel";
import UserInCharacterName, { IUserInCharacterName } from "../../../common/models/userInCharacterName";
import { isNullOrUndefined } from "util";



export default class InCharacterChatModule implements Module {
    private bot! : MonodroneBot;
    private oAuth : OAuth2Client | undefined;
    getId(): string {
        return "inCharacterChat";
    }

    getName(): string {
        return "In Character Chat";
    }

    register(bot: MonodroneBot): void {
        this.bot = bot;
        bot.getClient().on("message",(message : Message) => {
            let channelId = message.channel.id;
            if(message.author.bot || message.content.startsWith(bot.getCommandIndicator()) || message.content.startsWith("OC")) {
                return
            }
            InCharacterChannel.findOne({
                discordChannelId : channelId
            }, (err, icChannel) => {
                if(!isNullOrUndefined(icChannel)) {
                    UserInCharacterName.findOne({
                        discordUserId : message.author.id
                    }, (err, inCharacterName) => {
                        if(!isNullOrUndefined(inCharacterName)) {
                            let channel = message.channel;
                            if(channel instanceof TextChannel) {
                                message.delete();
                                channel.fetchWebhooks().then((webhooks) => {
                                    webhooks.get(icChannel.webhookID.valueOf())!.sendMessage(message.content,
                                        {
                                            username : inCharacterName.name.valueOf()
                                        })
                                });
                            }
                        }
                    });
                }
            });

        });
        bot.registerCommand(new SetICName());
        bot.registerCommand(new RegisterInCharacterChannel())
    }

    deregister(): void {
        this.bot.deregisterCommand("seticname");
        this.bot.deregisterCommand("registericchannel");
    }

    configsSave(): void {
    }
    

}

class RegisterInCharacterChannel implements Command{
    getName(): string {
        return "registericchannel";
    }    
    async call(input: CommandObject[], scope: ScopeStack, caller: CommandCaller, bot : MonodroneBot): Promise<CommandOutput> {
        
        if(input.length != 0){
            return new SimpleCommandOutputError("Command requires 0 arguments");
        }

        let channel : TextChannel;
        if(caller instanceof UserCaller) {
            let channel_ = caller.getRawMessage().channel;
            if(channel_ instanceof TextChannel) {
                channel = channel_;
            } else {
                return new SimpleCommandOutputError("Must be called from a guild text channel.");
            }
        } else {
            return new SimpleCommandOutputError("Must be called from discord.");
        }
        
        
        let p : Promise<CommandOutput> = new Promise<CommandOutput>((resolve,reject) => {
            InCharacterChannel.findOne(
                {
                    discordChannelId : channel.id
                },
                (err , icChannel) => {
                    if(!isNullOrUndefined(icChannel)){
                        if(icChannel.isICChannel) {
                            resolve(new CommandStringOutput("This channel is already an IC channel"))
                        } else {
                            icChannel.isICChannel = true;
                            icChannel.save();
                            resolve(new CommandStringOutput("Registered"))
                        }
                    } else {
                        
                        channel.createWebhook("IC Chat", "").then((wb : Webhook) => {
                            icChannel = new InCharacterChannel();
                            icChannel.discordChannelId = channel.id;
                            icChannel.isICChannel = true;
                            icChannel.webhookID = wb.id;
                            icChannel.webhookToken = wb.token;
                            icChannel.save();
                            resolve(new CommandStringOutput("Registered"))
                        });
                    }
                });
        });
            
        return p;
    }
    getRequiredPermission(): string {
        return "incharacterchate.registericchannel";
    }
    getShortHelpText(): string {
        return "Sets the channel this command is sent in to an In Character Channel."
    }
    getLongHelpText(): string {
        return "Sets the channel this command is sent in to an In Character Channel. registericchannel"
    }
}

class SetICName implements Command{
    getName(): string {
        return "seticname";
    }    
    async call(input: CommandObject[], scope: ScopeStack, caller: CommandCaller, bot : MonodroneBot): Promise<CommandOutput> {
        
        if(input.length != 1){
            return new SimpleCommandOutputError("Command requires 1 argument");
        }
        
        if(!input[0].hasStringValue()) {
            return new SimpleCommandOutputError("Argument 1 must have a string value");
        }

        let user : User;
        let guild : Guild;
        if(caller instanceof UserCaller) {
            user = caller.getRawMessage().author;
        } else {
            return new SimpleCommandOutputError("Must be called from discord.");
        }

        let characterName = input[0].getStringValue()!;
        let icName = new UserInCharacterName();
        icName.discordUserId = user.id;
        icName.name = characterName;
        icName.save();
        

        return new CommandStringOutput("Success");
    }
    getRequiredPermission(): string {
        return "incharacterchat.seticname";
    }
    getShortHelpText(): string {
        return "Sets you In Character Name."
    }
    getLongHelpText(): string {
        return "Sets you In Character Name. seticname <Name>"
    }
}