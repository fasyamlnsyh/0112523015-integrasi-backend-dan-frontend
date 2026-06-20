import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
      <div className="welcome-card card">
        <h1>Integrasi Next.js & Express.js</h1>
        <p>
          Aplikasi dashboard praktikum terintegrasi untuk mengelola data Mahasiswa dan Katalog Produk menggunakan REST API + MySQL.
        </p>

        <div style={{ display: "flex", gap: "20px", marginTop: "16px", width: "100%", maxWidth: "540px" }}>
          <Link href="/mahasiswa" style={{ flex: 1 }}>
            <div className="card" style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 20px", gap: "16px", border: "1px solid var(--border)", background: "#fcfdfe", height: "100%" }}>
              <div style={{ padding: "12px", borderRadius: "12px", background: "rgba(99, 102, 241, 0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                </svg>
              </div>
              <span className="font-semibold" style={{ fontSize: "1.15rem" }}>Data Mahasiswa</span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center" }}>Kelola data akademik mahasiswa dan angkatan.</span>
              <button className="btn-primary" style={{ width: "100%", padding: "10px 16px", fontSize: "0.85rem", marginTop: "auto" }}>Buka</button>
            </div>
          </Link>

          <Link href="/produk" style={{ flex: 1 }}>
            <div className="card" style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 20px", gap: "16px", border: "1px solid var(--border)", background: "#fcfdfe", height: "100%" }}>
              <div style={{ padding: "12px", borderRadius: "12px", background: "rgba(99, 102, 241, 0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <span className="font-semibold" style={{ fontSize: "1.15rem" }}>Data Produk</span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center" }}>Kelola inventori, harga, dan stok produk.</span>
              <button className="btn-secondary" style={{ width: "100%", padding: "10px 16px", fontSize: "0.85rem", marginTop: "auto" }}>Buka</button>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
