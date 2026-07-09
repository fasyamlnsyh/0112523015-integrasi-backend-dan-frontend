import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  resetPasswordByAdmin,
  requestPasswordReset,
} from "../controllers/user.controller";

const router = Router();

// Semua endpoint user hanya untuk admin
router.use(authMiddleware);
router.use(allowRoles("admin"));

router.get("/", getAllUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.patch("/:id/reset-password", resetPasswordByAdmin);
router.post("/request-reset", requestPasswordReset);

export default router;
