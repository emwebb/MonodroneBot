"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var feature_1 = require("./feature");
var effect_1 = require("./effect");
var apiRouter = express_1.Router();
apiRouter.use("/feature", feature_1.default);
apiRouter.use("/effect", effect_1.default);
apiRouter.use("*", function (req, res) {
    res.sendStatus(404);
});
exports.default = apiRouter;
