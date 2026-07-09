"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  User,
  UserInput,
} from "@/lib/apiUser";
import { getUser, logout } from "@/lib/auth";

export default function UsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<UserInput>({
    name: "",
    email: "",
    password: "",
    role: "viewer",
  });

  // Auth Guard
  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "admin") {
      router.push("/mahasiswa"); // Redirect if not admin
      return;
    }
    setRole(user.role);
    setUserName(user.name || user.email);
  }, [router]);

  // Load Data
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getAllUsers();
      setUsers(result);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat data user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "admin") {
      loadUsers();
    }
  }, [role]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (user: User) => {
    setIsEditing(true);
    setEditId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Don't populate password on edit
      role: user.role,
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "viewer",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setMessage("");
      setError("");

      if (isEditing && editId) {
        // Update
        const { password, ...updatePayload } = formData;
        await updateUser(editId, updatePayload);
        setMessage("✅ User berhasil diupdate!");
      } else {
        // Create
        if (!formData.password) {
          setError("Password wajib diisi untuk user baru");
          return;
        }
        await createUser(formData);
        setMessage("✅ User berhasil ditambahkan!");
      }

      handleCancelEdit();
      await loadUsers();
    } catch (err: any) {
      setError(err?.message || "Gagal menyimpan data user.");
    }
  };

  const handleDelete = async (id: number) => {
    const ok = confirm("Yakin ingin menghapus user ini?");
    if (!ok) return;

    try {
      setMessage("");
      setError("");
      await deleteUser(id);
      setMessage("✅ User berhasil dihapus!");
      await loadUsers();
    } catch (err: any) {
      setError(err?.message || "Gagal menghapus user.");
    }
  };

  const handleResetPassword = async (id: number) => {
    const ok = confirm("Yakin ingin mereset password user ini?");
    if (!ok) return;

    try {
      setMessage("");
      setError("");
      const result = await resetPassword(id);
      alert(`Password sementara: ${result.temporaryPassword}\n\nCatat dan berikan kepada user!`);
      setMessage("✅ Password berhasil direset!");
    } catch (err: any) {
      setError(err?.message || "Gagal mereset password.");
    }
  };

  // Only render if admin
  if (role !== "admin") {
    return null; // Will redirect in useEffect
  }

  return (
    <main className="container">
      {/* HEADER */}
      <div className="header">
        <div>
          <h1>Manajemen User</h1>
          <p>
            Halo, <strong>{userName}</strong> &mdash; Role:{" "}
            <span
              style={{
                background: "#fef3c7",
                color: "#92400e",
                padding: "2px 10px",
                borderRadius: 20,
                fontWeight: 700,
                fontSize: "0.8rem",
              }}
            >
              {role}
            </span>
          </p>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-secondary" onClick={() => router.push("/mahasiswa")}>
            📚 Data Mahasiswa
          </button>
          <button className="btn-danger" onClick={logout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* MESSAGES */}
      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}

      {/* FORM */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2>{isEditing ? "✏️ Edit User" : "➕ Tambah User Baru"}</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px", gridTemplateColumns: "1fr 1fr" }}>
          
          <div className="form-group">
            <label>Nama</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {!isEditing && (
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEditing}
              />
            </div>
          )}

          <div className="form-group">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="admin">Admin</option>
              <option value="operator">Operator</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div className="form-actions" style={{ gridColumn: "1 / -1", display: "flex", gap: 12 }}>
            <button type="submit" className="btn-primary">
              {isEditing ? "Simpan Perubahan" : "Simpan User"}
            </button>
            {isEditing && (
              <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLE */}
      <section className="card">
        <h2 style={{ marginBottom: 16 }}>📋 Daftar User</h2>

        {loading ? (
          <div className="loading-wrapper">
            <div className="spinner"></div>
            <p>Memuat data user...</p>
          </div>
        ) : users.length === 0 ? (
          <p className="empty-message">Belum ada data user.</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Dibuat Pada</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td className="font-semibold">{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.role}</td>
                    <td>{new Date(item.created_at || "").toLocaleDateString("id-ID")}</td>
                    <td>
                      <div className="actions">
                        <button className="btn-secondary" onClick={() => handleEdit(item)}>
                          Edit
                        </button>
                        <button className="btn-danger" onClick={() => handleDelete(item.id)}>
                          Hapus
                        </button>
                        <button 
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "none",
                            background: "#eab308",
                            color: "white",
                            fontWeight: 500,
                            cursor: "pointer",
                            fontSize: "0.85rem"
                          }}
                          onClick={() => handleResetPassword(item.id)}
                        >
                          Reset Password
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
