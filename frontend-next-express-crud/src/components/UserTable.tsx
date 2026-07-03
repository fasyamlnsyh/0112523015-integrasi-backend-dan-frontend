"use client";

import { User, deleteUser, resetPassword, updateUser } from "@/lib/apiUser";
import { useState } from "react";

type Props = {
  users: User[];
  onRefresh: () => void;
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  operator: "Operator",
  viewer: "Viewer",
};

const ROLE_COLORS: Record<string, string> = {
  admin: "#ef4444",
  operator: "#f59e0b",
  viewer: "#10b981",
};

export default function UserTable({ users, onRefresh }: Props) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "" });

  const handleEdit = (user: User) => {
    setEditId(user.id);
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };

  const handleUpdate = async (id: number) => {
    try {
      setLoadingId(id);
      await updateUser(id, {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role as "admin" | "operator" | "viewer",
      });
      setEditId(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || "Gagal memperbarui user");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;
    try {
      setLoadingId(id);
      await deleteUser(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus user");
    } finally {
      setLoadingId(null);
    }
  };

  const handleReset = async (id: number, name: string) => {
    if (!confirm(`Reset password untuk ${name}?`)) return;
    try {
      setLoadingId(id);
      const result = await resetPassword(id);
      alert(
        `✅ Password berhasil direset!\n\nPassword sementara: ${result.temporaryPassword}\n\nSimpan dan berikan kepada user. Jangan tampilkan ulang.`
      );
    } catch (err: any) {
      alert(err.message || "Gagal mereset password");
    } finally {
      setLoadingId(null);
    }
  };

  if (users.length === 0) {
    return <p className="empty-message">Belum ada data user.</p>;
  }

  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Role</th>
            <th>Dibuat</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td className="font-semibold">
                {editId === user.id ? (
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid var(--border)" }}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editId === user.id ? (
                  <input
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid var(--border)" }}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editId === user.id ? (
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid var(--border)" }}
                  >
                    <option value="admin">Admin</option>
                    <option value="operator">Operator</option>
                    <option value="viewer">Viewer</option>
                  </select>
                ) : (
                  <span
                    style={{
                      background: ROLE_COLORS[user.role] + "20",
                      color: ROLE_COLORS[user.role],
                      padding: "2px 10px",
                      borderRadius: 20,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    {ROLE_LABELS[user.role]}
                  </span>
                )}
              </td>
              <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                {user.created_at ? new Date(user.created_at).toLocaleDateString("id-ID") : "-"}
              </td>
              <td>
                <div className="actions">
                  {editId === user.id ? (
                    <>
                      <button
                        className="btn-primary"
                        onClick={() => handleUpdate(user.id)}
                        disabled={loadingId === user.id}
                        style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                      >
                        {loadingId === user.id ? "..." : "Simpan"}
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => setEditId(null)}
                        style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                      >
                        Batal
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn-secondary"
                        onClick={() => handleEdit(user)}
                        style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleReset(user.id, user.name)}
                        disabled={loadingId === user.id}
                        style={{
                          padding: "6px 12px",
                          fontSize: "0.85rem",
                          background: "#f59e0b",
                          color: "white",
                          border: "none",
                          borderRadius: "var(--radius-sm)",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontFamily: "inherit",
                        }}
                      >
                        {loadingId === user.id ? "..." : "Reset Pwd"}
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => handleDelete(user.id)}
                        disabled={loadingId === user.id}
                        style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                      >
                        Hapus
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
