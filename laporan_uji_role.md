# Laporan Singkat Hasil Uji Endpoint (Role Authorization)

## 1. Akun Admin (`admin@kampus.ac.id`)
- **GET /api/mahasiswa**: Berhasil (200 OK). Dapat melihat daftar mahasiswa.
- **POST /api/mahasiswa**: Berhasil (201 Created). Dapat menambah data mahasiswa baru, termasuk unggah foto.
- **PUT /api/mahasiswa/:id**: Berhasil (200 OK). Dapat mengubah data mahasiswa.
- **DELETE /api/mahasiswa/:id**: Berhasil (200 OK). Dapat menghapus data mahasiswa.
- **Frontend UI**: Seluruh tombol (Tambah Mahasiswa, Edit, Hapus) **tampil** dan dapat digunakan.

## 2. Akun Operator (`operator@kampus.ac.id`)
- **GET /api/mahasiswa**: Berhasil (200 OK). Dapat melihat daftar mahasiswa.
- **POST /api/mahasiswa**: Berhasil (201 Created). Dapat menambah data mahasiswa.
- **PUT /api/mahasiswa/:id**: Berhasil (200 OK). Dapat mengubah data mahasiswa.
- **DELETE /api/mahasiswa/:id**: **Gagal (403 Forbidden)**. Ditolak oleh middleware karena operator tidak memiliki izin hapus.
- **Frontend UI**: Tombol "Tambah Mahasiswa" dan "Edit" **tampil**. Tombol "Hapus" **disembunyikan**.

## 3. Akun Viewer (`viewer@kampus.ac.id`)
- **GET /api/mahasiswa**: Berhasil (200 OK). Dapat melihat daftar mahasiswa.
- **POST /api/mahasiswa**: **Gagal (403 Forbidden)**. Ditolak oleh middleware.
- **PUT /api/mahasiswa/:id**: **Gagal (403 Forbidden)**. Ditolak oleh middleware.
- **DELETE /api/mahasiswa/:id**: **Gagal (403 Forbidden)**. Ditolak oleh middleware.
- **Frontend UI**: Seluruh form input, tombol tambah, edit, dan hapus **disembunyikan**. Hanya menampilkan pesan informatif bahwa akun berstatus viewer.

---
**Kesimpulan**: Middleware `allowRoles` berhasil membatasi akses endpoint secara ketat di sisi backend (API). Pada sisi frontend, antarmuka pengguna berhasil merespons role dengan menyembunyikan fitur-fitur yang tidak memiliki akses otorisasi, sehingga memberikan _user experience_ yang aman dan sesuai.
