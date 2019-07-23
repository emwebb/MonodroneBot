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
    options: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Feature'
        }],
    optionMax: Number,
    effects: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: effect_1.default.modelName
        }],
    display: {
        type: Boolean,
        required: true
    },
});
var Feature = mongoose.model('Feature', featureSchema);
exports.default = Feature;
