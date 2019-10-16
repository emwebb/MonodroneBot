Main -> _ AS Comment {%
    function(data) {
        return { "dice" : data[1][0],
				"comment" : data[2][0] }
    }
%}
int -> [0-9]:+ {% function(d) {return parseInt(d[0].join(""))} %}
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
        return data === "number" ? data[0] : data
    }
%}

Bracket -> "(" _ AS _ ")" {%
    function(data) {
        return typeof data[2] === "number" ? data[2] : data[2][0]
    }
%}

Dice -> P _ "d" _ P _ Choose {%
    function(data) {
        return {
			type : "Role",
			roles : typeof data[0] === "number" ? data[0] : data[0][0],
			range : typeof data[4] === "number" ? data[4] : data[4][0],
			special : data[6][0]
		}
    }
%}
Add -> AS _ "-" _ D {%
    function(data) {
        return {
			type : "Subtract",
			left : typeof data[0] === "number" ? data[0] : data[0][0],
			right : typeof data[4] === "number" ? data[4] : data[4][0]
		}
    }
%}
Subtract -> AS _ "+" _ D {%
    function(data) {
        return {
			type : "Add",
			left : typeof data[0] === "number" ? data[0] : data[0][0],
			right : typeof data[4] === "number" ? data[4] : data[4][0]
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
ChooseHighest -> "ch" _ P {%
    function(data) {
        return {
			type : "ChooseHighest",
			number : typeof data[2] === "number" ? data[2] : data[2][0],
		}
    }
%}
ChooseLowest -> "cl" _ P {%
    function(data) {
        return {
			type : "ChooseLowest",
			number : typeof data[2] === "number" ? data[2] : data[2][0]
		}
    }
%}

Comment -> RealComment | null

RealComment -> " " [A-z\s0-9]:* {%
    function(data) {
        return data[1].join("");
    }
%}

_ -> [\s]:*     {% function(d) {return null } %}