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
    options : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Feature'
    }],
    optionMax : Number,
    effects : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : Effect.modelName
    }],
    display : {
        type : Boolean,
        required : true
    },
});

export interface IFeature extends mongoose.Document{
    name : String,
    displayName : String,
    levelUnlock? : Number,
    description : String,
    upgradeOf? : IFeature | mongoose.Schema.Types.ObjectId,
    options : IFeature[] | mongoose.Schema.Types.ObjectId[],
    optionMax? : Number,
    effects : IEffect[] | mongoose.Schema.Types.ObjectId[],
    display : Boolean
}

let Feature : mongoose.Model<IFeature> = mongoose.model<IFeature>('Feature', featureSchema);

export default Feature;