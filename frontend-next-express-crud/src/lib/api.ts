import { getToken } from "./auth";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

export type Mahasiswa = {
  id: number;
  nim: string;
  nama: string;
  prodi_id: number;
  nama_prodi: string;
  angkatan: number;
  foto?: string | null;
  created_at?: string;
};

export type MahasiswaInput = {
  nim: string;
  nama: string;
  prodi_id: number;
  angkatan: number;
  foto?: File | null;
};

export type MahasiswaMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

type ApiResponse<T> = {
  message: string;
  data?: T;
  meta?: MahasiswaMeta;
};

function authHeader(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Terjadi kesalahan saat mengakses API");
  }
  return result;
}

// GET mahasiswa dengan search, filter prodi, pagination
export async function getMahasiswa(params?: {
  search?: string;
  prodi_id?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Mahasiswa[]; meta: MahasiswaMeta }> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.prodi_id) query.set("prodi_id", params.prodi_id);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  const response = await fetch(
    `${API_URL}/mahasiswa?${query.toString()}`,
    {
      headers: { ...authHeader() },
      cache: "no-store",
    }
  );

  const result = await handleResponse<Mahasiswa[]>(response);
  return {
    data: result.data || [],
    meta: result.meta || { page: 1, limit: 10, total: 0, totalPage: 1 },
  };
}

// POST mahasiswa - kirim FormData agar bisa upload foto
export async function createMahasiswa(payload: MahasiswaInput): Promise<Mahasiswa> {
  const formData = new FormData();
  formData.append("nim", payload.nim);
  formData.append("nama", payload.nama);
  formData.append("prodi_id", String(payload.prodi_id));
  formData.append("angkatan", String(payload.angkatan));
  if (payload.foto) formData.append("foto", payload.foto);

  const response = await fetch(`${API_URL}/mahasiswa`, {
    method: "POST",
    headers: { ...authHeader() },
    body: formData,
  });

  const result = await handleResponse<Mahasiswa>(response);
  return result.data as Mahasiswa;
}

// PUT mahasiswa - kirim FormData agar bisa upload foto baru
export async function updateMahasiswa(
  id: number,
  payload: MahasiswaInput
): Promise<void> {
  const formData = new FormData();
  formData.append("nim", payload.nim);
  formData.append("nama", payload.nama);
  formData.append("prodi_id", String(payload.prodi_id));
  formData.append("angkatan", String(payload.angkatan));
  if (payload.foto) formData.append("foto", payload.foto);

  const response = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: "PUT",
    headers: { ...authHeader() },
    body: formData,
  });

  await handleResponse(response);
}

// DELETE mahasiswa
export async function deleteMahasiswa(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });

  await handleResponse(response);
}

// AUTH - login
export async function loginAPI(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login gagal");
  return data as {
    token: string;
    user: { id: number; name: string; email: string; role: string };
  };
}

// AUTH - register
export async function registerAPI(name: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registrasi gagal");
  return data;
}

// AUTH - forgot password direct
export async function forgotPasswordDirectAPI(email: string, newPassword: string, confirmPassword: string) {
  const res = await fetch(`${API_URL}/auth/forgot-password-direct`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword, confirmPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengubah password");
  return data;
}
