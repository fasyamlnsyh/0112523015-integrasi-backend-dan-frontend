import { Router, Request, Response } from "express";
import db from "../config/db";

const router = Router();

// GET all mahasiswa
router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await db.query("SELECT * FROM mahasiswa ORDER BY id DESC");
    return res.json({
      message: "Data mahasiswa berhasil diambil",
      data: data
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Gagal mengambil data" });
  }
});

// POST create mahasiswa
router.post("/", async (req: Request, res: Response) => {
  const { nim, nama, prodi, angkatan } = req.body;
  if (!nim || !nama || !prodi || angkatan === undefined) {
    return res.status(400).json({ message: "Semua kolom harus diisi" });
  }
  try {
    // Check if NIM already exists
    const existing: any = await db.query("SELECT id FROM mahasiswa WHERE nim = ?", [nim]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ message: "NIM sudah terdaftar" });
    }

    const result: any = await db.query(
      "INSERT INTO mahasiswa (nim, nama, prodi, angkatan) VALUES (?, ?, ?, ?)",
      [nim, nama, prodi, Number(angkatan)]
    );
    
    const insertId = result.insertId;
    
    return res.status(201).json({
      message: "Data mahasiswa berhasil ditambahkan",
      data: { id: insertId, nim, nama, prodi, angkatan }
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Gagal menyimpan data" });
  }
});

// PUT update mahasiswa
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nim, nama, prodi, angkatan } = req.body;
  if (!nim || !nama || !prodi || angkatan === undefined) {
    return res.status(400).json({ message: "Semua kolom harus diisi" });
  }
  try {
    // Check if NIM is owned by another student
    const existing: any = await db.query("SELECT id FROM mahasiswa WHERE nim = ? AND id != ?", [nim, id]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ message: "NIM sudah terdaftar pada mahasiswa lain" });
    }

    const result: any = await db.query(
      "UPDATE mahasiswa SET nim = ?, nama = ?, prodi = ?, angkatan = ? WHERE id = ?",
      [nim, nama, prodi, Number(angkatan), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data mahasiswa tidak ditemukan" });
    }

    return res.json({
      message: "Data mahasiswa berhasil diperbarui"
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Gagal memperbarui data" });
  }
});

// DELETE mahasiswa
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result: any = await db.query("DELETE FROM mahasiswa WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data mahasiswa tidak ditemukan" });
    }
    return res.json({
      message: "Data mahasiswa berhasil dihapus"
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Gagal menghapus data" });
  }
});

export default router;
