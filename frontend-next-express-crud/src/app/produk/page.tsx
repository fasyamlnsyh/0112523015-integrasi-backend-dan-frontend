"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProdukForm from "@/components/ProdukForm";
import ProdukTable from "@/components/ProdukTable";
import {
  createProduk,
  deleteProduk,
  getProduk,
  Produk,
  ProdukInput,
  updateProduk,
} from "@/lib/apiProduk";

export default function ProdukPage() {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [selectedProduk, setSelectedProduk] = useState<Produk | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadProduk = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProduk();
      setProduk(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal terhubung ke API backend. Pastikan server backend sudah dijalankan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduk();
  }, []);

  const handleSubmit = async (payload: ProdukInput) => {
    try {
      setMessage("");
      setError("");

      if (selectedProduk) {
        await updateProduk(selectedProduk.id, payload);
        setMessage("Data produk berhasil diperbarui");
      } else {
        await createProduk(payload);
        setMessage("Data produk berhasil ditambahkan");
      }

      setSelectedProduk(null);
      await loadProduk();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Yakin ingin menghapus data ini?");
    if (!confirmed) return;

    try {
      setMessage("");
      setError("");
      await deleteProduk(id);
      setMessage("Data produk berhasil dihapus");
      await loadProduk();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus data");
    }
  };

  // Search filter
  const filteredProduk = produk.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="container">
      <div className="header">
        <div>
          <h1>CRUD Data Produk</h1>
          <p>Kelola data katalog produk terintegrasi dengan REST API backend.</p>
        </div>

        <Link href="/">
          <button className="btn-secondary">Kembali ke Dashboard</button>
        </Link>
      </div>

      {message && (
        <div className="message success">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          {message}
        </div>
      )}
      {error && (
        <div className="message error">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
        <ProdukForm
          selectedProduk={selectedProduk}
          onSubmit={handleSubmit}
          onCancelEdit={() => setSelectedProduk(null)}
        />

        <section className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
            <h2 style={{ margin: 0 }}>Daftar Produk</h2>
            
            {/* Search bar input */}
            <div style={{ position: "relative", flex: 1, maxWidth: "320px", marginLeft: "auto" }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama produk..."
                style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: "8px", border: "1px solid var(--border)" }}
              />
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", display: "flex", alignItems: "center" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
            </div>
          </div>

          {loading ? (
            <div className="loading-wrapper">
              <div className="spinner"></div>
              <p>Memuat data...</p>
            </div>
          ) : (
            <ProdukTable
              produk={filteredProduk}
              onEdit={setSelectedProduk}
              onDelete={handleDelete}
            />
          )}
        </section>
      </div>
    </main>
  );
}
