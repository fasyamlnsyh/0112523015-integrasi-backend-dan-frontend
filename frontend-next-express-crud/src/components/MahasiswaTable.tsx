"use client";

import { Mahasiswa } from "@/lib/api";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

type Props = {
  mahasiswa: Mahasiswa[];
  role: string | null;
  onEdit: (item: Mahasiswa) => void;
  onDelete: (id: number) => Promise<void>;
};

export default function MahasiswaTable({ mahasiswa, role, onEdit, onDelete }: Props) {
  const canEdit = role === "admin" || role === "operator";
  const canDelete = role === "admin";

  if (mahasiswa.length === 0) {
    return <p className="empty-message">Belum ada data mahasiswa.</p>;
  }

  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Foto</th>
            <th>NIM</th>
            <th>Nama</th>
            <th>Prodi</th>
            <th>Angkatan</th>
            {(canEdit || canDelete) && <th>Aksi</th>}
          </tr>
        </thead>

        <tbody>
          {mahasiswa.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>
                <img
                  src={
                    item.foto
                      ? `${BACKEND_URL}/uploads/mahasiswa/${item.foto}`
                      : "/avatar-placeholder.png"
                  }
                  alt={item.nama}
                  width={44}
                  height={44}
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid var(--border)",
                    display: "block",
                  }}
                />
              </td>
              <td>{item.nim}</td>
              <td className="font-semibold">{item.nama}</td>
              <td>{item.nama_prodi}</td>
              <td>{item.angkatan}</td>
              {(canEdit || canDelete) && (
                <td>
                  <div className="actions">
                    {canEdit && (
                      <button className="btn-secondary" onClick={() => onEdit(item)}>
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button className="btn-danger" onClick={() => onDelete(item.id)}>
                        Hapus
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
