import express from "express";
import {
    ArticalPost,
    ArticalGet,
    ArticleIdGet,
    ArticalUpdate,
    ArticalDelete,
    ArticalLike,
    ArticalGetTop3,
    getSingleArtical,
    getMyArtical,
} from "../controllers/ArticalController.js";
import { isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

router.post("/artical-post",isAuthorized, ArticalPost);
router.get("/artical-get-top3", ArticalGetTop3);
router.get("/artical-get", ArticalGet);
router.put("/artical-update/:id",isAuthorized, ArticalUpdate);
router.delete("/artical-delete/:id",isAuthorized, ArticalDelete);
router.post("/artical-like", ArticalLike);
router.get("/article-id-get", ArticleIdGet);
router.get("/articleMy", isAuthorized, getMyArtical);
router.get("/:id", isAuthorized, getSingleArtical)


export default router;
