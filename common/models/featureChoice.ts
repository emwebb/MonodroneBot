import * as mongoose from "mongoose"
import Feature, {IFeature} from "./feature"
let featureChoiceSchema = new mongoose.Schema({
    chosen : {
        type : mongoose.Schema.Types.ObjectId,
        ref : Feature.modelName
    },
    for : {
        type : mongoose.Schema.Types.ObjectId,
        ref : Feature.modelName
    },
    subChoices : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'FeatureChoice'
    }]
});

export interface IFeatureChoice extends mongoose.Document{
    chosen : IFeature,
    for : IFeature,
    subChoices : IFeatureChoice[]
}

let FeatureChoice : mongoose.Model<IFeatureChoice> = mongoose.model<IFeatureChoice>('FeatureChoice', featureChoiceSchema);

export default FeatureChoice;