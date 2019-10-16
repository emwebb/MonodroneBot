import { Router } from "express";
import { authorize } from "../authorize";
import Feature, { IFeature } from "../../common/models/feature";
import * as mongoose from "mongoose";
import consts from "../../common/const";

let featureRouter = Router();

featureRouter.post("/",authorize(consts.roles.executive,true), (req,res) => {
    let feature = new Feature(req.body);
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

        feature.set(req.body);

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
    let pageSize = req.query.pageSize || 20;
    let page = req.query.page || 0;
    
    if(req.query.name) {
        query = query.where('name',{ $regex : req.query.name , $options : "i"})
    }
    query = query.skip(page*pageSize).limit(pageSize);
    query.then((values) => {
        res.json(values);

    }).catch((reason) => {
        console.error(reason);
        res.sendStatus(500);
    });
});


export default featureRouter