"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var monodronebot_1 = require("./monodronebot");
var fs = require("fs");
fs.readdir(".", function (err, files) {
    if (files.find(function (name) { return name == "restart.txt"; }) == undefined) {
        fs.writeFile("restart.txt", "Restart!", function (err) {
        });
    }
});
var token = process.argv[2];
var bot = new monodronebot_1.MonodroneBot(token);
var module_1 = require("./modules/core/module");
var module_2 = require("./modules/control/module");
var module_3 = require("./modules/characterConnection/module");
var module_4 = require("./modules/inCharacterChat/module");
var module_5 = require("./modules/dice/module");
bot.registerModule(new module_1.default());
bot.registerModule(new module_2.default());
bot.registerModule(new module_3.default());
bot.registerModule(new module_4.default());
bot.registerModule(new module_5.default());
bot.login();
