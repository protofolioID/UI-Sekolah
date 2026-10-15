# SIAP SMKN 1 Sorong — Student Hub & Presensi Terpadu

> **Aplikasi Presensi Siswa & Student Hub SMKN 1 Sorong Berbantuan AI**  
> Dibuat untuk Lomba Pengembangan Aplikasi Web SMK Negeri 1 Sorong (September – Oktober 2026).

---

## 🚀 Fitur Utama
1. **Presensi Harian & Jam Mata Pelajaran (Multi-Tier)**:
   - Pencatatan draf oleh Sekretaris Kelas dengan sinkronisasi offline-first.
   - Verifikasi kehadiran real-time oleh Guru Mata Pelajaran (termasuk deteksi status Bolos Mapel).
   - Validasi resmi oleh Wali Kelas & Guru Piket.
2. **Jadwal Pelajaran Interaktif**:
   - Menampilkan jadwal harian aktif dan integrasi ruang laboratorium.
3. **Portal Admin & Rekapitulasi Otomatis**:
   - Ekspor laporan presensi resmi dalam format Excel (`.xlsx`) dalam satu klik.
4. **Indikator Streak Kehadiran**:
   - Gamifikasi kedisiplinan belajar siswa.
5. **Keamanan Berlapis (Defense in Depth)**:
   - Full PostgreSQL Row Level Security (RLS) di Supabase.
   - Perlindungan anti-privilege escalation & zero hardcoded credentials.

---

## 🛠️ Stack Teknologi
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS
- **Backend / Database:** Supabase Cloud (PostgreSQL 15), GoTrue Auth, PostgREST API
- **Deployment:** Vercel CDN

---

## 📦 Menjalankan Proyek Lokal

```bash
# 1. Clone repository
git clone https://github.com/Nathan/absensi-smkn1-lomba.git
cd absensi-smkn1-lomba

# 2. Install dependensi
npm install

# 3. Salin konfigurasi environment
cp .env.example .env

# 4. Jalankan server lokal
npm run dev
```

---

## 👥 Data Uji Coba Lomba (100% Dummy Fiktif)

Semua data uji coba menggunakan data fiktif untuk mematuhi perlindungan privasi data peserta didik & guru.

- **Kata Sandi Default Semua Akun:** `Demo@2025`

### Akun Uji Coba:
| Peran | Username / Email | Keterangan |
|---|---|---|
| **Tata Usaha / Admin** | `tu@smkn1sorong.sch.id` | Akses penuh portal admin, rekapitulasi, dan jadwal |
| **Wali Kelas XII RPL 1** | `budi.hartono@smkn1sorong.sch.id` | Guru Produktif & Wali Kelas XII RPL 1 |
| **Guru Mapel XII RPL 1** | `dewi.lestari@smkn1sorong.sch.id` | Guru Bahasa Indonesia |
| **Sekretaris XII RPL 1** | `s0071234006@smkn1sorong.sch.id` | Siswa pengurus presensi kelas XII RPL 1 |
| **Siswa XII RPL 1** | `s0071234001@smkn1sorong.sch.id` | Siswa umum XII RPL 1 |
| **Wali Kelas XII TKJ 1** | `iwan.setiawan@smkn1sorong.sch.id` | Guru Produktif & Wali Kelas XII TKJ 1 |
| **Guru Mapel XII TKJ 1** | `siti.nurhaliza@smkn1sorong.sch.id` | Guru Matematika |
| **Sekretaris XII TKJ 1** | `s0075678004@smkn1sorong.sch.id` | Siswa pengurus presensi kelas XII TKJ 1 |
| **Siswa XII TKJ 1** | `s0075678001@smkn1sorong.sch.id` | Siswa umum XII TKJ 1 |

---

## 🤖 Transparansi Penggunaan AI (Aturan Emas #5)
Pengembangan aplikasi ini dibantu oleh model AI:
- **Google Antigravity & Claude Code**: Untuk perancangan arsitektur keamanan database, optimasi query RLS Supabase, audit kode, dan pembuatan data pengujian fiktif.
- **Vibe Coding & Pair Programming**: Pengembang memegang kendali penuh atas rancangan UI/UX, alur verifikasi presensi sekolah, dan kesesuaian kebutuhan operasional SMKN 1 Sorong.
