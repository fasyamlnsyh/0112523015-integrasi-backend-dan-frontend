import { Router } from "express";
import {
  getAllMahasiswa,
  createMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "../controllers/mahasiswa.controller";
import { uploadFotoMahasiswa } from "../middlewares/upload.middleware";

const router = Router();

// GET - Semua role boleh akses
router.get(
  "/",
  getAllMahasiswa
);

// POST - Hanya admin dan operator
router.post(
  "/",
  uploadFotoMahasiswa.single("foto"),
  createMahasiswa
);

// PUT - Hanya admin dan operator
router.put(
  "/:id",
  uploadFotoMahasiswa.single("foto"),
  updateMahasiswa
);

// DELETE - Hanya admin
router.delete(
  "/:id",
  deleteMahasiswa
);

export default router;
