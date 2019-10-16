import {Module, MonodroneBot, Command, CommandObject, ScopeStack, CommandCaller, CommandOutput, CommandStringOutput, SimpleCommandOutputError, UserCaller, CommandError} from "../../monodronebot"
import { User, Role } from "discord.js";
import { setTimeout } from "timers";
import * as fs from "fs";
import * as nearley from 'nearley';
import { compute } from "googleapis/build/src/apis/compute";
import { isNullOrUndefined } from "util";
const grammar = require('./diceGrammar')

export default class DiceModule implements Module {
    private bot! : MonodroneBot;
    getId(): string {
        return "dice";
    }

    getName(): string {
        return "Dice";
    }

    register(bot: MonodroneBot): void {
        this.bot = bot;
        this.bot.registerCommand(new RollCommand());
        
    }

    deregister(): void {
        this.bot.deregisterCommand("role");
    }

    configsSave(): void {

    }

}

class RollCommand implements Command{

    getName(): string {
        return "roll";
    }    
    async call(input: CommandObject[], scope: ScopeStack, caller: CommandCaller, bot : MonodroneBot): Promise<CommandOutput> {
        let query = input.map((value) => {
            return value.getStringValue();
        }).join(" ");
        let parser = new nearley.Parser(nearley.Grammar.fromCompiled(<nearley.CompiledRules>(grammar.ParserRules)));
        let parseResult = parser.feed(query).results[0];
        let diceN = convert(parseResult["dice"]);
        let dice : DiceResult;
        if(typeof diceN == "number") {
            dice = <DiceResult>{
                mdResult : diceN.toString(),
                integerResult : diceN
            }
        } else {
            dice = diceN.compute();
        }
        let result : DiceParserResult = {
            comment : parseResult["comment"],
            dice : dice
        }
        return new CommandDiceOutput(result);
    }
    getRequiredPermission(): string {
        return "dice.roll";
    }
    getShortHelpText(): string {
        return "Roles a dice."
    }
    getLongHelpText(): string {
        return "Roles a dice."
    }
}

class RepeatedRollCommand implements Command{

    getName(): string {
        return "repeatedroll";
    }    
    async call(input: CommandObject[], scope: ScopeStack, caller: CommandCaller, bot : MonodroneBot): Promise<CommandOutput> {
        let query = input.map((value) => {
            return value.getStringValue();
        }).join(" ");
        let parser = new nearley.Parser(nearley.Grammar.fromCompiled(<nearley.CompiledRules>(grammar.ParserRules)));
        let parseResult = parser.feed(query).results[0];
        let diceN = convert(parseResult["dice"]);
        let dice : DiceResult;
        if(typeof diceN == "number") {
            dice = <DiceResult>{
                mdResult : diceN.toString(),
                integerResult : diceN
            }
        } else {
            dice = diceN.compute();
        }
        let result : DiceParserResult = {
            comment : parseResult["comment"],
            dice : dice
        }
        return new CommandDiceOutput(result);
    }
    getRequiredPermission(): string {
        return "dice.repeatedroll";
    }
    getShortHelpText(): string {
        return "Roles a dice."
    }
    getLongHelpText(): string {
        return "Roles a dice."
    }
}

class CommandDiceOutput implements CommandOutput {

    dice : DiceParserResult
    constructor (dice : DiceParserResult){
        this.dice = dice;
    }
    hadError(): boolean {
        return false;
    }    
    getError(): CommandError | undefined {
        return undefined;
    }
    hasNumberValue(): boolean {
        return true;
    }
    getNumberValue(): number | null {
        return this.dice.dice.integerResult;
    }
    hasStringValue(): boolean {
        return true;
    }
    getStringValue(): string | null {
        return this.dice.dice.mdResult;
    }
    getUserValue(): string {
        return this.dice.dice.mdResult + (this.dice.comment ? " " + this.dice.comment : "");
    }
    getValueType(): string {
        return "DiceParserResult";
    }
    getValue() {
        return this.dice;
    }


}

interface DiceParserResult {
    dice : DiceResult,
    comment : string
}

interface DiceResult {
    integerResult : number,
    mdResult : string
}

interface DiceParserResultPart {
    type : string,
    compute() : DiceResult
}

function convert(value : any) : DiceParserResultPart | number {
    if(typeof value === "number") {
        return value
    }
    switch(value["type"]) {
        case "Role" : 
            return new DiceParserResultPartDice(value);
            break;
        case "Add" :
        case "Subtract" : 
            return new DiceParserResultPartMaths(value);
            break;
        default :
            throw "Unknown type " + value["type"]
    }
}

class DiceParserResultChoose {

    type : string
    number? : DiceParserResultPart | number
    constructor(jsonValue : any) {
        this.type = jsonValue["type"];
        if(!isNullOrUndefined(jsonValue["number"])){
            this.number = convert(jsonValue["number"]);
        }
    }
}

class DiceParserResultPartDice implements DiceParserResultPart{
    type: string;
    roles : DiceParserResultPart | number
    range : DiceParserResultPart | number
    special? : DiceParserResultChoose
    constructor(jsonValue : any) {
        this.type = jsonValue["type"];
        this.roles = convert(jsonValue["roles"]);
        this.range = convert(jsonValue["range"]);
        if(!isNullOrUndefined(jsonValue["special"])){
            this.special = new DiceParserResultChoose(jsonValue["special"]);
        }
    }

    compute() : DiceResult {
        let rolesNumber : number;
        let rolesMd : string;
        if(typeof this.roles === "number") {
            rolesNumber = this.roles;
            rolesMd = this.roles.toString();
        } else {
            let roles = this.roles.compute();
            rolesNumber = roles.integerResult;
            rolesMd = roles.mdResult;
        }

        let rangeNumber : number;
        let rangeMd : string;
        if(typeof this.range === "number") {
            rangeNumber = this.range;
            rangeMd = this.range.toString();
        } else {
            let range = this.range.compute();
            rangeNumber = range.integerResult;
            rangeMd = range.mdResult;
        }

        if(isNullOrUndefined(this.special)) {
            let roleArray : number[] = Array.from({length : rolesNumber}, () => Math.ceil(Math.random() * rangeNumber));
            let mdValue = roleArray.map((value) => {
                if(value == 1 || value == rangeNumber ) {
                    return "**" + value + "**"
                } else {
                    return value.toString();
                }
            }).join();
            

            let integerValue = roleArray.reduce((pre , current) => {
                return pre + current;
            });

            mdValue = "(" + rolesMd + "d" + rangeMd + " : (" + mdValue + ") : `" + integerValue +"` )";
            return {
                mdResult : mdValue,
                integerResult : integerValue
            }
        } else {
            if(this.special.type == "ChooseHighest" || this.special.type == "ChooseLowest") {
                let roleArray : number[] = Array.from({length : rolesNumber}, () => Math.ceil(Math.random() * rangeNumber));
                let roleArraySorted = roleArray.map((value, index) => {
                    return {
                        value : value,
                        index : index
                    }
                }).sort((a, b) => (a.value - b.value) * ((this.special!.type == "ChooseLowest") ? 1 : -1));

                let specialInteger = this.special!.number!;
                let specialMd = specialInteger.toString();
                if(typeof specialInteger !== "number") {
                    let special = specialInteger.compute();
                    specialInteger = special.integerResult;
                    specialMd = special.mdResult;
                }

                let roleArrayUnsorted = roleArraySorted.map((value,index) => {
                    return {
                        index : value.index,
                        value : value.value,
                        kill : index >= specialInteger
                    }
                }).sort((a, b) => a.index - b.index);
                let mdValue = roleArrayUnsorted.map((value) => {
                    let md : string;
                    if(value.value == 1 || value.value == rangeNumber ) {
                        md = "**" + value.value + "**"
                    } else {
                        md = value.value.toString();
                    }

                    if(value.kill) {
                        return "~~" + md + "~~";
                    } else {
                        return md;
                    }
                }).join();
                let integerValue = roleArrayUnsorted.reduce((pre,cur) => {
                    if(!pre.kill){
                        if(!cur.kill) {
                            return {
                                kill : false,
                                index : 0,
                                value : pre.value + cur.value
                            };
                        } else {
                            return pre;
                        }
                    } else {
                        if(!cur.kill) {
                            return {
                                kill : false,
                                index : 0,
                                value : cur.value
                            };
                        } else {
                            return {
                                kill : false,
                                index : 0,
                                value : 0
                            };
                        }
                    }
                }).value;
                let chooseValue = (this.special!.type == "ChooseLowest") ? "cl" : "ch";
                mdValue = "(" + rolesMd + "d" + rangeMd + chooseValue + specialMd + " : (" + mdValue + ") : `" + integerValue +"` )";
                return {
                    mdResult : mdValue,
                    integerResult : integerValue
                }
            } else {
                let results = Array.from({length : 2}, () => {
                    let roleArray = Array.from({length : rolesNumber}, () => Math.ceil(Math.random() * rangeNumber));
                    let mdValue = "(" + roleArray.map((value) => {
                        if(value == 1 || value == rangeNumber ) {
                            return "**" + value + "**"
                        } else {
                            return value.toString();
                        }
                    }).join() + ")";
                    let integerValue = roleArray.reduce((pre , current) => {
                        return pre + current;
                    });
                    return {
                        mdvalue : mdValue,
                        integerValue : integerValue
                    }
                });
                let integerValue : number
                if((results[0].integerValue < results[1].integerValue) != (this.special!.type == "Disadvantage")) {
                    integerValue = results[1].integerValue;
                    results[0].mdvalue = "~~" + results[0].mdvalue + "~~";
                } else {
                    integerValue = results[0].integerValue;
                    results[1].mdvalue = "~~" + results[1].mdvalue + "~~";
                }
                let chooseValue = (this.special!.type == "Disadvantage") ? "disadv" : "adv";
                let mdValue = "(" + rolesMd + "d" + rangeMd + chooseValue + " : " + results[0].mdvalue + "," + results[1].mdvalue + " : `" + integerValue +"` )";
                return {
                    mdResult : mdValue,
                    integerResult : integerValue
                }
                
            }
        }
    }
}

class DiceParserResultPartMaths implements DiceParserResultPart{
    type: string;
    left : DiceParserResultPart | number
    right : DiceParserResultPart | number
    constructor(jsonValue : any) {
        this.type = jsonValue["type"];
        this.left = convert(jsonValue["left"]);
        this.right = convert(jsonValue["right"]);
    }

    compute() : DiceResult {
        let leftNumber : number;
        let leftMd : string;
        if(typeof this.left === "number") {
            leftNumber = this.left;
            leftMd = this.left.toString();
        } else {
            let left = this.left.compute();
            leftNumber = left.integerResult;
            leftMd = left.mdResult;
        }

        let rightNumber : number;
        let rightMd : string;
        if(typeof this.right === "number") {
            rightNumber = this.right;
            rightMd = this.right.toString();
        } else {
            let right = this.right.compute();
            rightNumber = right.integerResult;
            rightMd = right.mdResult;
        }
        if (this.type == "Add") {
            return {
                integerResult : leftNumber + rightNumber,
                mdResult : "(" + leftMd + " + " + rightMd + " : `" + (leftNumber + rightNumber) + "`)"
            }
        } else if (this.type == "Subtract") {
            return {
                integerResult : leftNumber - rightNumber,
                mdResult : "(" + leftMd + " - " + rightMd + " : `" + (leftNumber - rightNumber) + "`)"
            }
        } else {
            throw "Unknown type " + this.type;
        }
    }
}