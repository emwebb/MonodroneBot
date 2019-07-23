"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authorize_1 = require("../authorize");
var feature_1 = require("../../common/models/feature");
var mongoose = require("mongoose");
var const_1 = require("../../common/const");
var featureRouter = express_1.Router();
featureRouter.post("/", authorize_1.authorize(const_1.default.roles.executive, true), function (req, res) {
    var feature = new feature_1.default();
    feature.name = req.body["name"];
    feature.displayName = req.body["displayName"];
    feature.description = req.body["description"];
    feature.display = req.body["display"];
    feature.levelUnlock = req.body["levelUnlock"];
    feature.upgradeOf = req.body["upgradeOf"];
    feature.options = req.body["options"];
    feature.optionMax = req.body["optionMax"];
    feature.effects = req.body["effects"];
    if (feature.validateSync()) {
        res.sendStatus(400);
    }
    feature.save().then(function (value) {
        res.json(value);
    }).catch(function (reason) {
        console.error(reason);
        res.sendStatus(500);
    });
});
featureRouter.get("/:featureId", authorize_1.authorize(const_1.default.roles.default, true), function (req, res) {
    var featureId = req.params["featureId"];
    if (!mongoose.Types.ObjectId.isValid(featureId)) {
        res.sendStatus(400);
        return;
    }
    featureId = new mongoose.Types.ObjectId(featureId);
    feature_1.default.findById(featureId).then(function (feature) {
        if (!feature) {
            res.sendStatus(404);
        }
        else {
            res.json(feature);
        }
    }).catch(function (reason) {
        console.error(reason);
        res.sendStatus(500);
    });
});
featureRouter.put("/:featureId", authorize_1.authorize(const_1.default.roles.default, true), function (req, res) {
    var featureId = req.params["featureId"];
    if (!mongoose.Types.ObjectId.isValid(featureId)) {
        res.sendStatus(400);
    }
    featureId = new mongoose.Types.ObjectId(featureId);
    feature_1.default.findById(featureId).then(function (feature) {
        if (!feature) {
            feature = new feature_1.default({
                _id: featureId
            });
        }
        feature.name = req.body["name"];
        feature.displayName = req.body["displayName"];
        feature.description = req.body["description"];
        feature.display = req.body["display"];
        feature.levelUnlock = req.body["levelUnlock"];
        feature.upgradeOf = req.body["upgradeOf"];
        feature.options = req.body["options"];
        feature.optionMax = req.body["optionMax"];
        feature.effects = req.body["effects"];
        if (feature.validateSync()) {
            res.sendStatus(400);
        }
        feature.save().then(function (value) {
            res.json(value);
        }).catch(function (reason) {
            console.error(reason);
            res.sendStatus(500);
        });
    }).catch(function (reason) {
        console.error(reason);
        res.sendStatus(500);
    });
});
featureRouter.delete("/:featureId", authorize_1.authorize(const_1.default.roles.default, true), function (req, res) {
    var featureId = req.params["featureId"];
    if (!mongoose.Types.ObjectId.isValid(featureId)) {
        res.sendStatus(400);
    }
    featureId = new mongoose.Types.ObjectId(featureId);
    feature_1.default.findByIdAndDelete(featureId).then(function (feature) {
        if (!feature) {
            res.sendStatus(404);
        }
        else {
            res.json(feature);
        }
    }).catch(function (reason) {
        console.error(reason);
        res.sendStatus(500);
    });
});
featureRouter.get("/", authorize_1.authorize(const_1.default.roles.default, true), function (req, res) {
    var query = feature_1.default.find();
    if (req.query.name) {
        query.where('name', { $regex: req.query.name, $options: "i" });
    }
    query.then(function (values) {
        res.json(values);
    }).catch(function (reason) {
        console.error(reason);
        res.sendStatus(500);
    });
});
exports.default = featureRouter;
