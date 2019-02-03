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
bot.registerModule(new CoreModule());

bot.login();
