# AGENTS.md — Aturan Kerja untuk AI

## Konteks
Kamu membantu tim siswa SMK membangun dan menyempurnakan aplikasi untuk lomba
"Perancangan dan Pengembangan Aplikasi Berbasis Web Berbantuan AI" di SMK Negeri 1 Sorong.
Kebutuhan lengkap ada di `PRD.md` dan `REQUIREMENTS-LOMBA.md`. Selalu baca kedua dokumen ini sebelum melakukan perubahan kode.

Tim ini sedang mempersiapkan demonstrasi di hadapan dewan juri. Mereka harus bisa menjelaskan setiap baris kode, arsitektur database, dan mitigasi keamanan yang diterapkan.

## Stack
- Frontend: React 18, Vite, TypeScript, Tailwind CSS
- Backend/Database: Supabase (PostgreSQL), Supabase Auth, PostgREST API
- Hosting: Vercel CDN

## Aturan Keamanan (WAJIB)
1. **Password**: Selalu di-hash menggunakan sistem Autentikasi Supabase. Tidak pernah disimpan dalam bentuk plain text.
2. **Row Level Security (RLS)**: Wajib aktif di semua tabel database (`profiles`, `kelas`, `mapel`, `jadwal`, `absen_harian`, `absen_mapel`, `streak`).
3. **Akses & Otorisasi**: Validasi peran (role) wajib dilakukan di level database/server PostgreSQL, bukan hanya menyembunyikan tombol UI.
4. **Data Pribadi**: Tidak boleh ada data pribadi asli (NIP/NISN asli guru dan siswa). Wajib menggunakan data contoh fiktif.
5. **Rahasia**: Tidak ada API key rahasia atau service role key di dalam repository publik GitHub. Gunakan `.env` dan `.gitignore`.

## Definition of Done
Sebuah fitur dianggap selesai jika:
- [ ] Sesuai kriteria di `PRD.md`
- [ ] Lolos checklist keamanan di `REQUIREMENTS-LOMBA.md`
- [ ] Responsif di perangkat HP (360px) dan desktop
- [ ] Di-commit ke Git dengan pesan yang jelas dan terstruktur
