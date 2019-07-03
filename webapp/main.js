"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var passport_discord_1 = require("passport-discord");
var passport = require("passport");
var session = require("express-session");
var user_1 = require("../common/models/user");
var fs = require("fs");
var configString = fs.readFileSync("config.json", { "encoding": "utf8" });
var config = JSON.parse(configString);
var app = express();
app.set("view engine", "jade");
app.set("views", path.join(__dirname, "views"));
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
        auth0id: profile.id
    }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            var user_2 = new user_1.default({
                discordUserId: profile.id
            });
            user_2.save(function (err) {
                return done(err, user_2);
            });
        }
        else {
            return done(err, user);
        }
    });
    done(null, profile);
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});
app.get("/", function (req, res) {
    var data = {};
    if (req.user) {
        data["username"] = req.user.username;
    }
    res.render("index", data);
});
app.get("/auth/discord/", passport.authenticate("discord"));
app.get("/auth/discord/callback", passport.authenticate("discord", {
    failureRedirect: "/"
}), function (req, res) {
    res.redirect("/");
});
app.use("/static", express.static("static"));
app.listen(80);
