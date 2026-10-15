# WORKFLOW PENGEMBANGAN: SIAKAD SMKN 1 SORONG
## Dokumentasi 7 Langkah Pengembangan Berbantuan Artificial Intelligence (AI)

**Lomba Perancangan dan Pengembangan Aplikasi Berbasis Web Berbantuan AI**  
SMK Negeri 1 Sorong · Tahun Ajaran 2026/2027  
**Tim Pengembang:**
1. **Andhika Ivander Nathanael** (XII DKV 1) — UI/UX Designer & Frontend Engineer
2. **RAHMAD RIZAL FADILAH** (XII TKJ 1) — Backend, Database & Cloud Infrastructure Engineer
3. **PRIMA ADI NUGRAHA SOLTIF** (XII TKJ 1) — WhatsApp Gateway & System Integration Specialist

---

## Ringkasan Alur Kerja

```
1 Cari Masalah → 2 PRD Final → 3 Arsitektur & DB → 4 Bangun Per Fitur ⇄ 5 Uji Coba → 6 Audit Keamanan → 7 Rilis & Vercel
                                                              ↑_________________|
                                                          (Iterasi Berkelanjutan)
```

Prinsip Utama: **"Siswa yang memegang kemudi, AI sebagai akselerator cerdas."** Setiap baris kode yang dihasilkan melalui asistensi AI (Google Antigravity & Gemini) diuji, dipahami, dan dapat dipertanggungjawabkan secara komprehensif di depan Dewan Juri.

---

## Langkah 1: Eksplorasi Masalah Nyata di SMKN 1 Sorong

### 1. Observasi & Wawancara Pengguna
Tim melakukan peninjauan terhadap proses presensi dan tata kelola kegiatan belajar mengajar pada SMKN 1 Sorong:
- **Wali Kelas & Guru Piket:** Kesulitan memantau siswa yang bolos di tengah jam pelajaran (mata pelajaran ke-2 ke atas) setelah lolos presensi gerbang pagi.
- **Ketua Kelas & Sekretaris:** Sering kebingungan jika guru mata pelajaran terlambat atau belum hadir di ruang kelas/lab kejuruan, sehingga harus mencari guru manual ke ruang guru.
- **Tata Usaha (TU):** Memerlukan waktu berjam-jam mengumpulkan lembar kertas absen dari puluhan kelas untuk dikonversi ke format laporan bulanan Kemendikbudristek/Dapodik.
- **Pendelegasian Absen:** Jika sekretaris kelas sakit, buku absen tercecer dan tidak ada sistem hierarki otomatis untuk pelimpahan wewenang input.

### 2. Keputusan Tim
Tim memutuskan membangun satu aplikasi terintegrasi: **SIAKAD v2.0 (Sistem Informasi Presensi & Akademik Digital SMKN 1 Sorong)** yang menyelesaikan 4 masalah utama tersebut dalam satu ekosistem web responsif.

---

## Langkah 2: Penyusunan Dokumen Kebutuhan (PRD)

Tim menyusun dokumen `PRD.md` yang menetapkan batasan fitur (*scope*) yang realistis dan tepat sasaran untuk kompetisi:
1. **Hierarki 4 Level Wewenang Pengabsen Pagi:**
   - Level 1: Sekretaris Kelas (default)
   - Level 2: Ketua Kelas (otomatis jika sekretaris berhalangan)
   - Level 3: Siswa Mandat Khusus Wali Kelas (jika keduanya berhalangan)
   - Level 4: Guru Mapel Jam Pertama
2. **Panggilan Guru Terintegrasi WhatsApp Gateway:**
   - Siswa/ketua kelas dapat mengirim panggilan darurat berformat resmi langsung ke nomor WhatsApp guru mata pelajaran jika belum hadir di lab/kelas.
3. **Radar Presensi Guru Piket & Deteksi Bolos Mapel:**
   - Pelacakan perbedaan status absensi gerbang vs kelas per jam pelajaran.
4. **Portal Multi-Role (Superadmin, Admin TU, Guru/Wali Kelas, Siswa):**
   - Pemisahan hak akses data (*Row Level Security*) dan export rekap Excel/PDF resmi.

---

## Langkah 3: Perancangan Arsitektur & Basis Data

Sebelum implementasi kode, tim merancang skema relasional di PostgreSQL (Supabase):
- **Tabel `profiles`:** Menyimpan akun, role (`superadmin`, `operator`, `guru`, `siswa`), status perangkat kelas, dan relasi rombel.
- **Tabel `kelas` & `mapel`:** Master data jurusan dan kompetensi keahlian SMKN 1 Sorong.
- **Tabel `jadwal`:** Alokasi jam pelajaran (JP 1–10) dengan durasi waktu WIT (Waktu Indonesia Timur).
- **Tabel `absen_harian` & `absen_mapel`:** Log presensi harian siswa dengan status `Hadir`, `Sakit`, `Izin`, `Alfa`, dan `Bolos`.
- **Modul WhatsApp Gateway:** Layanan WebSocket/HTTP lokal berbasis Baileys untuk integrasi WhatsApp Web tanpa biaya API pihak ketiga.

---

## Langkah 4: Pengembangan Fitur Bertahap (Satu Prompt, Satu Fitur)

Setiap fitur dikembangkan secara modular dan langsung di-commit ke Git:
1. **Sprint 1 — Autentikasi & Multi-Role:**
   - Implementasi Supabase Auth dengan email virtual `@smkn1sorong.sch.id`.
   - Penyediaan shortcut akun demo juri (`👨‍🏫 Wali`, `🛠️ TU`, `👑 Super`).
2. **Sprint 2 — Sistem Hierarki Pengabsen & Presensi Pagi:**
   - Logika delegasi otomatis Sekretaris → Ketua Kelas → Siswa Mandat.
   - UI presensi cepat bergaya modern fintech dengan feedback interaktif.
3. **Sprint 3 — Modul Perangkat Kelas & Radar Piket:**
   - Penetapan pengurus kelas oleh wali kelas.
   - Deteksi inkonsistensi kehadiran per jam pelajaran (*bolos mapel*).
4. **Sprint 4 — WhatsApp Web Gateway & Tombol Panggil Guru:**
   - Komponen modal panggil guru dengan nomor tujuan dinamis.
   - Gateway Baileys Node.js dengan QR pairing code di panel Super Admin.
5. **Sprint 5 — Ekspor Rekap Bulanan Standar Kemendikbud:**
   - Generator file Excel/PDF berformat rekapitulasi kehadiran resmi.

---

## Langkah 5: Pengujian Menyeluruh (Testing & Edge Cases)

Tim melakukan pengujian pada berbagai skenario penggunaan:
- **Pengujian Responsif:** Diuji pada resolusi smartphone (360px–420px), tablet (768px), dan laptop/desktop (1366px–1920px).
- **Skenario Offline / Fallback:** Jika WhatsApp bot belum tersambung ke jaringan sekolah, sistem secara cerdas mengalihkan panggilan ke tautan langsung `wa.me/` sehingga pesan tetap 100% sampai ke gawai guru.
- **Validasi Input:** Input form izin/sakit diproteksi dengan upload bukti surat dokter dan preview gambar.

---

## Langkah 6: Audit Keamanan & Kepatuhan Etika Lomba

Berdasarkan `CHECKLIST-KEAMANAN.md`:
1. **Perlindungan Data Pribadi (Zero Real PII Leakage):**
   - Seluruh data siswa dan guru yang diakses dewan juri merupakan data uji coba sintetis (*clean dummy data*): 2 rombel percontohan (`XII RPL 1` & `XII TKJ 1`), 20 siswa fiktif, dan 4 guru demo.
   - Seluruh query UI dibatasi secara ketat menggunakan filter `DEMO_CLASS_IDS` dan `DEMO_TEACHERS`, menjaga kerahasiaan data riil sekolah di database.
2. **Sanitasi Kredensial & Secrets:**
   - Kredensial super-privilege (`SUPABASE_SERVICE_ROLE_KEY`) dipisahkan ke environment server dan tidak pernah terekspos di bundle JavaScript frontend publik.
   - File `.env` diproteksi ketat dalam `.gitignore`.
3. **Pemberitahuan Transparansi AI:**
   - Dicantumkan secara jujur di `README.md` bahwa AI digunakan sebagai asisten coding, perancang skema, dan pemeriksa keamanan.

---

## Langkah 7: Rilis Produksi & Deployment

- **Kode Sumber Terbuka:** Dipublikasikan di repositori GitHub [protofolioID/UI-Sekolah](https://github.com/protofolioID/UI-Sekolah).
- **Hosting Cloud:** Dideploy ke Vercel Production dengan domain live [https://absensi-gabungan-main.vercel.app](https://absensi-gabungan-main.vercel.app).
- **Dokumentasi Lengkap:** Disediakan `README.md`, panduan akun juri, video penjelasan, poster infografis, dan dokumen kebermanfaatan.
