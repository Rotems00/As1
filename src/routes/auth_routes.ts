import authController from "../controllers/auth_controller";
import express , { Request , Response } from "express";
const router  = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);

export default router;
