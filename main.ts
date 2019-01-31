import {MonodroneBot, Command, ScopeStack, CommandCaller, CommandOutput, CommandString, CommandStringOutput, CommandObject} from "./monodronebot";
import fs = require("fs");

let token = process.argv[2];
let bot =  new MonodroneBot(token);

import CoreModule from "./modules/core/module";
bot.registerModule(new CoreModule());

bot.login();


process.on("SIGINT", () : void => {
    console.log("Stopping");
    bot.stop();
});