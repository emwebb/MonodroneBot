"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var fs = require("fs");
function setUpBot() {
    var bot = child_process_1.spawn("node", ["./main.js"]);
    bot.stdout.on('data', function (chunk) {
        console.log(chunk.toString());
    });
    bot.stderr.on('data', function (chunk) {
        console.log(chunk.toString());
    });
    bot.on('exit', function (code, signal) {
        fs.readdir(".", function (err, files) {
            if (files.find(function (name) { return name == "restart.txt"; }) != undefined) {
                setUpBot();
            }
        });
    });
}
setUpBot();
