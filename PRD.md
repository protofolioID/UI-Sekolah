# PRD — Product Requirements Document

## 1. Identitas
- **Nama Aplikasi:** SIAP (Sistem Informasi & Presensi Terpadu SMKN 1 Sorong)
- **Nama Tim & Anggota:** Tim Pengembang SIAP SMKN 1 Sorong (Maks. 3 orang)
- **Platform:** Web Responsive (PWA / Mobile-Optimized)
- **Link Repository:** https://github.com/Nathan/absensi-smkn1-lomba
- **Link Hosting:** https://absensi-gabungan-main.vercel.app/

---

## 2. Masalah
- **Masalah Saat Ini:** Pencatatan kehadiran di SMKN 1 Sorong sebelumnya menggunakan buku jurnal kertas fisik dan laporan foto di grup WhatsApp, menyebabkan rekapitulasi data lambat, rawan tercecer, dan sulit mendeteksi siswa yang membolos di jam mata pelajaran tertentu.
- **Siapa yang Terdampak:** Siswa, Sekretaris Kelas, Guru Mata Pelajaran, Wali Kelas, Guru Piket, dan Bagian Tata Usaha (Operator Dapodik).
- **Cara yang Dipakai Sekarang:** Buku absensi kertas per mapel, lembar paraf manual, dan rekap manual di Excel pada akhir bulan.
- **Bukti/Hasil Observasi:** Butuh waktu lebih dari 1–2 jam setiap sore untuk mengumpulkan dan memverifikasi data kehadiran siswa yang izin, sakit, atau bolos antar-jam pelajaran.

---

## 3. Solusi & Tujuan
- **Solusi Singkat:** Portal presensi web berlapis yang mengintegrasikan pencatatan harian kelas oleh sekretaris, verifikasi langsung oleh guru mapel/wali kelas, dan rekap otomatis real-time ke Tata Usaha.
- **Tujuan Terukur:** 
  1. Waktu input dan verifikasi kehadiran per kelas berkurang dari 15 menit menjadi di bawah 60 detik.
  2. Rekap kehadiran bulanan selesai dalam 1 klik (ekspor Excel otomatis).
  3. Transparansi kehadiran mata pelajaran terpantau instan sehingga tingkat pembolosan berkurang.

---

## 4. Pengguna & Hak Akses (Role-Based Access Control)

| Peran | Siapa | Boleh Melakukan | Tidak Boleh |
|---|---|---|---|
| **Admin / Operator TU** | Staf Tata Usaha & Dapodik | Kelola data master (guru, siswa, kelas, jadwal), rekapitulasi bulanan, ekspor Excel, cetak laporan resmi. | Mengubah status presensi tanpa alasan dinas. |
| **Guru Mata Pelajaran** | Guru Pengampu | Verifikasi presensi di jam pelajarannya, menandai siswa bolos mapel (`B`), melihat jadwal ajar harian. | Mengubah jadwal guru lain atau data master sekolah. |
| **Wali Kelas** | Guru Wali Kelas | Validasi draf presensi harian dari sekretaris kelas, input catatan khusus & bukti surat sakit. | Mengubah data di luar rombel binaannya. |
| **Sekretaris Kelas** | Siswa Pengurus Kelas | Input draf kehadiran teman sekelas di pagi hari, menyimpan draf offline (localStorage). | Menghapus riwayat absensi atau mengubah data master. |
| **Siswa** | Peserta Didik | Melihat jadwal pelajaran pribadi, melihat status kehadiran diri, melihat streak disiplin, pantau panggilan guru. | Mengubah presensi sendiri atau siswa lain, mengakses panel admin. |

---

## 5. Fitur Aplikasi

### Wajib (MVP)
| No | Fitur | Peran | Kriteria Berhasil |
|---|---|---|---|
| **F1** | Autentikasi & Otorisasi Berjenjang | Semua | Login menggunakan username/NISN dan password ter-hash; hak akses diverifikasi di level database PostgreSQL (RLS). |
| **F2** | Input & Verifikasi Presensi Harian | Sekretaris & Wali Kelas | Input status (Hadir, Sakit, Izin, Alfa) per siswa; otomatis tersimpan lokal saat offline dan sync saat online. |
| **F3** | Presensi Jam Mata Pelajaran | Guru Mapel | Konfirmasi kehadiran saat jam pelajaran dimulai, deteksi siswa bolos mapel (`B`) terpisah dari izin. |
| **F4** | Jadwal Pelajaran Interaktif | Semua | Menampilkan slot mata pelajaran aktif hari ini, ruang kelas, dan jam pelajaran (JP). |
| **F5** | Rekap & Ekspor Laporan Excel | Admin & Guru | Unduh rekapitulasi absensi per rombel dalam format file spreadsheet Excel (`.xlsx`) resmi dalam 1 klik. |

### Tambahan
- **F6**: Indikator Streak Kehadiran Disiplin Siswa.
- **F7**: Notifikasi / Siaran Pengumuman Sekolah.
- **F8**: Mode Inspeksi Admin untuk simulasi sudut pandang guru dan siswa.

---

## 6. Alur Pengguna (User Flow)
1. **Alur Pagi Hari (Sekretaris & Siswa)**:
   - Sekretaris login → membuka tab Presensi Kelas → memilih status kehadiran teman sekelas → klik "Kirim untuk Validasi".
2. **Alur Guru Mapel**:
   - Guru login → membuka jadwal hari ini → klik "Mulai Presensi Mapel" → menandai kehadiran jam tersebut → klik "Simpan Absen Mapel".
3. **Alur Wali Kelas & Admin**:
   - Wali kelas memvalidasi draf pagi hari → Admin TU membuka portal rekap → memeriksa persentase kehadiran sekolah → ekspor ke format Excel Dapodik.

---

## 7. Data (Rancangan Database Supabase)
| Tabel | Kolom Penting | Keterangan & Aturan RLS |
|---|---|---|
| `profiles` | `id`, `username`, `nama`, `role`, `is_sekretaris`, `kelas_id` | RLS: Siswa hanya baca profil sendiri & teman sekelas; kolom `role` terkunci. |
| `kelas` | `id`, `nama`, `wali_kelas_id` | Master rombongan belajar. |
| `mapel` | `id`, `nama` | Master mata pelajaran. |
| `jadwal` | `id`, `kelas_id`, `mapel_id`, `guru_id`, `hari`, `jam_mulai`, `jam_selesai` | RLS: Hanya admin yang dapat menambah/menghapus jadwal. |
| `absen_harian` | `id`, `tanggal`, `siswa_id`, `kelas_id`, `status`, `status_validasi` | RLS: Input oleh sekretaris/wali kelas terdaftar. |
| `absen_mapel` | `id`, `tanggal`, `jadwal_id`, `siswa_id`, `status`, `diinput_oleh` | RLS: Input hanya oleh guru yang mengampu jadwal tersebut. |

---

## 8. Batasan Teknis & Keamanan
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide / Material Symbols Icons.
- **Backend/DB:** Supabase (PostgreSQL 15), GoTrue Auth, PostgREST API, Supabase Storage.
- **Hosting:** Vercel CDN.
- **Data Kebersihan:** 100% data uji coba menggunakan nama fiktif (2 kelas, 20 murid, 4 guru). Zero Personal Identifiable Information (PII) leak.
- **Keamanan:** Full Row Level Security (RLS) di semua tabel, tanpa SQL injection, sanitasi form, dan token JWT ES256.
