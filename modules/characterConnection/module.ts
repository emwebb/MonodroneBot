import {Module, MonodroneBot, Command, CommandObject, ScopeStack, CommandCaller, CommandOutput, CommandStringOutput, SimpleCommandOutputError, UserCaller, SimpleCommandError} from "../../monodronebot"
import { User, Role, Guild } from "discord.js";
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


const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

interface ICharacterLink {
    characterID? : string;
    spreadsheetID? : string;
    userID? : string;
    alive? : boolean;
}

interface ICharacterLinkModel extends ICharacterLink, Document {
    characterID : string;
    spreadsheetID : string;
    userID : string;
    alive : boolean;
}

let CharacterLinkSchema : Schema = new Schema({
    characterID : String,
    spreadsheetID : String,
    userID : String,
    alive : Boolean
})

let CharacterLink : Model<ICharacterLinkModel> = model<ICharacterLinkModel>("CharacterLink", CharacterLinkSchema);

export default class CharacterConnectionModule implements Module {
    private bot! : MonodroneBot;
    private oAuth : OAuth2Client | undefined;
    getId(): string {
        return "characterConnection";
    }

    getName(): string {
        return "Character Connection";
    }

    register(bot: MonodroneBot): void {
        this.bot = bot;
        this.googleAuthorize(this.bot.getConfigLoader().get("googleAuth"),(oauth2: OAuth2Client) => {
            this.oAuth = oauth2;
        });
        bot.registerCommand(new LinkCharacterCommand(this));
    }

    deregister(): void {
        this.bot.deregisterCommand("linkcharacter");
    }

    configsSave(): void {
        if(this.oAuth != undefined) {
            this.bot.getConfigLoader().set("googleToken",this.oAuth.credentials);
        }
    }

    private googleAuthorize(credentials : any, callback : (oath : OAuth2Client) => (void)) {
        const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
        let token = this.bot.getConfigLoader().get("googleToken");
        if(token == undefined) {
            this.getNewToken(oAuth2Client, callback);
            return;
        }
        
        oAuth2Client.setCredentials(<Credentials>token);
        callback(oAuth2Client);
    }

    private getNewToken(oAuth2Client : OAuth2Client, callback : (oath : OAuth2Client) => (void)) {
        let authUrl = oAuth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
          rl.close();
          oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token!);
            callback(oAuth2Client);
          });
        });
      }

      public getOAuth() : OAuth2Client | undefined {
          return this.oAuth;
      }
    

}

class LinkCharacterCommand implements Command{
    private module : CharacterConnectionModule;
    constructor(module : CharacterConnectionModule) {
        this.module = module;
    }

    getName(): string {
        return "linkcharacter";
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
            guild = caller.getRawMessage().guild;
        } else {
            return new SimpleCommandOutputError("Argument 1 must have a string value");
        }

        let characterCode = input[0].getStringValue()!;

        let oAuth = this.module.getOAuth();

        if(oAuth == undefined) {
            return new SimpleCommandOutputError("No google authentication. Contact one of the Admins");
        }

        let sheets = google.sheets({version: 'v4', auth : oAuth});
        let p = new Promise<CommandOutput>((resolve, reject) => {
            sheets.spreadsheets.values.get({
                spreadsheetId: '1OFrpKUUEsH0I34dcj1gVXHeC89rwnkIhRf7H-G_X03g',
                range: 'Sheet1!A2:D'
                ,
                },(err, res) => {
                    if(err){
                        reject(err);
                    } else {
                        let values = res!.data.values!;
                        values.forEach((value: any[], index: number, array: any[][]) => {
                            if(value[0] == characterCode) {
                                let sheetID : string = value[1];
                                let alive : boolean = value[2];
                                if(!alive) {
                                    resolve(new SimpleCommandOutputError("Charatcer in question is Dead"));
                                    return;
                                }
                                sheets.spreadsheets.values.get({
                                    spreadsheetId: sheetID,
                                    range: 'Character Sheet!I1'
                                },(err, characterSheet) => {
                                    if(err){
                                        reject(err);
                                    } else {
                                        let characterName = characterSheet!.data.values![0][0];

                                        bot.getDatabase().db("MonodroneBot").collection("CharacterLink").insert({
                                            characterID : characterCode,
                                            spreadsheetID : sheetID,
                                            userID : user.id,
                                            alive : true
                                        },(err, values) => {
                                            console.log(err);
                                            console.log(values);
                                            if(err == undefined) {
                                                resolve(new CommandStringOutput('Your character ' + characterName + ' has been linked'));
                                            } else {
                                                resolve(new SimpleCommandOutputError(JSON.stringify(err)));
                                            }
                                        });

                                        
                                    }
                                });
                            }
                        });
                    }
              });
        });
        

        return p;
    }
    getRequiredPermission(): string {
        return "characterConnection.linkcharacter";
    }
    getShortHelpText(): string {
        return "Links your character sheet to your discord account."
    }
    getLongHelpText(): string {
        return "Links your character sheet to your discord account. linkcharacter <character-code>"
    }
}