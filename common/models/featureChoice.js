"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var feature_1 = require("./feature");
var featureChoiceSchema = new mongoose.Schema({
    chosen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: feature_1.default.modelName
    },
    for: {
        type: mongoose.Schema.Types.ObjectId,
        ref: feature_1.default.modelName
    },
    subChoices: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FeatureChoice'
        }]
});
var FeatureChoice = mongoose.model('FeatureChoice', featureChoiceSchema);
exports.default = FeatureChoice;
