# REQUIREMENTS-LOMBA.md — Spesifikasi & Standar Kompetensi

> Disusun berdasarkan silabus dan standar **Starter Kit Lomba Aplikasi Web Berbantuan AI**  
> SMK Negeri 1 Sorong · Pembina: M. Dwiyanto Tobi, ST., MT.

---

## 1. Rubrik Penilaian Lomba (Bobot 100%)

| Kategori | Bobot | Aspek Utama yang Dinilai Juri | Bukti Pemenuhan Aplikasi |
|---|---|---|---|
| **Inovasi & Manfaat** | **20%** | Solusi masalah nyata di SMKN 1 Sorong, efisiensi waktu presensi, akurasi data kehadiran. | Menggantikan absensi kertas manual & grup WA menjadi verifikasi real-time terpusat untuk siswa, guru mapel, wali kelas, guru piket, dan tata usaha. |
| **Eksekusi Teknis** | **30%** | Kerapian arsitektur kode, integrasi database Supabase (PostgreSQL), TypeScript, minim bug. | React 18 + Vite + TypeScript + Tailwind CSS + Supabase REST API & Realtime. Arsitektur modular per peran. |
| **Desain Antarmuka (UI/UX)** | **20%** | Mobile-first (responsif 360px), hierarki visual jelas, micro-interactions, status loading/toast. | Desain modern konsisten palette SMKN 1, bottom navigation mobile, status badge, modal konfirmasi, feedback toast. |
| **Keamanan & Kualitas Kode** | **15%** | Lolos uji SQL Injection, XSS, Row Level Security (RLS), RBAC sisi server, tidak ada data bocor. | Full RLS di Supabase, pemisahan role server-side, sanitasi input, tidak ada kredensial hardcoded di repo. |
| **Dokumentasi & Presentasi** | **15%** | Demo terstruktur 10 menit, kejelasan penjelasan kode tanpa ketergantungan AI, PRD lengkap. | PRD.md, petunjuk testing, diagram alur, panduan instalasi, dan video/presentasi demonstrasi. |

---

## 2. Lima Aturan Emas (The 5 Golden Rules)

1. **Siswa Pegang Kemudi, AI Membantu**: Seluruh arsitektur, relasi database, dan fungsi kode dapat dijelaskan alurnya secara runtut di depan dewan juri.
2. **Satu Prompt, Satu Fitur**: Pengembangan dilakukan modular per komponen fitur, bukan satu prompt raksasa.
3. **Commit Setiap Fitur yang Sudah Berjalan**: Setiap unit fitur yang lolos pengujian langsung di-commit ke Git secara atomik.
4. **Zero Personal Data Leak (Wajib Data Dummy Fiktif)**:
   - Dilarang keras menggunakan NISN, NIP, atau nomor kontak asli warga SMKN 1 Sorong di repository publik GitHub.
   - Wajib menggunakan data contoh/dummy fiktif (2 rombel kelas, masing-masing 10 siswa dummy dan 2 guru dummy).
5. **Transparansi Penggunaan AI**: Mencantumkan daftar alat bantu AI yang digunakan beserta peruntukannya secara jujur di `README.md`.

---

## 3. Checklist Keamanan Wajib (Zero-Defect Security Gate)

- [x] **Password Protection**: Tidak ada password disimpan dalam plain text (menggunakan Supabase GoTrue Bcrypt/Argon2).
- [x] **Row Level Security (RLS)**: Semua tabel database (`profiles`, `kelas`, `mapel`, `jadwal`, `absen_harian`, `absen_mapel`, `streak`) wajib mengaktifkan RLS.
- [x] **Anti-Privilege Escalation**: Siswa tidak dapat memanipulasi kolom `role` atau `is_sekretaris` melalui API injection.
- [x] **Anti-Tampering Presensi**: Presensi mapel (`absen_mapel`) dan presensi harian (`absen_harian`) diverifikasi hak aksesnya di server/database PostgreSQL, bukan sekadar menyembunyikan tombol UI.
- [x] **No Leaked Credentials in Source**: Menghapus tombol cepat demo yang memuat kata sandi di kode produksi.
- [x] **Clean .gitignore**: File `.env`, `.env.local`, dan secret keys tidak masuk ke Git.

---

## 4. Struktur Dataset Standar (Mockup Lomba)

Untuk memenuhi aturan kebersihan data privasi lomba, database dan sistem diinisialisasi dengan struktur:
- **Total Kelas**: 2 Rombel (`XII RPL 1` dan `XII TKJ 1`)
- **Total Siswa**: 20 Siswa Dummy (10 siswa per kelas, 1 sekretaris per kelas)
- **Total Guru**: 4 Guru Dummy (2 guru per kelas, 1 bertindak sebagai Wali Kelas)
- **Total Administrator**: 1 Akun Tata Usaha / Operator (`tu@smkn1sorong.sch.id`)
- **Password Default Akun Uji Coba**: `Demo@2025`
