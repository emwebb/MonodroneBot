import * as mongoose from "mongoose"

let inCharacterChannelSchema = new mongoose.Schema({
    discordChannelId : {
        type : String,
        required : true
    },
    isICChannel : {
        type : Boolean,
        required : true
    },
    webhookID : {
        type : String,
        required : true
    },
    webhookToken : {
        type : String,
        required : true
    }
});

export interface IInCharacterChannel extends mongoose.Document{
    discordChannelId : String,
    isICChannel : Boolean,
    webhookID : String,
    webhookToken : String
}

let InCharacterChannel : mongoose.Model<IInCharacterChannel> = mongoose.model<IInCharacterChannel>('inCharacterChannel', inCharacterChannelSchema);

export default InCharacterChannel;