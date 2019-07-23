var MonodroneBot;
(function (MonodroneBot) {
    var EffectType;
    (function (EffectType) {
        EffectType["AbilityProficiency"] = "Ability Proficiency";
        EffectType["AbilityAdvantage"] = "Ability Advantage";
        EffectType["AbilityConditionalAdvantage"] = "Ability Conditional Advantage";
        EffectType["AbilityExpertise"] = "Ability Expertise";
        EffectType["PassiveBonus"] = "Passive Bonus";
        EffectType["StatIncrease"] = "Stat Increase";
        EffectType["StatMaxIncrease"] = "Stat Max Increase";
        EffectType["GrantDarkvision"] = "Grant Darkvision";
    })(EffectType = MonodroneBot.EffectType || (MonodroneBot.EffectType = {}));
    var EffectAbility;
    (function (EffectAbility) {
        EffectAbility["Str"] = "str";
        EffectAbility["Dex"] = "dex";
        EffectAbility["Con"] = "con";
        EffectAbility["Int"] = "int";
        EffectAbility["Wis"] = "wis";
        EffectAbility["Cha"] = "cha";
        EffectAbility["StrSave"] = "strSave";
        EffectAbility["DexSave"] = "dexSave";
        EffectAbility["ConSave"] = "conSave";
        EffectAbility["IntSave"] = "intSave";
        EffectAbility["WisSave"] = "wisSave";
        EffectAbility["ChaSave"] = "chaSave";
        EffectAbility["Acrobatics"] = "acrobatics";
        EffectAbility["AnimalHandling"] = "animalHandling";
        EffectAbility["Arcana"] = "arcana";
        EffectAbility["Athletics"] = "athletics";
        EffectAbility["Deception"] = "deception";
        EffectAbility["History"] = "history";
        EffectAbility["Insight"] = "insight";
        EffectAbility["Intimidation"] = "intimidation";
        EffectAbility["Investigation"] = "investigation";
        EffectAbility["Medicine"] = "medicine";
        EffectAbility["Nature"] = "nature";
        EffectAbility["Perception"] = "perception";
        EffectAbility["Performance"] = "performance";
        EffectAbility["Persuassion"] = "persuassion";
        EffectAbility["Religion"] = "religion";
        EffectAbility["SleightOfHand"] = "sleightOfHand";
        EffectAbility["Stealth"] = "stealth";
        EffectAbility["Survival"] = "survival";
        EffectAbility["Initiative"] = "initiative";
    })(EffectAbility = MonodroneBot.EffectAbility || (MonodroneBot.EffectAbility = {}));
    var Effect = /** @class */ (function () {
        function Effect() {
        }
        return Effect;
    }());
    MonodroneBot.Effect = Effect;
})(MonodroneBot || (MonodroneBot = {}));
