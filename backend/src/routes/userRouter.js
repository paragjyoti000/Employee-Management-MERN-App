import { Router } from "express";
import {
    loginUser,
    registerUser,
    logoutUser,
    getUser,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", protect, logoutUser);
router.get("/get-current-user", protect, getUser);

export default router;
