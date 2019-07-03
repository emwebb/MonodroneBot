import * as mongoose from "mongoose"

export interface IUser extends mongoose.Document{
    auth0id : string
}

const UserSchema : mongoose.Schema = new mongoose.Schema({
    auth0id : {type : String, required : true, unique : true}
});

export default mongoose.model('User',UserSchema);