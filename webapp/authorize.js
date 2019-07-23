"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function authorize(roleNedded, api) {
    return function (req, res, next) {
        if (req.user) {
            if (req.user.role >= roleNedded) {
                next();
                return;
            }
        }
        if (api) {
            res.sendStatus(403);
        }
        else {
            res.render('403');
        }
    };
}
exports.authorize = authorize;
