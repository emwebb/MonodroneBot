import { Router } from "express";
import { authorize } from "../authorize";
import Feature, { IFeature } from "../../common/models/feature";
import * as mongoose from "mongoose";
import consts from "../../common/const";

let featureRouter = Router();

featureRouter.post("/",authorize(consts.roles.executive,true), (req,res) => {
    let feature = new Feature();
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

featureRouter.get("/:featureId",authorize(consts.roles.default,true),(req,res) => {
    let featureId = req.params["featureId"];
    if(!mongoose.Types.ObjectId.isValid(featureId)) {
        res.sendStatus(400);
        return;
    }
    featureId = new mongoose.Types.ObjectId(featureId);
    
    Feature.findById(featureId).then((feature) => {
            if(!feature) {
                res.sendStatus(404);
            } else {
                res.json(feature);
            }

    }).catch((reason) => {
        console.error(reason);
        res.sendStatus(500);
    })
});

featureRouter.put("/:featureId",authorize(consts.roles.default,true),(req,res) => {
    let featureId = req.params["featureId"];
    if(!mongoose.Types.ObjectId.isValid(featureId)) {
        res.sendStatus(400);
    }
    featureId = new mongoose.Types.ObjectId(featureId);
    
    Feature.findById(featureId).then((feature) => {
        if(!feature) {
            feature = new Feature({
                _id : featureId
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

        if(feature.validateSync()) {
            res.sendStatus(400);
        }

        feature.save().then((value : IFeature) => {
            res.json(value);
        }).catch((reason) => {
            console.error(reason);
            res.sendStatus(500);
        });

    }).catch((reason) => {
        console.error(reason);
        res.sendStatus(500);
    })
});

featureRouter.delete("/:featureId",authorize(consts.roles.default,true),(req,res) => { 
    let featureId = req.params["featureId"];
    if(!mongoose.Types.ObjectId.isValid(featureId)) {
        res.sendStatus(400);
    }
    featureId = new mongoose.Types.ObjectId(featureId);
    Feature.findByIdAndDelete(featureId).then((feature) => {
            if(!feature) {
                res.sendStatus(404);
            } else {
                res.json(feature);
            }   
    }).catch((reason) => {
        console.error(reason);
        res.sendStatus(500);
    });
});

featureRouter.get("/",authorize(consts.roles.default,true),(req,res) => {
    let query = Feature.find()
    if(req.query.name) {
        query.where('name',{ $regex : req.query.name , $options : "i"})
    }

    query.then((values) => {
        res.json(values);

    }).catch((reason) => {
        console.error(reason);
        res.sendStatus(500);
    });
});


export default featureRouter