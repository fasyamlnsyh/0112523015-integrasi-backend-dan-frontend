import { Request, Response } from "express";
import db from "../config/db";

// GET all prodi
export const getAllProdi = async (req: Request, res: Response) => {
  try {
    const rows = await db.query(
      "SELECT id, nama_prodi FROM prodi ORDER BY nama_prodi ASC"
    );

    return res.json({
      message: "Data prodi berhasil diambil",
      data: rows,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Terjadi kesalahan server" });
  }
};
