import { Router } from "express";
import { login, logout, register, getProfile } from "../controllers/user.controller.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

const router = Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/profile").get(authenticateUser, getProfile);

export default router;
