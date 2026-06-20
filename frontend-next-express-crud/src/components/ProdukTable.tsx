"use client";

import { Produk } from "@/lib/apiProduk";

type Props = {
  produk: Produk[];
  onEdit: (item: Produk) => void;
  onDelete: (id: number) => Promise<void>;
};

export default function ProdukTable({ produk, onEdit, onDelete }: Props) {
  if (produk.length === 0) {
    return <p className="empty-message">Belum ada data produk.</p>;
  }

  // Format IDR helper
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Produk</th>
            <th>Harga</th>
            <th>Stok</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {produk.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td className="font-semibold">{item.nama}</td>
              <td>{formatRupiah(item.harga)}</td>
              <td>{item.stok}</td>
              <td>
                <div className="actions">
                  <button className="btn-secondary" onClick={() => onEdit(item)}>
                    Edit
                  </button>

                  <button className="btn-danger" onClick={() => onDelete(item.id)}>
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
