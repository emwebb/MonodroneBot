"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authorize_1 = require("../authorize");
var effect_1 = require("../../common/models/effect");
var mongoose = require("mongoose");
var const_1 = require("../../common/const");
var effectRouter = express_1.Router();
effectRouter.post("/", authorize_1.authorize(const_1.default.roles.executive, true), function (req, res) {
    var effect = new effect_1.default(req.body);
    var error = effect.validateSync();
    if (error) {
        res.sendStatus(400);
    }
    effect.save().then(function (value) {
        res.json(value);
    }).catch(function (reason) {
        console.error(reason);
        res.sendStatus(500);
    });
});
effectRouter.get("/:effectId", authorize_1.authorize(const_1.default.roles.default, true), function (req, res) {
    var effectId = req.params["effectId"];
    if (!mongoose.Types.ObjectId.isValid(effectId)) {
        res.sendStatus(400);
        return;
    }
    effectId = new mongoose.Types.ObjectId(effectId);
    effect_1.default.findById(effectId)
        .then(function (effect) {
        if (!effect) {
            res.sendStatus(404);
        }
        else {
            res.json(effect);
        }
    }).catch(function (reason) {
        console.error(reason);
        res.sendStatus(500);
    });
});
effectRouter.put("/:effectId", authorize_1.authorize(const_1.default.roles.default, true), function (req, res) {
    var effectId = req.params["effectId"];
    if (!mongoose.Types.ObjectId.isValid(effectId)) {
        res.sendStatus(400);
    }
    effectId = new mongoose.Types.ObjectId(effectId);
    effect_1.default.findById(effectId).then(function (effect) {
        if (!effect) {
            effect = new effect_1.default({
                _id: effectId
            });
        }
        effect.set(req.body);
        var error = effect.validateSync();
        if (error) {
            res.sendStatus(400);
        }
    }).catch(function (reason) {
        console.error(reason);
        res.sendStatus(500);
    });
});
effectRouter.delete("/:effectId", authorize_1.authorize(const_1.default.roles.default, true), function (req, res) {
    var effectId = req.params["effectId"];
    if (!mongoose.Types.ObjectId.isValid(effectId)) {
        res.sendStatus(400);
    }
    effectId = new mongoose.Types.ObjectId(effectId);
    effect_1.default.findByIdAndDelete(effectId).then(function (effect) {
        if (!effect) {
            res.sendStatus(404);
        }
        else {
            res.json(effect);
        }
    }).catch(function (reason) {
        console.error(reason);
        res.sendStatus(500);
    });
});
effectRouter.get("/", authorize_1.authorize(const_1.default.roles.default, true), function (req, res) {
    var query = effect_1.default.find();
    var pageSize = req.query.pageSize || 20;
    var page = req.query.page || 0;
    if (req.query.name) {
        query = query.where('name', { $regex: req.query.name, $options: "i" });
    }
    query = query.skip(page * pageSize).limit(pageSize);
    query.then(function (values) {
        res.json(values);
    }).catch(function (reason) {
        console.error(reason);
        res.sendStatus(500);
    });
});
exports.default = effectRouter;
