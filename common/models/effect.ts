import * as mongoose from "mongoose"
import { ISpell } from "./spell";

export enum EffectTypeEnum {
    AbilityProficiency = "Ability Proficiency",
    AbilityAdvantage = "Ability Advantage",
    AbilityExpertise = "Ability Expertise",
    AbilityIncrease = "Ability Increase",
    PassiveBonus = "Passive Bonus",
    StatIncrease = "Stat Increase",
    StatMaxIncrease = "Stat Max Increase",
    StatMaxSet = "Stat Max Set",
    GrantVision = "Grant Vision",
    NonAbilityProficiency = "Non Ability Proficiency",
    Resistance = "Resistance",
    Immune = "Immune",
    Spellcasting = "Spellcasting"
}

export enum EffectAbilityEnum {
    Strength = "str",
    Dexterity = "dex",
    Constituation = "con",
    Inteligence = "int",
    Wisdom = "wis",
    Charisma = "cha",
    StrengthSaving = "strSave",
    DexteritySaving = "dexSave",
    ConstituationSaving = "conSave",
    InteligenceSaving = "intSave",
    WisdomSaving = "wisSave",
    CharismaSaving = "chaSave",
    Acrobatics = "acrobatics",
    AnimalHandling = "animalHandling",
    Arcana = "arcana",
    Athletics = "athletics",
    Deception = "deception",
    History = "history",
    Insight = "insight",
    Intimidation = "intimidation",
    Investigation = "investigation",
    Medicine = "medicine",
    Nature = "nature",
    Perception = "perception",
    Performance = "performance",
    Persuassion = "persuasion",
    Religion = "religion",
    SleightOfHand = "sleightOfHand",
    Stealth = "stealth",
    Survival = "survival",
    Initiative = "initiative",
    Melee = "melee",
    Ranged = "ranged",
    SpellAttack = "spellAttack",
    Bludgeoning = "bludgeoning",
    Piercing = "piercing",
    Slashing = "slashing",
    Fire = "fire",
    Cold = "cold",
    Poison = "poison",
    Acid = "acid",
    Psychic = "psychic",
    Necrotic = "necrotic",
    Lightning = "lightning",
    Thunder = "thunder",
    Force = "force",
    Walk = "walk",
    Fly = "fly",
    Swim = "swim",
    Burrow = "burrow",
    Climb = "climb",
    AllMovementMode = "allMove",
    ArmorClass = "ac",
    Disease = "disease",
    Frightened = "frightened",
    Petrified = "petrified",
    Darkvision = "darkvision",
    TrueSight = "trueSight",
    FeralSense = "feralSense",
    BlindVision = "blindVision"
}

export enum EffectProficiencyCatagory {
    Weapon = "weapon",
    Tool = "tool",
    Language = "language",
    Armour = "armour"
}

export enum EffectModifierEnum {
    Strength = "str",
    Dexterity = "dex",
    Constituation = "con",
    Inteligence = "int",
    Wisdom = "wis",
    Charisma = "cha",
}

let effectSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    type : {
        type : String,
        enum : Object.values(EffectTypeEnum),
        required : true
    },
    ability : {
        type : String,
        enum : Object.values(EffectAbilityEnum)
    },
    spells : [mongoose.Schema.Types.ObjectId],
    class : [String],
    bonus : mongoose.Schema.Types.Mixed,
    min : Number,
    conditionDescription : String,
    proficiencies : String,
    catagory : {
        type : String,
        enum : Object.values(EffectProficiencyCatagory)
    }
});

export interface IEffect extends mongoose.Document{
    name : String,
    type : EffectTypeEnum | String,
    ability? : EffectAbilityEnum | String,
    bonus? : Number | EffectModifierEnum | String,
    min? : Number,
    spells : mongoose.Schema.Types.ObjectId[] | ISpell[],
    class : [String],
    conditionDescription? : String,
    proficiencies : String;
    catagory : EffectProficiencyCatagory | String;
}

let Effect : mongoose.Model<IEffect> = mongoose.model<IEffect>('Effect', effectSchema);

export default Effect;