"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var userInCharacterNameSchema = new mongoose.Schema({
    discordUserId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});
var UserInCharacterName = mongoose.model('userInCharacterName', userInCharacterNameSchema);
exports.default = UserInCharacterName;
