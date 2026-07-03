import { getToken } from "./auth";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export type Prodi = {
  id: number;
  nama_prodi: string;
};

// GET semua prodi
export async function getAllProdi(): Promise<Prodi[]> {
  const token = getToken();
  const response = await fetch(`${API_URL}/prodi`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Gagal mengambil data prodi");
  }

  const result = await response.json();
  return result.data || [];
}
