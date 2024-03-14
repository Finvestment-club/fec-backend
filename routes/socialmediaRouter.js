import express from "express";
import {
    Socialpost,
    getSocials,
    updateSocials,
    deleteSocials,
    getSingleSocial,
    getMySocial,
} from "../controllers/SocialController.js";
import { isAuthorized } from "../middlewares/auth.js";


const router = express.Router();
router.post("/social-post",isAuthorized, Socialpost);

router.put("/social-update/:id",isAuthorized, updateSocials);

router.get("/social-get", isAuthorized, getSocials);

router.delete("/social-delete/:id",isAuthorized, deleteSocials);


router.get("/my-social", isAuthorized, getMySocial);
router.get("/:id", isAuthorized, getSingleSocial);




export default router;
