import * as express from "express"
import * as path from "path";
import {Strategy} from "passport-discord";
import * as passport from "passport"
import * as bodyParser from "body-parser";
import * as cors from "cors"
import * as session from "express-session";
import * as mongoose from "mongoose";
import * as cookieParse from "cookie-parser"
import User, {IUser} from "../common/models/user"
import { isBuffer } from "util";
import * as fs from "fs";
import { SlowBuffer } from "buffer";
import { userInfo } from "os";
import Character from "../common/models/character"
import API from "./api/api"
import { authorize } from "./authorize";
import * as https from "https";


let configString : string = fs.readFileSync("config.json",{"encoding" : "utf8"});
let config = JSON.parse(configString);




mongoose.connect("mongodb://localhost:27017/MonodroneBot", {
    useNewUrlParser : true,
    keepAlive: true,
    keepAliveInitialDelay: 300000
});

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));

let app = express();
app.set("view engine", "jade");
app.set("views", path.join(__dirname, "views"));

//app.use(cors);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParse());

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
            discordUserId : profile.id
        }).then((user) => {
            if(user == null) {
                let newUser = new User({
                    discordUserId : profile.id,
                    username : profile.username
                });

                newUser.save((err, value) => {
                    if(err) {
                        console.log(err);
                        return done(err);
                    }
                    return done(null, value);
                });
            } else {
                return done(null, user);
            }
        }).catch((err) => {
            done(err);
        });
    }));


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});
  
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.use("/api",API);

app.use((req, res, next) => {
    if(req.user) {
        res.locals["user"] = req.user;
    }
    next();
});

app.get("/", (req, res) => {
    let data : any = {};
    res.render("index");
});

app.get("/login/", (req, res) => {
    res.render("login")
});

app.get("/dmtools/", authorize(1,false), (req, res) => {
    res.render("dmTools")
});

app.get("/logout/", (req, res) => {
    req.logout();
    res.redirect("/");
});

app.get("/auth/discord/", passport.authenticate("discord"));

app.get("/auth/discord/callback", passport.authenticate("discord", {
        failureRedirect : "/"
    }),(req, res) => {
        res.redirect("/");
    });

app.get("/character/:characterId", (req, res) => {
    Character.findById(req.params["characterId"])
        .populate("classes.class")
        .populate("classes.subClass")
        .populate("owner")
        .then((value) => {
            if(!value) {
                res.render("404")
            }
            res.render("character",{
                character : value
            });
    }).catch((err) => {
        console.error(err);
    });
});



app.use("/static", express.static("static"));
app.use("/uib",express.static("static/js/bower_components/bootstrap-ui"));
app.get("*", (req, res) => {
    res.render("404");
});


if(config['cert']) {
    const privateKey = fs.readFileSync(config['cert']['privateKey'], 'utf8');
    const certificate = fs.readFileSync(config['cert']['certificate'], 'utf8');
    const ca = fs.readFileSync(config['cert']['ca'], 'utf8');
    
    
    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    };
    let server = https.createServer(credentials, app);
    server.listen(443, () => {
        console.log("Server running on port 443!")
    });

} else {
    app.listen(80,() => {
        console.log("Server running on port 80! DANGEROUS!")
    });
}

