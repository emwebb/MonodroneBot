"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var userSchema = new mongoose.Schema({
    discordUserId: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        enum: [
            0,
            1,
            2,
            3
        ],
        default: 0,
        required: true
    },
    username: {
        type: String,
        required: true
    }
});
var User = mongoose.model('User', userSchema);
exports.default = User;
