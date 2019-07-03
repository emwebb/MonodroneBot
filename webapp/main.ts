import * as express from "express"
import * as path from "path";
import {Strategy} from "passport-discord";
import * as passport from "passport"
import * as bodyParser from "body-parser";
import * as cors from "cors"
import * as session from "express-session";
import * as mongoose from "mongoose"
import User, {IUser} from "../common/models/user"
import { isBuffer } from "util";
import * as fs from "fs";


let configString : string = fs.readFileSync("config.json",{"encoding" : "utf8"});
let config = JSON.parse(configString);

let app = express();
app.set("view engine", "jade");
app.set("views", path.join(__dirname, "views"));
app.use(session({
    secret : config["sessionSecret"],
    cookie: {},
    resave: false,
    saveUninitialized: true,
}));



passport.use(new Strategy({
        clientID: config["clientID"],
        clientSecret: config["clientSecret"],
        callbackURL: config["callbackURL"],
        scope : ["identify"]
        
    },
    (accessToken, refeshToken , profile, done) => {
        User.findOne({
            auth0id : profile.id
        }, (err, user) => {
            if(err) {
                return done(err);
            }
            if(!user) {
                let user = new User({
                    discordUserId : profile.id
                });
                user.save((err) => {
                    return done(err, user);
                });

            } else {
                return done(err, user);
            }
        });
        done(null, profile);

    }));


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

app.get("/", (req, res) => {
    let data : any = {};
    if(req.user) {
        data["username"] = req.user.username;
    }
    res.render("index", data);
});

app.get("/auth/discord/", passport.authenticate("discord"));

app.get("/auth/discord/callback", passport.authenticate("discord", {
        failureRedirect : "/"
    }),(req, res) => {
        res.redirect("/");
    });

app.use("/static", express.static("static"));

app.listen(80)