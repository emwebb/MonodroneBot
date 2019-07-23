"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var user_1 = require("./user");
var class_1 = require("./class");
var subClass_1 = require("./subClass");
var featureChoice_1 = require("./featureChoice");
var playerClassSchema = new mongoose.Schema({
    level: Number,
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: class_1.default.modelName
    },
    subClass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: subClass_1.default.modelName
    }
});
var moneyWallet = new mongoose.Schema({
    pp: Number,
    gp: Number,
    ep: Number,
    sp: Number,
    cp: Number
});
var characterSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user_1.default.modelName
    },
    name: String,
    alignment: {
        type: String,
        enum: [
            "LG", "NG", "CG",
            "LN", "NN", "CN",
            "LE", "NE", "CE"
        ],
        default: "NN"
    },
    experience: Number,
    str: Number,
    dex: Number,
    con: Number,
    int: Number,
    wis: Number,
    cha: Number,
    age: Number,
    classes: [playerClassSchema],
    featureChoices: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: featureChoice_1.default.modelName
        }],
    moneyOnPerson: moneyWallet,
    moneyInRoom: moneyWallet
});
var Character = mongoose.model('Character', characterSchema);
exports.default = Character;
