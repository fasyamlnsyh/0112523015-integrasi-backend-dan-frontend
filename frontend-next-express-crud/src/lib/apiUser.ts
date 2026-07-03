import { getToken } from "./auth";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "operator" | "viewer";
  created_at?: string;
};

export type UserInput = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "operator" | "viewer";
};

function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// GET semua users
export async function getAllUsers(): Promise<User[]> {
  const res = await fetch(`${API_URL}/users`, {
    headers: { ...authHeader() },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil data user");
  return data.data || [];
}

// POST user baru
export async function createUser(payload: UserInput): Promise<void> {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal membuat user");
}

// PUT update user
export async function updateUser(
  id: number,
  payload: Omit<UserInput, "password">
): Promise<void> {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal memperbarui user");
}

// DELETE user
export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal menghapus user");
}

// PATCH reset password
export async function resetPassword(id: number): Promise<{ temporaryPassword: string }> {
  const res = await fetch(`${API_URL}/users/${id}/reset-password`, {
    method: "PATCH",
    headers: { ...authHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mereset password");
  return data;
}
