import { Router } from "express";
import { register, login, logout, directResetPassword } from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password-direct", directResetPassword);

export default router;
