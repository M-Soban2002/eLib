import { Router } from "express";
import {register, login} from "../controllers/user.controller.js"

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(register)
router.route("/login").post(login)
// router.route("/logout").post(verifyJWT, logoutUser)
// router.route("/refresh-token").post(refreshAccessToken)

export default router