import {Router} from "express";
import AuthController from "../controllers/AuthController";
import {checkJwt} from "../middlewares/checkJwt";

const router = Router();

// Login route
router.post("/login", AuthController.login);

// Change my password
router.post("/change-password", [checkJwt], AuthController.changePassword);

// Forgot password
router.post("/forgot-password", [checkJwt], AuthController.forgotPassword);

export default router;