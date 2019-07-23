namespace MonodroneBot {
    export class Feature {
        _id : String;
        name : String;
        displayName : String;
        levelUnlock? : Number;
        description : String;
        upgradeOf? : String;
        options : String[];
        optionMax? : Number;
        effects : String[];
        display : Boolean;
    }
} 