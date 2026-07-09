# Laporan Akhir Tugas Mingguan (Pengganti Kehadiran 30 Mei)
**Mata Kuliah:** Pemrograman Web Dinamis (Integrasi Backend & Frontend)

---

## Kesimpulan Akhir Proyek
Secara keseluruhan, tugas ini berfokus pada penguatan keamanan aplikasi full-stack (Express.js & Next.js) melalui penerapan sistem otorisasi berbasis peran (Role-Based Access Control) serta fitur manajemen akun yang aman dan fungsional. 

Berikut adalah penjabaran kesimpulan dari setiap modul yang telah berhasil diimplementasikan:

### 1. Pertemuan 14: Role Authorization (Otorisasi Berbasis Peran)
Sistem sekarang memiliki batasan hak akses yang ketat menggunakan JWT dan middleware otorisasi:
- **Middleware `allowRoles`**: Telah dibuat di backend untuk memfilter akses ke *endpoint* berdasarkan peran (`admin`, `operator`, `viewer`).
- **Proteksi Endpoint Mahasiswa**: 
  - `GET` (Melihat data) dapat diakses oleh semua *role*.
  - `POST` & `PUT` (Menambah dan mengedit) hanya dapat diakses oleh `admin` dan `operator`.
  - `DELETE` (Menghapus data) dikunci eksklusif hanya untuk `admin`.
- **Penyesuaian Frontend (UI/UX)**: Antarmuka di sisi *client* (halaman Dashboard Mahasiswa) telah dirancang untuk merespons peran pengguna secara dinamis. Tombol aksi (Tambah, Edit, Hapus) disembunyikan jika pengguna yang *login* tidak memiliki hak akses, mencegah kebingungan dan akses ilegal.

### 2. Pertemuan 15: CRUD User & Fitur Reset Password
Modul ini menambahkan kapabilitas *User Management* untuk administrator sistem:
- **Endpoint Terlindungi**: Seluruh *endpoint* `/api/users` dikunci secara ketat dan hanya dapat diakses oleh *role* `admin`.
- **Keamanan Data**: *Query* database untuk membaca daftar pengguna diformat secara khusus agar **tidak pernah** mengirimkan *field password* (maupun *hash*-nya) ke sisi frontend.
- **Halaman Khusus Admin (`/users`)**: Telah dibangun halaman manajemen di frontend yang dilengkapi *Auth Guard*, di mana pengguna selain `admin` akan langsung dialihkan. Halaman ini memiliki fungsionalitas CRUD secara penuh (Tambah, Baca, Perbarui, Hapus).
- **Reset Password oleh Admin**: Fitur yang memungkinkan *admin* mengatur ulang sandi pengguna lain menjadi *temporary password* (acak) yang dapat disalin dan diberikan kepada pengguna yang bersangkutan.

### 3. Fitur Tambahan & Penyempurnaan (*Enhancements*)
Sebagai nilai tambah dan penyempurnaan, beberapa fitur khusus juga telah diimplementasikan:
- **Lupa Password Mandiri (Bypass SMTP)**: Form Lupa Password telah diintegrasikan langsung pada halaman Login. Pengguna cukup memasukkan email dan kata sandi baru untuk mengatur ulang kata sandi mereka secara instan tanpa perlu repot melewati verifikasi email/SMTP.
- **Desain Antarmuka Minimalis**: Seluruh elemen antarmuka (UI) telah dibersihkan dari *emoticon/emoji* untuk mencapai estetika *clean* dan minimalis. Desain ini memastikan aplikasi terlihat profesional, rapi, dan nyaman diakses oleh seluruh kalangan dan generasi pengguna.
- **Persiapan Infrastruktur Email (Opsional)**: Meskipun fitur Lupa Password dilakukan secara instan, konfigurasi dasar `nodemailer` dan rancangan token berbasis SMTP tetap disiapkan di sisi backend (`config/mail.ts`) untuk skalabilitas dan peralihan ke _production_ di masa mendatang jika dibutuhkan.

---

### Hasil Uji Coba (Testing)
Seluruh fitur yang disebutkan di atas telah melalui proses uji coba lokal dan berjalan dengan lancar tanpa ada *error*. Aplikasi kini siap digunakan (siap di-*deploy*) dengan standar keamanan otentikasi dan otorisasi yang sangat memadai untuk sebuah aplikasi manajemen data berbasis web.
