import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import db from "../config/db";
import { mailer } from "../config/mail";

// GET /api/users - Admin only
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const rows = await db.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY id DESC"
    );

    return res.json({
      message: "Data user berhasil diambil",
      data: rows,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Terjadi kesalahan server" });
  }
};

// POST /api/users - Admin only
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Nama, email, password, dan role wajib diisi",
      });
    }

    const allowedRoles = ["admin", "operator", "viewer"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Role tidak valid" });
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
      [name, email, hashedPassword, role]
    );

    return res.status(201).json({ message: "User berhasil ditambahkan" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Terjadi kesalahan server" });
  }
};

// PUT /api/users/:id - Admin only
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ message: "Nama, email, dan role wajib diisi" });
    }

    const allowedRoles = ["admin", "operator", "viewer"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Role tidak valid" });
    }

    const result: any = await db.query(
      "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
      [name, email, role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    return res.json({ message: "User berhasil diperbarui" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Terjadi kesalahan server" });
  }
};

// DELETE /api/users/:id - Admin only
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result: any = await db.query(
      "DELETE FROM users WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    return res.json({ message: "User berhasil dihapus" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Terjadi kesalahan server" });
  }
};

// PATCH /api/users/:id/reset-password - Admin only
function generateTemporaryPassword(): string {
  return Math.random().toString(36).slice(-10);
}

export const resetPasswordByAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const temporaryPassword = generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    const result: any = await db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    return res.json({
      message: "Password berhasil direset",
      temporaryPassword,
      note: "Tampilkan hanya sekali, lalu minta user mengganti password.",
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Terjadi kesalahan server" });
  }
};

// POST /api/users/request-reset
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email wajib diisi" });
    }

    const [users]: any = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }
    const user = users[0];

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    
    // Expires in 30 minutes
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await db.query(
      "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
      [user.id, tokenHash, expiresAt]
    );

    const appUrl = process.env.APP_URL || "http://localhost:3001";

    await mailer.sendMail({
      from: `Admin Kampus <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: "Reset Password",
      html: `
        <p>Anda meminta reset password.</p>
        <p>Klik link berikut untuk mengganti password:</p>
        <a href="${appUrl}/reset-password?token=${rawToken}">
          Reset Password
        </a>
        <p>Link berlaku selama 30 menit.</p>
      `,
    });

    return res.json({ message: "Link reset password telah dikirim ke email Anda" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Terjadi kesalahan server" });
  }
};
