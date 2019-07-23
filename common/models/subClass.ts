import * as mongoose from "mongoose"
import Class, { IClass } from "./class"
import Feature, {IFeature} from "./feature"

let subClassSchema = new mongoose.Schema({
    name : String,
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : Class.modelName
    },
    features : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : Feature.modelName
    }]
});

export interface ISubClass extends mongoose.Document{
    name : String
    owner : IClass
    features : IFeature[]
}

let PlayerClass : mongoose.Model<ISubClass> = mongoose.model<ISubClass>('SubClass', subClassSchema);

export default PlayerClass;