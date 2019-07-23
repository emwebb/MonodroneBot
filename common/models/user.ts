import * as mongoose from "mongoose"

let userSchema = new mongoose.Schema({
    discordUserId : {
        type : String,
        required : true
    },
    role : {
        type : Number,
        enum : [
            0,
            1,
            2,
            3
        ],
        default : 0,
        required : true
    },
    username : {
        type : String,
        required : true
    }
});

export interface IUser extends mongoose.Document{
    discordUserId : String,
    role : Number,
    username : String
}

let User : mongoose.Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;