"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var monodronebot_1 = require("../../monodronebot");
var commandinterpreter_1 = require("../../commandinterpreter");
var ControlModule = /** @class */ (function () {
    function ControlModule() {
    }
    ControlModule.prototype.getId = function () {
        return "control";
    };
    ControlModule.prototype.getName = function () {
        return "Control";
    };
    ControlModule.prototype.register = function (bot) {
        this.bot = bot;
        this.bot.registerCommand(new PrintCommand());
        this.bot.registerCommand(new EchoCommand());
        this.bot.registerCommand(new SetCommand());
        this.bot.registerCommand(new IterateCommand());
    };
    ControlModule.prototype.deregister = function () {
        this.bot.deregisterCommand("print");
        this.bot.deregisterCommand("echo");
        this.bot.deregisterCommand("set");
        this.bot.deregisterCommand("iterate");
    };
    ControlModule.prototype.configsSave = function () {
    };
    return ControlModule;
}());
exports.default = ControlModule;
var EchoCommand = /** @class */ (function () {
    function EchoCommand() {
    }
    EchoCommand.prototype.getName = function () {
        return "echo";
    };
    EchoCommand.prototype.call = function (input, scope, caller, bot) {
        return __awaiter(this, void 0, void 0, function () {
            var echo;
            return __generator(this, function (_a) {
                echo = "";
                input.forEach(function (element) {
                    echo += element.getUserValue() + "\n";
                });
                return [2 /*return*/, new monodronebot_1.CommandStringOutput(echo)];
            });
        });
    };
    EchoCommand.prototype.getRequiredPermission = function () {
        return "control.echo";
    };
    EchoCommand.prototype.getShortHelpText = function () {
        return "Echos input.";
    };
    EchoCommand.prototype.getLongHelpText = function () {
        return "Returns the user value for each item in the arguments.";
    };
    return EchoCommand;
}());
var PrintCommand = /** @class */ (function () {
    function PrintCommand() {
    }
    PrintCommand.prototype.getName = function () {
        return "print";
    };
    PrintCommand.prototype.call = function (input, scope, caller, bot) {
        return __awaiter(this, void 0, void 0, function () {
            var print;
            return __generator(this, function (_a) {
                print = "";
                input.forEach(function (element) {
                    print += element.getUserValue() + "\n";
                });
                caller.message(print);
                return [2 /*return*/, new monodronebot_1.CommandStringOutput("Printed")];
            });
        });
    };
    PrintCommand.prototype.getRequiredPermission = function () {
        return "control.print";
    };
    PrintCommand.prototype.getShortHelpText = function () {
        return "Prints input.";
    };
    PrintCommand.prototype.getLongHelpText = function () {
        return "Prints the inputted arguments directly to the channel rather than simply returning them.";
    };
    return PrintCommand;
}());
var IterateCommand = /** @class */ (function () {
    function IterateCommand() {
    }
    IterateCommand.prototype.getName = function () {
        return "iterate";
    };
    IterateCommand.prototype.call = function (input, scope, caller, bot) {
        return __awaiter(this, void 0, void 0, function () {
            var iterator, values, index, element, _a, _b, output;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(input.length < 2)) return [3 /*break*/, 1];
                        return [2 /*return*/, new monodronebot_1.SimpleCommandOutputError("Iterate requires atleast 2 arguments")];
                    case 1:
                        iterator = void 0;
                        if (input[0].getValueType() == "Array") {
                            iterator = input[0].getValue();
                        }
                        else if (input[0].getValueType() == "number") {
                            iterator = Array.from({ length: input[0].getNumberValue() }, function (v, k) {
                                return new monodronebot_1.CommandNumber(k);
                            });
                        }
                        else {
                            return [2 /*return*/, new monodronebot_1.SimpleCommandOutputError("Iterate requires atleast 2 arguments")];
                        }
                        values = [];
                        index = 0;
                        _c.label = 2;
                    case 2:
                        if (!(index < iterator.length)) return [3 /*break*/, 7];
                        element = iterator[index];
                        scope.push();
                        scope.setValue("_index", new monodronebot_1.CommandNumber(index));
                        scope.setValue("_value", element);
                        if (!input[1].hasStringValue()) return [3 /*break*/, 4];
                        _b = (_a = values).push;
                        return [4 /*yield*/, new commandinterpreter_1.CommandInterpreter(bot, input[1].getStringValue(), caller, scope).interpret()];
                    case 3:
                        _b.apply(_a, [_c.sent()]);
                        return [3 /*break*/, 5];
                    case 4: return [2 /*return*/, new monodronebot_1.SimpleCommandOutputError("Second argument was not a string!")];
                    case 5:
                        scope.pop();
                        _c.label = 6;
                    case 6:
                        index++;
                        return [3 /*break*/, 2];
                    case 7:
                        output = new monodronebot_1.CommandOutputArray(values);
                        return [2 /*return*/, output];
                }
            });
        });
    };
    IterateCommand.prototype.getRequiredPermission = function () {
        return "control.iterate";
    };
    IterateCommand.prototype.getShortHelpText = function () {
        return "Iterates over a list, running a command each time.";
    };
    IterateCommand.prototype.getLongHelpText = function () {
        return "Iterate [number/array/iterator] [command string] . The scope will contain the following values :\n" +
            "_index : the index of the current iteration, 0 based\n" +
            "_value : the value of the current iteraion";
    };
    return IterateCommand;
}());
var SetCommand = /** @class */ (function () {
    function SetCommand() {
    }
    SetCommand.prototype.getName = function () {
        return "set";
    };
    SetCommand.prototype.call = function (input, scope, caller, bot) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (input.length != 2) {
                    return [2 /*return*/, new monodronebot_1.SimpleCommandOutputError("Set requires 2 arguments.")];
                }
                if (!input[0].hasStringValue()) {
                    return [2 /*return*/, new monodronebot_1.SimpleCommandOutputError("First argument must have a string value")];
                }
                scope.setValue(input[0].getStringValue(), input[1]);
                return [2 /*return*/, new monodronebot_1.CommandStringOutput("Set")];
            });
        });
    };
    SetCommand.prototype.getRequiredPermission = function () {
        return "control.set";
    };
    SetCommand.prototype.getShortHelpText = function () {
        return "Sets a scope variable.";
    };
    SetCommand.prototype.getLongHelpText = function () {
        return "Sets a scope variable (Note : Scope variables are temporary and are often not secure without proper scope managment). set [name] [value]";
    };
    return SetCommand;
}());
