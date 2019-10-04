import * as mongoose from "mongoose"
import Feature, {IFeature} from "./feature"

let requirementSchema = new mongoose.Schema({
    ability : {
        type : String,
        enum : [
            'str',
            'dex',
            'con',
            'int',
            'wis',
            'cha'
        ]
    },
    minimum : Number
});

export interface IRequirement {
    ability : String,
    minimum : Number
}

let classSchema = new mongoose.Schema({
    name : String,
    displayName : String,
    requirements : [requirementSchema],
    requirementsAnd : Boolean,
    hitDie : Number,
    attacks : [Number],
    features : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : Feature.modelName
    }],
    primaryFeatures : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : Feature.modelName
    }],
    secondaryFeatures : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : Feature.modelName
    }],
    cantrips : [Number],
    knownSpells : [Number]
});

export interface IClass extends mongoose.Document{
    name : String,
    displayName : String,
    requirements : IRequirement[],
    requirementsAnd : Boolean,
    hitDie : Number,
    attacks : Number[],
    features : IFeature[] | mongoose.Schema.Types.ObjectId[],
    primaryFeatures : IFeature[] | mongoose.Schema.Types.ObjectId[],
    secondaryFeatures : IFeature[] | mongoose.Schema.Types.ObjectId[];
    cantrips : Number[],
    knownSpells : Number[]
}

let PlayerClass : mongoose.Model<IClass> = mongoose.model<IClass>('Class', classSchema);

export default PlayerClass;