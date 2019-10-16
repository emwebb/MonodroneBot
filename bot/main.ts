import {MonodroneBot, Command, ScopeStack, CommandCaller, CommandOutput, CommandString, CommandStringOutput, CommandObject} from "./monodronebot";
import fs = require("fs");

fs.readdir(".", (err : NodeJS.ErrnoException, files: string[]) => {
    if(files.find(name => name == "restart.txt") == undefined){
        fs.writeFile("restart.txt","Restart!",(err : NodeJS.ErrnoException) => {
            
        });
    }
});

let token = process.argv[2];
let bot =  new MonodroneBot(token);

import CoreModule from "./modules/core/module";
import ControlModule from "./modules/control/module";
import CharacterConnectionModule from "./modules/characterConnection/module";
import InCharacterChat from "./modules/inCharacterChat/module"
import DiceModule from "./modules/dice/module"
bot.registerModule(new CoreModule());
bot.registerModule(new ControlModule());
bot.registerModule(new CharacterConnectionModule());
bot.registerModule(new InCharacterChat());
bot.registerModule(new DiceModule());

bot.login();
