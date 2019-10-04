"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var inCharacterChannelSchema = new mongoose.Schema({
    discordChannelId: {
        type: String,
        required: true
    },
    isICChannel: {
        type: Boolean,
        required: true
    },
    webhookID: {
        type: String,
        required: true
    },
    webhookToken: {
        type: String,
        required: true
    }
});
var InCharacterChannel = mongoose.model('inCharacterChannel', inCharacterChannelSchema);
exports.default = InCharacterChannel;
