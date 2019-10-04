"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var effect_1 = require("./effect");
var featureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    levelUnlock: Number,
    description: {
        type: String,
        required: true
    },
    upgradeOf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feature'
    },
    optionTitle: String,
    options: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Feature'
        }],
    optionMax: mongoose.Schema.Types.Mixed,
    effects: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: effect_1.default.modelName
        }],
    effectsAtLevel: [[{
                type: mongoose.Schema.Types.ObjectId,
                ref: effect_1.default.modelName
            }]],
    display: {
        type: Boolean,
        required: true
    },
    usage: mongoose.Schema.Types.Mixed,
    recovery: mongoose.Schema.Types.Mixed,
    action: String
});
var Feature = mongoose.model('Feature', featureSchema);
exports.default = Feature;
