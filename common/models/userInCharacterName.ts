import * as mongoose from "mongoose"

let userInCharacterNameSchema = new mongoose.Schema({
    discordUserId : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    }
});

export interface IUserInCharacterName extends mongoose.Document{
    discordUserId : String,
    name : String
}

let UserInCharacterName : mongoose.Model<IUserInCharacterName> = mongoose.model<IUserInCharacterName>('userInCharacterName', userInCharacterNameSchema);

export default UserInCharacterName;