"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveAuth } from "@/lib/auth";
import { loginAPI, registerAPI, forgotPasswordDirectAPI } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register" | "forgot-password">("login");

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (mode === "login") {
        const data = await loginAPI(form.email, form.password);
        saveAuth(data.token, data.user);
        router.push("/mahasiswa");
      } else if (mode === "register") {
        await registerAPI(form.name, form.email, form.password);
        setSuccessMsg("Registrasi berhasil! Silakan login.");
        setMode("login");
        setForm({ name: "", email: form.email, password: "", confirmPassword: "" });
      } else if (mode === "forgot-password") {
        await forgotPasswordDirectAPI(form.email, form.password, form.confirmPassword);
        setSuccessMsg("Password berhasil diubah! Silakan login dengan password baru.");
        setMode("login");
        setForm({ name: "", email: form.email, password: "", confirmPassword: "" });
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        }}
      >
        {/* Logo / Title */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "14px",
              background: "linear-gradient(135deg, #6366f1, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
            </svg>
          </div>
          <h1
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: "4px",
            }}
          >
            {mode === "login" ? "Selamat Datang" : mode === "register" ? "Buat Akun Baru" : "Lupa Password"}
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
            {mode === "login"
              ? "Login untuk mengakses sistem mahasiswa"
              : mode === "register"
              ? "Isi data di bawah untuk mendaftar"
              : "Masukkan email dan password baru Anda"}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div
            style={{
              background: "#fef2f2",
              color: "#991b1b",
              borderRadius: "10px",
              padding: "12px 16px",
              marginBottom: "20px",
              fontSize: "0.9rem",
              borderLeft: "4px solid #ef4444",
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}
        {successMsg && (
          <div
            style={{
              background: "#ecfdf5",
              color: "#065f46",
              borderRadius: "10px",
              padding: "12px 16px",
              marginBottom: "20px",
              fontSize: "0.9rem",
              borderLeft: "4px solid #10b981",
              fontWeight: 500,
            }}
          >
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {mode === "register" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151" }}>
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Nama lengkap Anda"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                style={{
                  padding: "12px 14px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  fontSize: "0.95rem",
                  outline: "none",
                  fontFamily: "inherit",
                  background: "#f9fafb",
                }}
              />
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151" }}>
              Email
            </label>
            <input
              type="email"
              placeholder="email@contoh.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              style={{
                padding: "12px 14px",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "0.95rem",
                outline: "none",
                fontFamily: "inherit",
                background: "#f9fafb",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151" }}>
              {mode === "forgot-password" ? "Password Baru" : "Password"}
            </label>
            <input
              type="password"
              placeholder="Minimal 6 karakter"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
              style={{
                padding: "12px 14px",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "0.95rem",
                outline: "none",
                fontFamily: "inherit",
                background: "#f9fafb",
              }}
            />
          </div>

          {mode === "forgot-password" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151" }}>
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                placeholder="Ulangi password baru"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
                minLength={6}
                style={{
                  padding: "12px 14px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  fontSize: "0.95rem",
                  outline: "none",
                  fontFamily: "inherit",
                  background: "#f9fafb",
                }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "8px",
              padding: "14px",
              background: loading
                ? "#9ca3af"
                : "linear-gradient(135deg, #6366f1, #3b82f6)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "1rem",
              fontFamily: "inherit",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              boxShadow: loading ? "none" : "0 4px 14px rgba(99,102,241,0.4)",
            }}
          >
            {loading
              ? "Memproses..."
              : mode === "login"
              ? "Masuk"
              : mode === "register"
              ? "Daftar"
              : "Simpan Password Baru"}
          </button>
        </form>

        {/* Toggle */}
        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "0.9rem", color: "#64748b" }}>
          {mode === "login" ? (
            <>
              Belum punya akun?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                  setSuccessMsg("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6366f1",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontFamily: "inherit",
                  padding: 0,
                }}
              >
                Daftar sekarang
              </button>
              <div style={{ marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setMode("forgot-password");
                    setError("");
                    setSuccessMsg("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontFamily: "inherit",
                    padding: 0,
                  }}
                >
                  Lupa Password?
                </button>
              </div>
            </>
          ) : (
            <>
              Sudah punya akun?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setSuccessMsg("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6366f1",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontFamily: "inherit",
                  padding: 0,
                }}
              >
                Login
              </button>
            </>
          )}
        </div>

        {/* Info hint */}
        <div
          style={{
            marginTop: "24px",
            padding: "12px 16px",
            background: "#f0f9ff",
            borderRadius: "10px",
            fontSize: "0.8rem",
            color: "#0369a1",
            lineHeight: 1.6,
          }}
        >
          <strong>Akun default admin:</strong><br />
          Jika belum ada akun, silakan daftar terlebih dahulu. Role default adalah <em>viewer</em>.
        </div>
      </div>
    </main>
  );
}
