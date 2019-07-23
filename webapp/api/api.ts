import { Router } from "express";
import featureRouter from "./feature"
import effectRouter from "./effect"
let apiRouter = Router();

apiRouter.use("/feature", featureRouter);
apiRouter.use("/effect", effectRouter);
apiRouter.use("*",(req, res) => {
    res.sendStatus(404);
});

export default apiRouter