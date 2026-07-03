// Simpan token dan data user ke localStorage
export function saveAuth(token: string, user: any) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

// Ambil token JWT
export function getToken(): string | null {
  return localStorage.getItem("token");
}

// Ambil data user
export function getUser(): { id: number; name: string; email: string; role: "admin" | "operator" | "viewer" } | null {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

// Logout - hapus token dan redirect ke login
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

// Cek apakah user sudah login
export function isLoggedIn(): boolean {
  return !!getToken();
}
