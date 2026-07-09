import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db";

// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nama, email, dan password wajib diisi",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password minimal 6 karakter",
      });
    }

    const existing: any = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing && existing.length > 0) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "viewer"]
    );

    return res.status(201).json({ message: "Registrasi berhasil" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Terjadi kesalahan server" });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi",
      });
    }

    const rows: any = await db.query(
      "SELECT id, name, email, password, role FROM users WHERE email = ?",
      [email]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.JWT_EXPIRES_IN || "2h") as any }
    );

    return res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Terjadi kesalahan server" });
  }
};

// POST /api/auth/logout
export const logout = (req: Request, res: Response) => {
  return res.json({ message: "Logout berhasil. Hapus token di frontend." });
};

// POST /api/auth/forgot-password-direct
export const directResetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Email, password baru, dan konfirmasi wajib diisi" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Password baru dan konfirmasi tidak cocok" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password minimal 6 karakter" });
    }

    const rows: any = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email]);

    return res.json({ message: "Password berhasil diubah. Silakan login dengan password baru." });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Terjadi kesalahan server" });
  }
};
