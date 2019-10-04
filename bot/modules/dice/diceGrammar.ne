Main -> AS {%
    function(data) {
        return data[0]
    }
%}
int -> [0-9]:+ {%
    function(data) {
        return parseInt(data[0])
    }
%}
AS -> Add | Subtract | D {%
    function(data) {
        return data[0]
    }
%}

D -> Dice | P {%
    function(data) {
        return data[0]
    }
%}

P -> Bracket | int {%
    function(data) {
        return data[0]
    }
%}

Bracket -> "(" AS ")" {%
    function(data) {
        return data[1]
    }
%}

Dice -> P "d" P Choose {%
    function(data) {
        return {
			type : "Role",
			roles : data[0],
			range : data[2],
			special : data[3][0]
		}
    }
%}
Add -> AS "-" D {%
    function(data) {
        return {
			type : "Subtract",
			left : data[0],
			right : data[2]
		}
    }
%}
Subtract -> AS "+" D {%
    function(data) {
        return {
			type : "Add",
			left : data[0],
			right : data[2]
		}
    }
%}
Advantage -> "adv" {%
    function(data) {
        return {
			type : "Advantage",
		}
    }
%}
Disadvantage -> "disadv" {%
    function(data) {
        return {
			type : "Disadvantage",
		}
    }
%}
Choose -> null | ChooseHighest | ChooseLowest | Advantage | Disadvantage
ChooseHighest -> "ch" P {%
    function(data) {
        return {
			type : "ChooseHighest",
			number : data[1][0],
		}
    }
%}
ChooseLowest -> "cl" P {%
    function(data) {
        return {
			type : "ChooseLowest",
			number : data[1][0],
		}
    }
%}