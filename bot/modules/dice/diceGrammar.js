// Generated automatically by nearley, version 2.19.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "Main", "symbols": ["_", "AS", "Comment"], "postprocess": 
        function(data) {
            return { "dice" : data[1][0],
        				"comment" : data[2][0] }
        }
        },
    {"name": "int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "int", "symbols": ["int$ebnf$1"], "postprocess": function(d) {return parseInt(d[0].join(""))}},
    {"name": "AS", "symbols": ["Add"]},
    {"name": "AS", "symbols": ["Subtract"]},
    {"name": "AS", "symbols": ["D"], "postprocess": 
        function(data) {
            return data[0]
        }
        },
    {"name": "D", "symbols": ["Dice"]},
    {"name": "D", "symbols": ["P"], "postprocess": 
        function(data) {
            return data[0]
        }
        },
    {"name": "P", "symbols": ["Bracket"]},
    {"name": "P", "symbols": ["int"], "postprocess": 
        function(data) {
            return data === "number" ? data[0] : data
        }
        },
    {"name": "Bracket", "symbols": [{"literal":"("}, "_", "AS", "_", {"literal":")"}], "postprocess": 
        function(data) {
            return typeof data[2] === "number" ? data[2] : data[2][0]
        }
        },
    {"name": "Dice", "symbols": ["P", "_", {"literal":"d"}, "_", "P", "_", "Choose"], "postprocess": 
            function(data) {
                return {
        	type : "Role",
        	roles : typeof data[0] === "number" ? data[0] : data[0][0],
        	range : typeof data[4] === "number" ? data[4] : data[4][0],
        	special : data[6][0]
        }
            }
        },
    {"name": "Add", "symbols": ["AS", "_", {"literal":"-"}, "_", "D"], "postprocess": 
            function(data) {
                return {
        	type : "Subtract",
        	left : typeof data[0] === "number" ? data[0] : data[0][0],
        	right : typeof data[4] === "number" ? data[4] : data[4][0]
        }
            }
        },
    {"name": "Subtract", "symbols": ["AS", "_", {"literal":"+"}, "_", "D"], "postprocess": 
            function(data) {
                return {
        	type : "Add",
        	left : typeof data[0] === "number" ? data[0] : data[0][0],
        	right : typeof data[4] === "number" ? data[4] : data[4][0]
        }
            }
        },
    {"name": "Advantage$string$1", "symbols": [{"literal":"a"}, {"literal":"d"}, {"literal":"v"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Advantage", "symbols": ["Advantage$string$1"], "postprocess": 
            function(data) {
                return {
        	type : "Advantage",
        }
            }
        },
    {"name": "Disadvantage$string$1", "symbols": [{"literal":"d"}, {"literal":"i"}, {"literal":"s"}, {"literal":"a"}, {"literal":"d"}, {"literal":"v"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Disadvantage", "symbols": ["Disadvantage$string$1"], "postprocess": 
            function(data) {
                return {
        	type : "Disadvantage",
        }
            }
        },
    {"name": "Choose", "symbols": []},
    {"name": "Choose", "symbols": ["ChooseHighest"]},
    {"name": "Choose", "symbols": ["ChooseLowest"]},
    {"name": "Choose", "symbols": ["Advantage"]},
    {"name": "Choose", "symbols": ["Disadvantage"]},
    {"name": "ChooseHighest$string$1", "symbols": [{"literal":"c"}, {"literal":"h"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ChooseHighest", "symbols": ["ChooseHighest$string$1", "_", "P"], "postprocess": 
            function(data) {
                return {
        	type : "ChooseHighest",
        	number : typeof data[2] === "number" ? data[2] : data[2][0],
        }
            }
        },
    {"name": "ChooseLowest$string$1", "symbols": [{"literal":"c"}, {"literal":"l"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ChooseLowest", "symbols": ["ChooseLowest$string$1", "_", "P"], "postprocess": 
            function(data) {
                return {
        	type : "ChooseLowest",
        	number : typeof data[2] === "number" ? data[2] : data[2][0]
        }
            }
        },
    {"name": "Comment", "symbols": ["RealComment"]},
    {"name": "Comment", "symbols": []},
    {"name": "RealComment$ebnf$1", "symbols": []},
    {"name": "RealComment$ebnf$1", "symbols": ["RealComment$ebnf$1", /[A-z\s0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "RealComment", "symbols": [{"literal":" "}, "RealComment$ebnf$1"], "postprocess": 
        function(data) {
            return data[1].join("");
        }
        },
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null }}
]
  , ParserStart: "Main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
