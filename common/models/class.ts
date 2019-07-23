import * as mongoose from "mongoose"
import Feature, {IFeature} from "./feature"
let classSchema = new mongoose.Schema({
    name : String,
    features : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : Feature.modelName
    }]
});

export interface IClass extends mongoose.Document{
    name : String,
    featuires : IFeature[]

}

let PlayerClass : mongoose.Model<IClass> = mongoose.model<IClass>('Class', classSchema);

export default PlayerClass;