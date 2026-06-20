import { Router, Request, Response } from "express";
import db from "../config/db";

const router = Router();

// GET all produk
router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await db.query("SELECT * FROM produk ORDER BY id DESC");
    return res.json({
      message: "Data produk berhasil diambil",
      data: data
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Gagal mengambil data" });
  }
});

// POST create produk
router.post("/", async (req: Request, res: Response) => {
  const { nama, harga, stok } = req.body;
  if (!nama || harga === undefined || stok === undefined) {
    return res.status(400).json({ message: "Semua kolom harus diisi" });
  }
  try {
    const result: any = await db.query(
      "INSERT INTO produk (nama, harga, stok) VALUES (?, ?, ?)",
      [nama, Number(harga), Number(stok)]
    );
    
    const insertId = result.insertId;
    
    return res.status(201).json({
      message: "Data produk berhasil ditambahkan",
      data: { id: insertId, nama, harga, stok }
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Gagal menyimpan data" });
  }
});

// PUT update produk
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nama, harga, stok } = req.body;
  if (!nama || harga === undefined || stok === undefined) {
    return res.status(400).json({ message: "Semua kolom harus diisi" });
  }
  try {
    const result: any = await db.query(
      "UPDATE produk SET nama = ?, harga = ?, stok = ? WHERE id = ?",
      [nama, Number(harga), Number(stok), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data produk tidak ditemukan" });
    }

    return res.json({
      message: "Data produk berhasil diperbarui"
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Gagal memperbarui data" });
  }
});

// DELETE produk
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result: any = await db.query("DELETE FROM produk WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data produk tidak ditemukan" });
    }
    return res.json({
      message: "Data produk berhasil dihapus"
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Gagal menghapus data" });
  }
});

export default router;
