"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Mahasiswa, MahasiswaInput } from "@/lib/api";
import { Prodi } from "@/lib/apiProdi";

type Props = {
  selectedMahasiswa: Mahasiswa | null;
  prodiList: Prodi[];
  onSubmit: (payload: MahasiswaInput) => Promise<void>;
  onCancelEdit: () => void;
};

const initialForm: MahasiswaInput = {
  nim: "",
  nama: "",
  prodi_id: 0,
  angkatan: new Date().getFullYear(),
  foto: null,
};

export default function MahasiswaForm({
  selectedMahasiswa,
  prodiList,
  onSubmit,
  onCancelEdit,
}: Props) {
  const [form, setForm] = useState<MahasiswaInput>(initialForm);
  const [loading, setLoading] = useState(false);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    if (selectedMahasiswa) {
      setForm({
        nim: selectedMahasiswa.nim,
        nama: selectedMahasiswa.nama,
        prodi_id: selectedMahasiswa.prodi_id,
        angkatan: selectedMahasiswa.angkatan,
        foto: null,
      });
      setFotoPreview(
        selectedMahasiswa.foto
          ? `${BACKEND_URL}/uploads/mahasiswa/${selectedMahasiswa.foto}`
          : null
      );
    } else {
      setForm(initialForm);
      setFotoPreview(null);
    }
  }, [selectedMahasiswa]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm({ ...form, foto: file });
    if (file) {
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
      setForm(initialForm);
      setFotoPreview(null);
      if (fileRef.current) fileRef.current.value = "";
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>{selectedMahasiswa ? "Edit Mahasiswa" : "Tambah Mahasiswa"}</h2>

      <div className="grid">
        <div className="form-group">
          <label htmlFor="nim">NIM</label>
          <input
            id="nim"
            value={form.nim}
            onChange={(e) => setForm({ ...form, nim: e.target.value })}
            placeholder="Contoh: 2201001"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="nama">Nama</label>
          <input
            id="nama"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            placeholder="Nama mahasiswa"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="prodi_id">Program Studi</label>
          <select
            id="prodi_id"
            value={form.prodi_id}
            onChange={(e) => setForm({ ...form, prodi_id: Number(e.target.value) })}
            required
            style={{
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "12px 16px",
              fontSize: "0.95rem",
              fontFamily: "inherit",
              background: "#fdfdfd",
              width: "100%",
            }}
          >
            <option value={0} disabled>-- Pilih Prodi --</option>
            {prodiList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama_prodi}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="angkatan">Angkatan</label>
          <input
            id="angkatan"
            type="number"
            value={form.angkatan}
            onChange={(e) =>
              setForm({ ...form, angkatan: Number(e.target.value) })
            }
            min={2000}
            max={2099}
            required
          />
        </div>

        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="foto">Foto Mahasiswa (JPG/PNG/WEBP, maks 10MB)</label>
          <input
            id="foto"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            ref={fileRef}
            onChange={handleFileChange}
            style={{ padding: "8px 0" }}
          />
          {fotoPreview && (
            <img
              src={fotoPreview}
              alt="Preview foto"
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                objectFit: "cover",
                marginTop: 8,
                border: "2px solid var(--border)",
              }}
            />
          )}
        </div>
      </div>

      <div className="actions">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Menyimpan..." : selectedMahasiswa ? "Update" : "Simpan"}
        </button>

        {selectedMahasiswa && (
          <button type="button" className="btn-secondary" onClick={() => { onCancelEdit(); setFotoPreview(null); }}>
            Batal Edit
          </button>
        )}
      </div>
    </form>
  );
}
