"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MahasiswaForm from "@/components/MahasiswaForm";
import MahasiswaTable from "@/components/MahasiswaTable";

import {
  createMahasiswa,
  deleteMahasiswa,
  getMahasiswa,
  Mahasiswa,
  MahasiswaInput,
  updateMahasiswa,
} from "@/lib/api";

import { getAllProdi, Prodi } from "@/lib/apiProdi";
import { getUser, logout } from "@/lib/auth";

export default function MahasiswaPage() {
  const router = useRouter();

  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [prodiList, setProdiList] = useState<Prodi[]>([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa | null>(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterProdi, setFilterProdi] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  // =========================
  // AUTH GUARD & ROLE
  // =========================
  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setRole(user.role);
    setUserName(user.name || user.email);
  }, [router]);

  // =========================
  // LOAD DATA
  // =========================
  const loadMahasiswa = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getMahasiswa({
        search,
        prodi_id: filterProdi,
        page,
        limit: 10,
      });
      setMahasiswa(result.data);
      setTotalPage(result.meta.totalPage || 1);
    } catch (err: any) {
      const msg = err?.message || "";
      if (msg.toLowerCase().includes("401") || msg.toLowerCase().includes("token")) {
        setError("Autentikasi gagal (seharusnya tidak terjadi).");
      } else {
        setError("Gagal memuat data mahasiswa. Pastikan backend berjalan.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadProdi = async () => {
    try {
      const data = await getAllProdi();
      setProdiList(data || []);
    } catch (err) {
      console.error("Gagal load prodi:", err);
      setProdiList([]);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadMahasiswa();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterProdi, page]);

  useEffect(() => {
    loadProdi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================
  // SUBMIT (CREATE / UPDATE)
  // =========================
  const handleSubmit = async (payload: MahasiswaInput) => {
    try {
      setMessage("");
      setError("");

      if (selectedMahasiswa) {
        await updateMahasiswa(selectedMahasiswa.id, payload);
        setMessage("✅ Data berhasil diupdate!");
      } else {
        await createMahasiswa(payload);
        setMessage("✅ Data mahasiswa berhasil ditambahkan!");
      }

      setSelectedMahasiswa(null);
      await loadMahasiswa();
    } catch (err: any) {
      setError(err?.message || "Gagal menyimpan data. Cek kembali inputan.");
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id: number) => {
    const ok = confirm("Yakin ingin menghapus data mahasiswa ini?");
    if (!ok) return;

    try {
      setMessage("");
      setError("");
      await deleteMahasiswa(id);
      setMessage("✅ Data berhasil dihapus!");
      await loadMahasiswa();
    } catch (err: any) {
      setError(err?.message || "Gagal menghapus data.");
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    logout();
  };

  // =========================
  // FILTER SEARCH
  // =========================
  // Client-side filter dihapus, sekarang menggunakan Server-side filter

  const canCreate = role === "admin" || role === "operator";
  const canEdit = role === "admin" || role === "operator";
  const canDelete = role === "admin";

  return (
    <main className="container">
      {/* HEADER */}
      <div className="header">
        <div>
          <h1>CRUD Data Mahasiswa</h1>
          <p>
            Halo, <strong>{userName}</strong> &mdash; Role:{" "}
            <span
              style={{
                background:
                  role === "admin"
                    ? "#fef3c7"
                    : role === "operator"
                    ? "#ede9fe"
                    : "#ecfdf5",
                color:
                  role === "admin"
                    ? "#92400e"
                    : role === "operator"
                    ? "#5b21b6"
                    : "#065f46",
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
          <a href="/">
            <button className="btn-secondary">🏠 Home</button>
          </a>
          <button className="btn-danger" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </div>

      {/* MESSAGES */}
      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}

      {/* FORM — hanya tampil jika admin/operator */}
      {canCreate && (
        <MahasiswaForm
          selectedMahasiswa={selectedMahasiswa}
          prodiList={prodiList}
          onSubmit={handleSubmit}
          onCancelEdit={() => setSelectedMahasiswa(null)}
        />
      )}

      {!canCreate && (
        <div
          className="card"
          style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}
        >
          ℹ️ Anda login sebagai <strong>{role}</strong>. Hanya dapat melihat data.
        </div>
      )}

      {/* TABLE + SEARCH */}
      <section className="card" style={{ marginTop: 24 }}>
        <div style={{ marginBottom: 16, display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0 }}>📋 Daftar Mahasiswa</h2>
          
          <div style={{ display: "flex", gap: "12px", flex: 1, minWidth: "300px", justifyContent: "flex-end" }}>
            <select
              value={filterProdi}
              onChange={(e) => {
                setFilterProdi(e.target.value);
                setPage(1); // Reset page on filter
              }}
              style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)", background: "#fff" }}
            >
              <option value="">-- Semua Prodi --</option>
              {prodiList.map((p) => (
                <option key={p.id} value={p.id}>{p.nama_prodi}</option>
              ))}
            </select>
            
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset page on search
              }}
              placeholder="🔍 Cari nama atau NIM..."
              style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)", minWidth: "200px" }}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-wrapper">
            <div className="spinner"></div>
            <p>Memuat data mahasiswa...</p>
          </div>
        ) : (
          <>
            <MahasiswaTable
              mahasiswa={mahasiswa}
              role={role}
              onEdit={(item) => canEdit && setSelectedMahasiswa(item)}
              onDelete={handleDelete}
            />
            
            {/* Pagination Controls */}
            {totalPage > 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "24px" }}>
                <button
                  className="btn-secondary"
                  style={{ padding: "8px 16px" }}
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  &laquo; Prev
                </button>
                <span style={{ fontWeight: 600 }}>
                  Halaman {page} dari {totalPage}
                </span>
                <button
                  className="btn-secondary"
                  style={{ padding: "8px 16px" }}
                  disabled={page === totalPage}
                  onClick={() => setPage(p => Math.min(totalPage, p + 1))}
                >
                  Next &raquo;
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}