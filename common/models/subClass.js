"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var class_1 = require("./class");
var feature_1 = require("./feature");
var subClassSchema = new mongoose.Schema({
    name: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: class_1.default.modelName
    },
    features: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: feature_1.default.modelName
        }]
});
var PlayerClass = mongoose.model('SubClass', subClassSchema);
exports.default = PlayerClass;
