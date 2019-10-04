"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var class_1 = require("./class");
var spellSchema = new mongoose.Schema({
    castingTime: String,
    duration: String,
    materialComponents: [String],
    verbalComponent: Boolean,
    sematicComponent: Boolean,
    concentration: Boolean,
    name: String,
    description: String,
    classes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: class_1.default.modelName
        }],
    range: String,
    ritual: Boolean,
    school: String,
    level: Number,
    savingThrow: String
});
var Spell = mongoose.model('Spell', spellSchema);
exports.default = Spell;
