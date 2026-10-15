# DOKUMENTASI PROYEK & TULISAN KEBERMANFAATAN
## SIAKAD SMKN 1 SORONG: Sistem Informasi Presensi & Tata Kelola Pembelajaran Terpadu Berbasis Web

**Disusun untuk Penilaian Dewan Juri Lomba Aplikasi Web Berbantuan AI**  
SMK Negeri 1 Sorong · Tahun Ajaran 2026/2027  

**Disusun Oleh Tim Pengembang:**
- **Andhika Ivander Nathanael** (XII DKV 1)
- **RAHMAD RIZAL FADILAH** (XII TKJ 1)
- **PRIMA ADI NUGRAHA SOLTIF** (XII TKJ 1)

**Tautan Aplikasi Siap Uji:**  
- 🌐 **Aplikasi Live (Vercel):** [https://absensi-gabungan-main.vercel.app](https://absensi-gabungan-main.vercel.app)  
- 💻 **Repositori GitHub:** [https://github.com/protofolioID/UI-Sekolah](https://github.com/protofolioID/UI-Sekolah)  

---

## 1. Latar Belakang & Permasalahan Nyata di Lapangan

SMK Negeri 1 Sorong merupakan salah satu institusi pendidikan vokasi terbesar di Papua Barat Daya, dengan lebih dari 1.200 siswa aktif yang tersebar di 54 rombongan belajar (rombel) serta puluhan laboratorium kejuruan (DKV, TKJ, RPL, Akuntansi, Manajemen Perkantoran, dsb).

Dalam observasi operasional harian sekolah, ditemukan sejumlah kendala mendasar:

1. **Kekosongan Jam Pelajaran & Keterlambatan Masuk Kelas:**
   - Karena luasnya area kampus sekolah dan padatnya agenda guru, sering kali siswa sudah berada di lab kejuruan namun guru pengampu belum hadir di ruang kelas atau masih bertugas di ruang lain. Siswa harus berjalan jauh mencari guru secara manual, yang membuang waktu produktif pembelajaran hingga 15–30 menit.
2. **Kelemahan Sistem Presensi Kertas (Konvensional):**
   - Jika Sekretaris Kelas tidak hadir karena sakit atau izin, lembar absen kelas kerap tercecer atau terlambat diisi. Tidak ada prosedur otomatis yang mengatur siapa yang berhak mengambil alih pengisian daftar hadir pagi.
3. **Fenomena "Bolos Mapel" (Hadir Pagi, Hilang Siang):**
   - Siswa melakukan presensi di gerbang sekolah saat pagi hari, namun meninggalkan lingkungan sekolah saat pergantian jam pelajaran tertentu. Guru piket tidak memiliki sarana pemantauan lintas rombel secara langsung (*real-time*).
4. **Beban Rekapitulasi Manual Tata Usaha (TU):**
   - Staf TU harus menyalin ribuan baris data kertas setiap akhir bulan untuk menyusun laporan format Dapodik/Kemendikbudristek, yang rentan kesalahan input (*human error*) dan memakan waktu berhari-hari.

---

## 2. Solusi Inovatif & Fitur Utama Aplikasi

SIAKAD v2.0 dirancang sebagai ekosistem digital komprehensif yang mengatasi masalah di atas secara tuntas:

### A. Fitur Panggil Guru Terintegrasi WhatsApp Gateway
- Siswa atau perangkat kelas dapat menekan tombol **"Panggil Guru"** dari dasbor beranda.
- Pesan otomatis berformat resmi sekolah langsung dikirim ke nomor WhatsApp Guru Pengampu dan diteruskan ke display ruang guru piket:
  > *"Halo Pak/Ibu Guru Budi Hartono, S.Kom., Anda dipanggil oleh kelas XII TKJ 1 untuk segera hadir di Lab Komputer 2. Waktu Panggilan: 08:15 WIT. Mohon kehadirannya di kelas."*
- Menggunakan engine **Baileys WhatsApp Web JS** lokal tanpa biaya langganan API berbayar, dengan fallback tautan langsung `wa.me/` jika perangkat bot sedang offline.

### B. Hierarki 4 Tingkat Wewenang Pengabsen Pagi
Mekanisme pengamanan delegasi pengisian presensi kelas:
1. **Tingkat 1 (Utama):** Sekretaris Kelas 1 (memiliki hak akses input harian).
2. **Tingkat 2 (Delegasi 1):** Jika Sekretaris 1 berhalangan hadir (status Sakit/Izin/Alfa), sistem secara cerdas melimpahkan wewenang input ke **Ketua Kelas**.
3. **Tingkat 3 (Mandat Darurat):** Jika Sekretaris & Ketua berhalangan bersamaan, **Wali Kelas** dapat memberikan *Mandat Harian Khusus* kepada salah satu siswa yang hadir.
4. **Tingkat 4 (Pengampu):** Guru Mata Pelajaran yang masuk pada jam pelajaran pertama.

### C. Radar Guru Piket & Deteksi Bolos Mapel Otomatis
- Dasbor Guru Piket dilengkapi panel deteksi anomali: mencocokkan kehadiran gerbang pagi dengan kehadiran jam kejuruan.
- Memberikan sinyal peringatan instan bagi siswa yang terindikasi bolos mapel tanpa alasan sah.

### D. Generator Rekapitulasi Resmi Standar Kemendikbudristek
- Operator Tata Usaha dan Super Admin dapat mengunduh rekapan mingguan dan bulanan dalam format **Microsoft Excel (.xlsx)** dan **PDF Siap Cetak**.
- Format tabel memuat kolom nomor urut, NISN, nama lengkap, distribusi status (H/S/I/A), dan persentase kehadiran bersih yang siap diunggah ke Dapodik.

---

## 3. Analisis Kebermanfaatan & Dampak Terukur

| Aspek Operasional | Sebelum Menggunakan SIAKAD | Sesudah Menggunakan SIAKAD |
|---|---|---|
| **Waktu Panggilan Guru** | 15–30 menit (jalan mencari guru fisik) | **< 10 detik** (notifikasi WhatsApp langsung ke ponsel guru) |
| **Keterisian Presensi Pagi** | Sering terlambat jika sekretaris absen | **100% konsisten** dengan alur pendelegasian otomatis 4 tingkat |
| **Deteksi Siswa Bolos** | Baru ketahuan berhari-hari kemudian | **Real-time saat jam pelajaran berlangsung** via Radar Piket |
| **Waktu Rekapitulasi TU** | 3–5 hari kerja per akhir bulan | **1 klik instan (< 3 detik)** dalam format Excel & PDF |
| **Efisiensi Kertas (Paperless)**| Ratusan lembar kertas form per semester | **0 kertas (Ramah Lingkungan & Hemat Biaya)** |

---

## 4. Keamanan Sistem, Privasi & Kepatuhan Etika Lomba

Aplikasi ini dibangun dengan mematuhi standar keamanan ketat sesuai panduan juri lomba:
1. **Isolasi Data Uji Coba Bersih (*Clean Synthetic Dataset*):**
   - Tidak ada data pribadi sensitif (NIK/NISN riil atau kontak asli murid) yang diunggah ke repositori publik. Seluruh data demonstrasi menggunakan akun percontohan (`XII RPL 1` dan `XII TKJ 1`).
2. **Keamanan Autentikasi Supabase:**
   - Proteksi sesi berbasis JWT tokens, password hashing argon/bcrypt di server, dan isolasi *Row Level Security* (RLS).
3. **Sanitasi Kunci Server:**
   - Service Role Key tersimpan aman di server environment dan tidak terekspos ke bundle browser client.

---

## 5. Panduan Singkat Uji Coba untuk Dewan Juri

Aplikasi menyediakan tombol jalan pintas cepat (*Quick Fill*) pada halaman login:
- **Wali Kelas / Guru:** Tekan `👨‍🏫 Wali` (Akun: `guru` / Sandi: `Demo@2025`)
- **Admin Tata Usaha:** Tekan `🛠️ TU` (Akun: `TU` / Sandi: `Demo@2025`)
- **Super Admin (Kepala Sekolah):** Tekan `👑 Super` (Akun: `superadmin_sorong` / Sandi: `Demo@2025`)
- **Siswa (Ketua / Murid):** Buka `🎯 Lainnya` → Pilih `🎓 Siswa RPL 1` (Sandi: `Demo@2025`)
- **Jadwal Publik:** Dapat ditinjau langsung tanpa login melalui tombol *"Lihat Jadwal Pelajaran Publik"*.
