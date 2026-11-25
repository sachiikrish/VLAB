import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

// SIGNUP ROUTE
router.post("/signup", authController.signup);

// SIGNIN ROUTE
router.post("/signin", authController.signin);
router.post("/refresh-token", authController.refreshTokenController);
router.post("/logout", authController.logout);

export default router;
