namespace MonodroneBot {

    export enum EffectType {
        AbilityProficiency = "Ability Proficiency",
        AbilityAdvantage = "Ability Advantage",
        AbilityConditionalAdvantage = "Ability Conditional Advantage",
        AbilityExpertise = "Ability Expertise",
        PassiveBonus = "Passive Bonus",
        StatIncrease = "Stat Increase",
        StatMaxIncrease = "Stat Max Increase",
        GrantDarkvision = "Grant Darkvision"
    }

    export enum EffectAbility {
        Str = "str",
        Dex = "dex",
        Con = "con",
        Int = "int",
        Wis = "wis",
        Cha = "cha",
        StrSave = "strSave",
        DexSave = "dexSave",
        ConSave = "conSave",
        IntSave = "intSave",
        WisSave = "wisSave",
        ChaSave = "chaSave",
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
        Persuassion = "persuassion",
        Religion = "religion",
        SleightOfHand = "sleightOfHand",
        Stealth = "stealth",
        Survival = "survival",
        Initiative = "initiative"
    }

    export class Effect {
        _id : String;
        name : String;
        type : EffectType;
        ability? : EffectAbility;
        bonus? : Number;
        conditionDescription : String;
    }
} 