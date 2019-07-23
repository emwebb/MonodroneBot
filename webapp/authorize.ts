import { RequestHandler } from "express";
export function authorize(roleNedded : Number, api : Boolean) : RequestHandler {
    return (req, res, next) => {
        if(req.user) {
            if(req.user.role >= roleNedded) {
                next();
                return;
            }
        }
        if(api) {
            res.sendStatus(403);
        } else {
            res.render('403');
        }
    }
}