import { Router } from "express";
import {
  getAllMahasiswa,
  createMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "../controllers/mahasiswa.controller";
import { uploadFotoMahasiswa } from "../middlewares/upload.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// GET - Semua role boleh akses
router.get(
  "/",
  authMiddleware,
  getAllMahasiswa
);

// POST - Hanya admin dan operator
router.post(
  "/",
  authMiddleware,
  uploadFotoMahasiswa.single("foto"),
  createMahasiswa
);

// PUT - Hanya admin dan operator
router.put(
  "/:id",
  authMiddleware,
  uploadFotoMahasiswa.single("foto"),
  updateMahasiswa
);

// DELETE - Hanya admin
router.delete(
  "/:id",
  authMiddleware,
  deleteMahasiswa
);

export default router;
