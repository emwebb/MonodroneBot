"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var feature_1 = require("./feature");
var requirementSchema = new mongoose.Schema({
    ability: {
        type: String,
        enum: [
            'str',
            'dex',
            'con',
            'int',
            'wis',
            'cha'
        ]
    },
    minimum: Number
});
var classSchema = new mongoose.Schema({
    name: String,
    displayName: String,
    requirements: [requirementSchema],
    requirementsAnd: Boolean,
    hitDie: Number,
    attacks: [Number],
    features: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: feature_1.default.modelName
        }],
    primaryFeatures: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: feature_1.default.modelName
        }],
    secondaryFeatures: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: feature_1.default.modelName
        }],
    cantrips: [Number],
    knownSpells: [Number]
});
var PlayerClass = mongoose.model('Class', classSchema);
exports.default = PlayerClass;
