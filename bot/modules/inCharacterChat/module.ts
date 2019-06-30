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
            let inCharacterChannelCollection = bot.getDatabase().db("MonodroneBot").collection("InCharacterChannel");
            inCharacterChannelCollection.findOne({"channelId" : channelId}).then((value) => {
                if(value == null) {
                    return;
                }
                if(value.icChannel) {
                    message.delete()
                    let discordInCharacterNameCollection = bot.getDatabase().db("MonodroneBot").collection("DiscordInCharacterName");
                    discordInCharacterNameCollection.findOne({
                        "discordUserId" : message.author.id
                    }).then((inCharacterName) => {
                        if(inCharacterChannelCollection == null) {
                            message.author.sendMessage("You need to set your IC name in order to talk in this channel. Use the help command to find out how.");
                            return;
                        }
                        let channel = message.channel;
                        if(channel instanceof TextChannel) {
                            channel.fetchWebhooks().then((webhooks) => {
                                webhooks.get(value.wbId)!.sendMessage(message.content, {
                                    "username" : inCharacterName.discordInCharacterName
                                });
                            });
                        }
                    });
                    
                }
            },
            (reason) => {

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
        
        let inCharacterChannelCollection = bot.getDatabase().db("MonodroneBot").collection("InCharacterChannel");
        
        let p : Promise<CommandOutput> = new Promise<CommandOutput>((resolve,reject) => {
            let result = inCharacterChannelCollection.find(
                {
                    "channelId" : channel.id
                }
            )
            result.hasNext().then((hasNext : boolean) => {
                if(hasNext) {
                    result.next().then((value) => {
                        if(value["icChannel"]) {
                            resolve(new CommandStringOutput("This channel is already an IC channel"))
                        } else {
                            inCharacterChannelCollection.update({
                                "channelId" : channel.id
                            },
                            {
                                "$set" : {
                                    "icChannel" : true
                                }
                            })
                            resolve(new CommandStringOutput("Registered"))
                        
                        }
                    })
                } else {
                    channel.createWebhook("IC Chat", "").then((wb : Webhook) => {
                        inCharacterChannelCollection.insert({
                            "wbId" : wb.id,
                            "wbToken" : wb.token,
                            "icChannel" : true,
                            "channelId" : channel.id
                        }).then((value) => {
                            resolve(new CommandStringOutput("Registered"))
                        });

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
        let discordInCharacterNameCollection = bot.getDatabase().db("MonodroneBot").collection("DiscordInCharacterName");
        discordInCharacterNameCollection.updateOne({
            "discordUserId" : user.id
            },
            {
                "$set" : {
                    "discordUserId" : user.id,
                    "discordInCharacterName" : input[0].getStringValue()
                }
            },
            {
                "upsert" : true
            }
        );

        

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