import * as mongoose from "mongoose"
import Effect, { IEffect } from "./effect"

let featureSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    displayName : {
        type : String,
        required : true
    },
    levelUnlock : Number,
    description : {
        type : String,
        required : true
    },
    upgradeOf : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Feature'
    },
    optionTitle : String,
    options : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Feature'
    }],
    optionMax : mongoose.Schema.Types.Mixed,
    effects : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : Effect.modelName
    }],
    effectsAtLevel : [[{
        type : mongoose.Schema.Types.ObjectId,
        ref : Effect.modelName
    }]],
    display : {
        type : Boolean,
        required : true
    },
    usage : mongoose.Schema.Types.Mixed,
    recovery : mongoose.Schema.Types.Mixed,
    action : String
});

export interface IFeature extends mongoose.Document{
    name : String,
    displayName : String,
    levelUnlock? : Number,
    description : String,
    upgradeOf? : IFeature | mongoose.Schema.Types.ObjectId,
    optionTitle? : String,
    options : IFeature[] | mongoose.Schema.Types.ObjectId[],
    optionMax? : Number | Number[],
    effects : IEffect[] | mongoose.Schema.Types.ObjectId[],
    effectsAtLevel : IEffect[][] | mongoose.Schema.Types.ObjectId[][],
    display : Boolean,
    usage? : Number[] | Number | String,
    recovery? : String[] | String,
    action? : String;
}

let Feature : mongoose.Model<IFeature> = mongoose.model<IFeature>('Feature', featureSchema);

export default Feature;