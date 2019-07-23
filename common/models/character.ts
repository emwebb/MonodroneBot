import * as mongoose from "mongoose"
import User, { IUser }  from "./user"
import Class, { IClass } from "./class"
import SubClass, { ISubClass } from "./subClass"
import FeatureChoice, { IFeatureChoice } from "./featureChoice"

let playerClassSchema = new mongoose.Schema({
    level : Number,
    class : {
        type : mongoose.Schema.Types.ObjectId,
        ref : Class.modelName
    },
    subClass : {
        type : mongoose.Schema.Types.ObjectId,
        ref : SubClass.modelName
    }
});

export interface IPlayerClass {
    class : IClass,
    subClass : ISubClass
}

let moneyWallet = new mongoose.Schema({
    pp : Number,
    gp : Number,
    ep : Number,
    sp : Number,
    cp : Number
})

export interface IMoneyWallet {
    pp : Number,
    gp : Number,
    ep : Number,
    sp : Number,
    cp : Number
}


let characterSchema = new mongoose.Schema({
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : User.modelName
    },
    name : String,
    alignment : {
        type : String,
        enum : [
            "LG", "NG", "CG",
            "LN", "NN", "CN",
            "LE", "NE", "CE"
        ],
        default : "NN"
    },
    experience : Number,
    str : Number,
    dex : Number,
    con : Number,
    int : Number,
    wis : Number,
    cha : Number,
    age : Number,
    classes : [playerClassSchema],
    featureChoices : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : FeatureChoice.modelName
    }],
    moneyOnPerson : moneyWallet,
    moneyInRoom : moneyWallet




});

export interface IPlayerClass extends mongoose.Document {
    level : Number,
    class : IClass,
    subClass : ISubClass
}

export interface ICharacter extends mongoose.Document {
    owner : IUser,
    name : String,
    alignment : String,
    experience : Number,
    str : Number,
    dex : Number,
    con : Number,
    int : Number,
    wis : Number,
    cha : Number,
    age : Number,
    classes : IPlayerClass[],
    featureChoice : IFeatureChoice[],
    moneyOnPerson : IMoneyWallet,
    moneyInRoom : IMoneyWallet

    
}

let Character : mongoose.Model<ICharacter> = mongoose.model<ICharacter>('Character', characterSchema);

export default Character;