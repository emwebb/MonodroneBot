"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var passport_discord_1 = require("passport-discord");
var passport = require("passport");
var bodyParser = require("body-parser");
var session = require("express-session");
var mongoose = require("mongoose");
var cookieParse = require("cookie-parser");
var user_1 = require("../common/models/user");
var fs = require("fs");
var character_1 = require("../common/models/character");
var api_1 = require("./api/api");
var authorize_1 = require("./authorize");
var configString = fs.readFileSync("config.json", { "encoding": "utf8" });
var config = JSON.parse(configString);
mongoose.connect("mongodb://localhost:27017/MonodroneBot", {
    useNewUrlParser: true,
    keepAlive: true,
    keepAliveInitialDelay: 300000
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
var app = express();
app.set("view engine", "jade");
app.set("views", path.join(__dirname, "views"));
//app.use(cors);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParse());
app.use(session({
    secret: config["sessionSecret"],
    cookie: {},
    resave: false,
    saveUninitialized: true,
}));
passport.use(new passport_discord_1.Strategy({
    clientID: config["clientID"],
    clientSecret: config["clientSecret"],
    callbackURL: config["callbackURL"],
    scope: ["identify"]
}, function (accessToken, refeshToken, profile, done) {
    user_1.default.findOne({
        discordUserId: profile.id
    }).then(function (user) {
        if (user == null) {
            var newUser = new user_1.default({
                discordUserId: profile.id,
                username: profile.username
            });
            newUser.save(function (err, value) {
                if (err) {
                    console.log(err);
                    return done(err);
                }
                return done(null, value);
            });
        }
        else {
            return done(null, user);
        }
    }).catch(function (err) {
        done(err);
    });
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});
app.use("/api", api_1.default);
app.use(function (req, res, next) {
    if (req.user) {
        res.locals["user"] = req.user;
    }
    next();
});
app.get("/", function (req, res) {
    var data = {};
    res.render("index");
});
app.get("/login/", function (req, res) {
    res.render("login");
});
app.get("/dmtools/", authorize_1.authorize(1, false), function (req, res) {
    res.render("dmTools");
});
app.get("/logout/", function (req, res) {
    req.logout();
    res.redirect("/");
});
app.get("/auth/discord/", passport.authenticate("discord"));
app.get("/auth/discord/callback", passport.authenticate("discord", {
    failureRedirect: "/"
}), function (req, res) {
    res.redirect("/");
});
app.get("/character/:characterId", function (req, res) {
    character_1.default.findById(req.params["characterId"])
        .populate("classes.class")
        .populate("classes.subClass")
        .populate("owner")
        .then(function (value) {
        if (!value) {
            res.render("404");
        }
        res.render("character", {
            character: value
        });
    }).catch(function (err) {
        console.error(err);
    });
});
app.use("/static", express.static("static"));
app.use("/uib", express.static("static/js/bower_components/bootstrap-ui"));
app.get("*", function (req, res) {
    res.render("404");
});
app.listen(80);
