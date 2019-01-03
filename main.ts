import {MonodroneBot} from "./monodronebot";

let token = process.argv[2];
let bot =  new MonodroneBot(token);
bot.login();


process.on("SIGINT", () : void => {
    console.log("Stopping");
    bot.stop();
});