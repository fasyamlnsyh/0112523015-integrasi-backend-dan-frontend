import { Router } from "express";
import {
  getAllMahasiswa,
  createMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "../controllers/mahasiswa.controller";
import { uploadFotoMahasiswa } from "../middlewares/upload.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";

const router = Router();

// GET - Semua role boleh akses (admin, operator, viewer)
router.get(
  "/",
  authMiddleware,
  allowRoles("admin", "operator", "viewer"),
  getAllMahasiswa
);

// POST - Hanya admin dan operator
router.post(
  "/",
  authMiddleware,
  allowRoles("admin", "operator"),
  uploadFotoMahasiswa.single("foto"),
  createMahasiswa
);

// PUT - Hanya admin dan operator
router.put(
  "/:id",
  authMiddleware,
  allowRoles("admin", "operator"),
  uploadFotoMahasiswa.single("foto"),
  updateMahasiswa
);

// DELETE - Hanya admin
router.delete(
  "/:id",
  authMiddleware,
  allowRoles("admin"),
  deleteMahasiswa
);

export default router;
