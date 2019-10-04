"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var EffectTypeEnum;
(function (EffectTypeEnum) {
    EffectTypeEnum["AbilityProficiency"] = "Ability Proficiency";
    EffectTypeEnum["AbilityAdvantage"] = "Ability Advantage";
    EffectTypeEnum["AbilityExpertise"] = "Ability Expertise";
    EffectTypeEnum["AbilityIncrease"] = "Ability Increase";
    EffectTypeEnum["PassiveBonus"] = "Passive Bonus";
    EffectTypeEnum["StatIncrease"] = "Stat Increase";
    EffectTypeEnum["StatMaxIncrease"] = "Stat Max Increase";
    EffectTypeEnum["StatMaxSet"] = "Stat Max Set";
    EffectTypeEnum["GrantVision"] = "Grant Vision";
    EffectTypeEnum["NonAbilityProficiency"] = "Non Ability Proficiency";
    EffectTypeEnum["Resistance"] = "Resistance";
    EffectTypeEnum["Immune"] = "Immune";
    EffectTypeEnum["Spellcasting"] = "Spellcasting";
})(EffectTypeEnum = exports.EffectTypeEnum || (exports.EffectTypeEnum = {}));
var EffectAbilityEnum;
(function (EffectAbilityEnum) {
    EffectAbilityEnum["Strength"] = "str";
    EffectAbilityEnum["Dexterity"] = "dex";
    EffectAbilityEnum["Constituation"] = "con";
    EffectAbilityEnum["Inteligence"] = "int";
    EffectAbilityEnum["Wisdom"] = "wis";
    EffectAbilityEnum["Charisma"] = "cha";
    EffectAbilityEnum["StrengthSaving"] = "strSave";
    EffectAbilityEnum["DexteritySaving"] = "dexSave";
    EffectAbilityEnum["ConstituationSaving"] = "conSave";
    EffectAbilityEnum["InteligenceSaving"] = "intSave";
    EffectAbilityEnum["WisdomSaving"] = "wisSave";
    EffectAbilityEnum["CharismaSaving"] = "chaSave";
    EffectAbilityEnum["Acrobatics"] = "acrobatics";
    EffectAbilityEnum["AnimalHandling"] = "animalHandling";
    EffectAbilityEnum["Arcana"] = "arcana";
    EffectAbilityEnum["Athletics"] = "athletics";
    EffectAbilityEnum["Deception"] = "deception";
    EffectAbilityEnum["History"] = "history";
    EffectAbilityEnum["Insight"] = "insight";
    EffectAbilityEnum["Intimidation"] = "intimidation";
    EffectAbilityEnum["Investigation"] = "investigation";
    EffectAbilityEnum["Medicine"] = "medicine";
    EffectAbilityEnum["Nature"] = "nature";
    EffectAbilityEnum["Perception"] = "perception";
    EffectAbilityEnum["Performance"] = "performance";
    EffectAbilityEnum["Persuassion"] = "persuasion";
    EffectAbilityEnum["Religion"] = "religion";
    EffectAbilityEnum["SleightOfHand"] = "sleightOfHand";
    EffectAbilityEnum["Stealth"] = "stealth";
    EffectAbilityEnum["Survival"] = "survival";
    EffectAbilityEnum["Initiative"] = "initiative";
    EffectAbilityEnum["Melee"] = "melee";
    EffectAbilityEnum["Ranged"] = "ranged";
    EffectAbilityEnum["SpellAttack"] = "spellAttack";
    EffectAbilityEnum["Bludgeoning"] = "bludgeoning";
    EffectAbilityEnum["Piercing"] = "piercing";
    EffectAbilityEnum["Slashing"] = "slashing";
    EffectAbilityEnum["Fire"] = "fire";
    EffectAbilityEnum["Cold"] = "cold";
    EffectAbilityEnum["Poison"] = "poison";
    EffectAbilityEnum["Acid"] = "acid";
    EffectAbilityEnum["Psychic"] = "psychic";
    EffectAbilityEnum["Necrotic"] = "necrotic";
    EffectAbilityEnum["Lightning"] = "lightning";
    EffectAbilityEnum["Thunder"] = "thunder";
    EffectAbilityEnum["Force"] = "force";
    EffectAbilityEnum["Walk"] = "walk";
    EffectAbilityEnum["Fly"] = "fly";
    EffectAbilityEnum["Swim"] = "swim";
    EffectAbilityEnum["Burrow"] = "burrow";
    EffectAbilityEnum["Climb"] = "climb";
    EffectAbilityEnum["AllMovementMode"] = "allMove";
    EffectAbilityEnum["ArmorClass"] = "ac";
    EffectAbilityEnum["Disease"] = "disease";
    EffectAbilityEnum["Frightened"] = "frightened";
    EffectAbilityEnum["Petrified"] = "petrified";
    EffectAbilityEnum["Darkvision"] = "darkvision";
    EffectAbilityEnum["TrueSight"] = "trueSight";
    EffectAbilityEnum["FeralSense"] = "feralSense";
    EffectAbilityEnum["BlindVision"] = "blindVision";
})(EffectAbilityEnum = exports.EffectAbilityEnum || (exports.EffectAbilityEnum = {}));
var EffectProficiencyCatagory;
(function (EffectProficiencyCatagory) {
    EffectProficiencyCatagory["Weapon"] = "weapon";
    EffectProficiencyCatagory["Tool"] = "tool";
    EffectProficiencyCatagory["Language"] = "language";
    EffectProficiencyCatagory["Armour"] = "armour";
})(EffectProficiencyCatagory = exports.EffectProficiencyCatagory || (exports.EffectProficiencyCatagory = {}));
var EffectModifierEnum;
(function (EffectModifierEnum) {
    EffectModifierEnum["Strength"] = "str";
    EffectModifierEnum["Dexterity"] = "dex";
    EffectModifierEnum["Constituation"] = "con";
    EffectModifierEnum["Inteligence"] = "int";
    EffectModifierEnum["Wisdom"] = "wis";
    EffectModifierEnum["Charisma"] = "cha";
})(EffectModifierEnum = exports.EffectModifierEnum || (exports.EffectModifierEnum = {}));
var effectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: Object.values(EffectTypeEnum),
        required: true
    },
    ability: {
        type: String,
        enum: Object.values(EffectAbilityEnum)
    },
    spells: [mongoose.Schema.Types.ObjectId],
    class: [String],
    bonus: mongoose.Schema.Types.Mixed,
    min: Number,
    conditionDescription: String,
    proficiencies: String,
    catagory: {
        type: String,
        enum: Object.values(EffectProficiencyCatagory)
    }
});
var Effect = mongoose.model('Effect', effectSchema);
exports.default = Effect;
