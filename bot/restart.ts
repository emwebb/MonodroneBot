import { spawn, ChildProcess } from "child_process";
import * as fs from "fs";


function setUpBot() {
    let bot : ChildProcess = spawn("node", ["./main.js"]);

    bot.stdout.on('data', (chunk: Buffer) => {
        console.log(chunk.toString());
    });
    
    bot.stderr.on('data', (chunk: Buffer) => {
        console.log(chunk.toString());
    });
    
    bot.on('exit', (code: number, signal: string) => {
        fs.readdir(".", (err : NodeJS.ErrnoException, files: string[]) => {
            if(files.find(name => name == "restart.txt") != undefined){
                setUpBot();
            }
        });
    });
}

setUpBot();