import { Router } from "express";
import { authorize } from "../authorize";
import Effect, { IEffect } from "../../common/models/effect";
import * as mongoose from "mongoose";
import consts from "../../common/const";

let effectRouter = Router();

effectRouter.post("/",authorize(consts.roles.executive,true), (req,res) => {
    let effect = new Effect(req.body);
    let error = effect.validateSync();
    if(error) {
        res.sendStatus(400);
    }

    effect.save().then((value) => {
        res.json(value);
    }).catch((reason) => {
        console.error(reason);
        res.sendStatus(500);
    });
});

effectRouter.get("/:effectId",authorize(consts.roles.default,true),(req,res) => {
    let effectId = req.params["effectId"];
    if(!mongoose.Types.ObjectId.isValid(effectId)) {
        res.sendStatus(400);
        return;
    }
    effectId = new mongoose.Types.ObjectId(effectId);
    
    Effect.findById(effectId)
        .then((effect) => {
            if(!effect) {
                res.sendStatus(404);
            } else {
                res.json(effect);
            }

    }).catch((reason) => {
        console.error(reason);
        res.sendStatus(500);
    })
});

effectRouter.put("/:effectId",authorize(consts.roles.default,true),(req,res) => {
    let effectId = req.params["effectId"];
    if(!mongoose.Types.ObjectId.isValid(effectId)) {
        res.sendStatus(400);
    }
    effectId = new mongoose.Types.ObjectId(effectId);
    
    Effect.findById(effectId).then((effect) => {
        if(!effect) {
            effect = new Effect({
                _id : effectId
            });
        }
        effect.set(req.body);

        let error = effect.validateSync();

        if(error) {
            res.sendStatus(400);
        }
    }).catch((reason) => {
        console.error(reason);
        res.sendStatus(500);
    })
});

effectRouter.delete("/:effectId",authorize(consts.roles.default,true),(req,res) => { 
    let effectId = req.params["effectId"];
    if(!mongoose.Types.ObjectId.isValid(effectId)) {
        res.sendStatus(400);
    }
    effectId = new mongoose.Types.ObjectId(effectId);
    Effect.findByIdAndDelete(effectId).then((effect) => {
            if(!effect) {
                res.sendStatus(404);
            } else {
                res.json(effect);
            }   
    }).catch((reason) => {
        console.error(reason);
        res.sendStatus(500);
    });
});

effectRouter.get("/",authorize(consts.roles.default,true),(req,res) => {
    let query = Effect.find()
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

export default effectRouter