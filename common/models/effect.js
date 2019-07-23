"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var effectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: [
            "Ability Proficiency",
            "Ability Advantage",
            "Ability Conditional Advantage",
            "Ability Expertise",
            "Passive Bonus",
            "Stat Increase",
            "Stat Max Increase",
            "Grant Darkvision"
        ],
        required: true
    },
    ability: {
        type: String,
        enum: [
            "str",
            "dex",
            "con",
            "int",
            "wis",
            "cha",
            "strSave",
            "dexSave",
            "conSave",
            "intSave",
            "wisSave",
            "chaSave",
            "acrobatics",
            "animalHandling",
            "arcana",
            "athletics",
            "deception",
            "history",
            "insight",
            "intimidation",
            "investigation",
            "medicine",
            "nature",
            "perception",
            "performance",
            "persuassion",
            "religion",
            "sleightOfHand",
            "stealth",
            "survival",
            "initiative"
        ]
    },
    bonus: Number,
    conditionDescription: String
});
var Effect = mongoose.model('Effect', effectSchema);
exports.default = Effect;
