"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var monodronebot_1 = require("./monodronebot");
var token = process.argv[2];
var bot = new monodronebot_1.MonodroneBot(token);
var module_1 = require("./modules/core/module");
bot.registerModule(new module_1.default());
bot.login();
process.on("SIGINT", function () {
    console.log("Stopping");
    bot.stop();
});
