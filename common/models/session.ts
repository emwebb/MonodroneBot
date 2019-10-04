import * as mongoose from "mongoose"
import  Character , {ICharacter} from "./character"

let sessionSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    date : {
        type : mongoose.Schema.Types.Date,
        required : true
    },
    players : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : Character.modelName
    }]
});

export interface ISession extends mongoose.Document{
    name : String,
    description : Number,
    date : Date,
    players : ICharacter[]
}

let User : mongoose.Model<ISession> = mongoose.model<ISession>('Session', sessionSchema);

export default User;