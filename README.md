# 🎓 SIAP SMKN 1 Sorong — Presensi Terpadu & Academic Hub (Edisi Lomba 2026)

> **Sistem Informasi Akademik & Presensi Terpadu Berbasis Web untuk SMK Negeri 1 Sorong**  
> Dirancang khusus untuk penilaian Lomba Kejuruan / Web Technologies & Software Development (2026).  
> Repositori Resmi: [https://github.com/protofolioID/UI-Sekolah](https://github.com/protofolioID/UI-Sekolah)

---

## 🌟 Ringkasan Eksekutif & Latar Belakang Masalah

SMK Negeri 1 Sorong memiliki 54 rombongan belajar dengan ribuan peserta didik aktif. Kendala utama operasional sekolah meliputi:
1. **Presensi Manual Kertas Rentan Manipulasi**: Siswa sering menitip absen atau meninggalkan jam pelajaran kedua (bolos mapel).
2. **Ketiadaan Delegasi Wewenang**: Ketika sekretaris kelas berhalangan hadir atau sakit, lembar absensi sering tertunda atau tidak tercatat.
3. **Data Terisolasi**: Rekapitulasi bulanan memakan waktu berhari-hari oleh staf Tata Usaha.

**Solusi SIAP SMKN 1 Sorong:**  
Aplikasi web multi-peran (RBAC 7-level) dengan sinkronisasi database PostgreSQL Supabase real-time, perlindungan keamanan tingkat enterprise (*Row Level Security*), gamifikasi *attendance streak*, dan generator ekspor rekap resmi Excel (`.xlsx`) dalam sekali klik.

---

## 👨‍💻 Tim Pengembang (Developer Team)

Aplikasi ini dirancang dan dikembangkan untuk Lomba Kejuruan oleh tim siswa SMK Negeri 1 Sorong:

| No | Nama Pengembang | Kelas / Rombel | Fokus & Kontribusi Proyek |
| :-: | :--- | :--- | :--- |
| 1 | **Andhika Ivander Nathanael** | **XII DKV 1** | UI/UX Designer, Mobile-First Design System, & Frontend |
| 2 | **RAHMAD RIZAL FADILAH** | **XII TKJ 1** | Fullstack Engineer, Supabase Architecture, & Business Logic |
| 3 | **PRIMA ADI NUGRAHA SOLTIF** | **XII TKJ 1** | System Analyst, RLS Security Hardening, & Quality Assurance |

---

## 👥 Akun Uji Coba Lomba (100% Data Dummy Bersih — Zero PII Leak)

> [!IMPORTANT]
> **Seluruh akun pengujian menggunakan kata sandi tunggal:**  
> 🔑 **`Demo@2025`**  
> Di layar login, dewan juri cukup mengklik tombol **"🎯 Akun Uji"** di pojok kanan atas form untuk login instan dalam 1 klik.

| Peran | Username / Identifier | Nama Akun | Hak Akses & Tugas Pengujian Juri |
| :--- | :--- | :--- | :--- |
| **👑 Super Admin** | `superadmin_sorong` | Superadmin SIAP (Kepala Sekolah) | Meninjau audit keamanan, status 54 rombel, radar kehadiran sekolah, & reset password. |
| **🏢 Tata Usaha** | `tu` | Operator TU SMKN 1 | Broadcast pengumuman sekolah, manajemen jadwal, dan ekspor rekap Excel (`.xlsx`). |
| **👨‍🏫 Wali Kelas** | `budihartono` | Budi Hartono, S.Kom. | Wali Kelas XII RPL 1: validasi presensi harian & memantau radar siswa terlambat. |
| **👨‍🏫 Wali Kelas** | `iwansetiawan` | Iwan Setiawan, S.Kom. | Wali Kelas XII TKJ 1: monitoring rekapitulasi kehadiran kelas jaringan. |
| **👩‍🏫 Guru Mapel** | `dewilestari` | Dewi Lestari, S.Pd. | Guru Produktif RPL: validasi presensi per jam pelajaran (Lab RPL 2). |
| **👩‍🏫 Guru Mapel** | `sitinurhaliza` | Siti Nurhaliza, M.Pd. | Guru Produktif TKJ: mencatat presensi jam mata pelajaran & deteksi siswa bolos. |
| **📝 Sekretaris** | `s0071234006` | Dimas Setiawan (XII RPL 1) | Petugas absensi harian kelas XII RPL 1: roll-call pagi, upload surat dokter, & draf offline. |
| **🎓 Siswa Biasa** | `s0071234001` | Cindy Laura (XII RPL 1) | Siswa: Kartu Pelajar Digital, riwayat kehadiran, pengumuman sekolah, & api streak hadir. |
| **🎓 Siswa Biasa** | `s0075678001` | Fajar Ramadhan (XII TKJ 1) | Siswa umum kelas XII TKJ 1. |

---

## 🚀 Fitur Unggulan Sistem

### 1. Sistem Delegasi Wewenang Presensi Otomatis (4-Step Hierarchy)
Jika petugas pengabsen utama tidak hadir, sistem secara otomatis mengalihkan hak input roll-call:
```
[Step 1: Sekretaris Kelas] ──(Jika Berhalangan)──► [Step 2: Ketua Kelas]
                                                              │
[Step 4: Siswa Piket Harian] ◄──(Jika Berhalangan)── [Step 3: Wakil Ketua Kelas]
```
Sistem menyertakan banner alert audit wewenang di bagian atas layar presensi yang menjelaskan siapa petugas sah hari ini dan alasan pendelegasiannya.

### 2. Multi-Tier Attendance Validation (Pagi & Jam Mapel)
- **Roll-call Pagi (07.15 WIT)**: Diinput oleh sekretaris / ketua kelas.
- **Validasi Jam Mapel (08.15 - 15.00 WIT)**: Guru mapel memverifikasi kehadiran fisik di laboratorium.
- **Deteksi Bolos Mapel**: Jika siswa hadir pagi namun tidak ada di lab saat jam kejuruan, sistem menandai badge **"Terdeteksi Bolos"** berwarna merah cabai dan mengirim sinyal peringatan ke guru piket.

### 3. Arsitektur Offline-First & Local Draft Persistence
Jika koneksi internet sekolah terputus, sekretaris kelas tetap dapat melakukan presensi. Data tersimpan aman di `localStorage` terenkripsi dan dapat disinkronkan ke Supabase saat sinyal kembali stabil.

### 4. Ekspor Rekapitulasi Berstandar Dinas Pendidikan (`.xlsx`)
Operator TU dan Kepala Sekolah dapat mengunduh rekap kehadiran bulanan dalam format Excel murni lengkap dengan kalkulasi persentase kehadiran `(Hadir / Hari Efektif * 100%)`.

### 5. Mode Gelap & Responsivitas Mobile-First
Desain terinspirasi antarmuka dompet digital modern (DANA-style) dengan touch target minimum 44px, palet warna berstandar WCAG AAA, dan mode gelap otomatis yang ramah baterai smartphone siswa.

---

## 🛡️ Jaminan Keamanan & Privasi Data (Competition Security Checklist)

- [x] **Zero Real PII Leak**: Tidak ada NIK, nomor ponsel pribadi, atau data sensitif guru/siswa nyata di repositori publik. Seluruh nama dan NISN adalah fiktif (`0071234xxx` dan `0075678xxx`).
- [x] **PostgreSQL Row Level Security (RLS)**: Enforce hak akses langsung pada level database engine Supabase. Siswa tidak dapat memanipulasi draf kelas lain melalui API.
- [x] **Zero Hardcoded Secrets**: Kredensial service-role terisolasi ketat. Frontend hanya menggunakan Supabase Anon Key yang aman untuk konsumsi publik.
- [x] **Server-Side Password Hashing**: Kata sandi dienkripsi menggunakan algoritma bcrypt/Argon2 via Supabase GoTrue Auth.

---

## 🛠️ Stack Teknologi

- **Frontend Framework**: React 18, TypeScript, Vite
- **Styling & UI**: Tailwind CSS, Material Symbols Outlined, Canvas Confetti
- **Motion & Micro-interactions**: Motion (Framer Motion v11 engine)
- **Backend & Database**: Supabase (PostgreSQL 15), GoTrue Auth, Realtime Engine
- **Office / Spreadsheet Generator**: SheetJS / XLSX
- **Deployment Platform**: Vercel Edge Network

---

## 💻 Cara Menjalankan Proyek di Komputer Lokal

```bash
# 1. Clone repositori
git clone https://github.com/protofolioID/UI-Sekolah.git
cd UI-Sekolah

# 2. Pasang dependensi
npm install

# 3. Buat file konfigurasi lingkungan (.env)
cp .env.example .env

# 4. Jalankan server lokal
npm run dev
```
Aplikasi akan aktif di `http://localhost:5173`.

---

## 🚀 Panduan Deployment ke Vercel

Proyek ini telah dikonfigurasi dan diverifikasi siap deploy ke Vercel dalam 1 langkah:

1. Buka dashboard [Vercel](https://vercel.com) dan klik **Add New Project**.
2. Hubungkan akun GitHub dan pilih repositori `protofolioID/UI-Sekolah`.
3. Di bagian **Environment Variables**, tambahkan:
   - `VITE_SUPABASE_URL`: URL project Supabase Anda
   - `VITE_SUPABASE_ANON_KEY`: Anon key publik Supabase Anda
4. Klik **Deploy**. Selesai dalam ~30 detik!

---

## 🤖 Transparansi Penggunaan AI (Golden Rule Compliance)

Pengembangan sistem ini mengikuti kaidah integritas akademik & etika rekayasa perangkat lunak:
- **Google Antigravity & AI Pair Programming**: Digunakan sebagai asisten riset arsitektur basis data, audit keamanan RLS, refactoring performa, dan validasi rubrik penilaian lomba.
- **Rancangan & Visi Pengembang**: Desain antarmuka, pemodelan sistem hierarki delegasi 4-step, logika presensi jam kejuruan, dan integrasi kurikulum SMKN 1 Sorong dirancang secara orisinal oleh tim pengembang.
