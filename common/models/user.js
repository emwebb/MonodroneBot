"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var UserSchema = new mongoose.Schema({
    auth0id: { type: String, required: true, unique: true }
});
exports.default = mongoose.model('User', UserSchema);
