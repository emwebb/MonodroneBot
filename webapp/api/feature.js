"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authorize_1 = require("../authorize");
var feature_1 = require("../../common/models/feature");
var mongoose = require("mongoose");
var const_1 = require("../../common/const");
var featureRouter = express_1.Router();
featureRouter.post("/", authorize_1.authorize(const_1.default.roles.executive, true), function (req, res) {
    var feature = new feature_1.default(req.body);
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
        feature.set(req.body);
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
exports.default = featureRouter;
