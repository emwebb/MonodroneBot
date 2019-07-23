"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var feature_1 = require("./feature");
var classSchema = new mongoose.Schema({
    name: String,
    features: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: feature_1.default.modelName
        }]
});
var PlayerClass = mongoose.model('Class', classSchema);
exports.default = PlayerClass;
