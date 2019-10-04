import * as mongoose from "mongoose"
import Class, {IClass} from "./class"
let spellSchema = new mongoose.Schema({
    castingTime : String,
    duration : String,
    materialComponents : [String],
    verbalComponent : Boolean,
    sematicComponent : Boolean,
    concentration : Boolean,
    name : String,
    description : String,
    classes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : Class.modelName
    }],
    range : String,
    ritual : Boolean,
    school : String,
    level : Number,
    savingThrow : String
});

export interface ISpell extends mongoose.Document{
    castingTime : String,
    duration : String,
    materialComponents : String[],
    verbalComponent : Boolean,
    sematicComponent : Boolean,
    concentration : Boolean,
    name : String,
    displayName : String,
    description : String,
    classes : IClass[] | mongoose.Schema.Types.ObjectId[],
    range : String,
    ritual : Boolean,
    school : String,
    level : Number,
    savingThrow : String
}

let Spell : mongoose.Model<ISpell> = mongoose.model<ISpell>('Spell', spellSchema);

export default Spell;