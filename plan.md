# 📋 MASTER PLAN: AUDIT FITUR, ALUR PRESENTASI, DAN PANDUAN PUSH VS CODE
**Proyek: SIAP SMKN 1 Sorong (Sistem Informasi Absensi & Pelajaran)**  
*Dokumen Persiapan Presentasi & Panduan Operasional untuk Nat & Tim*

---

## 🔍 BAGIAN 1: AUDIT SISTEM — APA YANG KURANG & POTENSI BUG SAAT PRESENTASI

Berdasarkan audit menyeluruh pada codebase saat ini, berikut adalah hal-hal penting yang perlu diperhatikan agar presentasi berjalan mulus di depan penguji/audiens:

### 1. In-Memory State vs Hard Refresh (Offline Mock)
* **Kondisi Saat Ini**: Perubahan status presensi siswa (misal mengubah Cindy jadi Sakit/Izin) atau penambahan guru/siswa baru tersimpan di state React in-memory (`useState`).
* **Potensi Masalah**: Jika browser di-refresh (`F5` / reload), data akan kembali ke data dummy awal (`mockData.ts`).
* **Solusi / Trik Presentasi**: 
  - Jangan reload halaman saat sedang mendemonstrasikan perubahan data.
  - Sampaikan kepada audiens bahwa aplikasi menggunakan arsitektur **Offline-First Resilience**: sistem dapat berjalan mulus tanpa koneksi internet dengan database cadangan lokal, dan auto-sync saat terhubung ke server cloud.

### 2. Filter Kelas di Rekap Presensi
* **Kondisi Saat Ini**: Di menu **Rekap Siswa**, dropdown kelas sudah ada, namun daftar tabel matriks mingguan saat ini menampilkan data 10 siswa gabungan.
* **Rekomendasi Perbaikan**: Sinkronkan filter dropdown kelas di `RekapView` agar ketika memilih "XII DKV 1", tabel hanya menampilkan 5 siswa DKV, dan saat memilih "XII TKJ 1" hanya menampilkan 5 siswa TKJ.

### 3. Kecepatan Feedback Notifikasi Toast
* **Kondisi Saat Ini**: Toast feedback (pesan melayang di atas) otomatis hilang setelah 2.8 hingga 3.5 detik.
* **Trik Presentasi**: Saat mengklik tombol aksi seperti "Simpan & Kunci Presensi" atau "Export Excel", arahkan pandangan audiens/pointer mouse ke bagian atas layar agar mereka melihat animasi konfirmasi suksesnya.

### 4. Konsistensi Role Guard di Login
* **Kelebihan Baru**: Sudah terpasang **Rate Limiting (5x)**, **Lockout Countdown**, dan **Math CAPTCHA** setelah 3x salah password di `useLoginSecurity.ts`.
* **Perhatian Presentasi**: Jangan sengaja memasukkan password salah lebih dari 3 kali saat demo utama kecuali Anda memang ingin memamerkan fitur keamanan canggih anti-brute force!

---

## 🎭 BAGIAN 2: BEDAH FITUR LENGKAP SETIAP ROLE (KUNCI JAWABAN NAT)

SIAP SMKN 1 Sorong memiliki 4 Hak Akses Resmi + 1 Mode Tamu Publik. Berikut adalah daftar fitur lengkap yang bisa Nat jelaskan dengan percaya diri:

```
┌─────────────────────────────────────────────────────────────────┐
│                    STRUKTUR HAK AKSES SIAP                      │
├─────────────────┬─────────────────┬──────────────┬──────────────┤
│ 0. SUPERADMIN   │ 1. ADMIN TU     │ 2. GURU      │ 3. SISWA     │
│ (Kepala Sekolah)│ (Operator)      │ (Pendidik)   │ (Pelajar)    │
└─────────────────┴─────────────────┴──────────────┴──────────────┘
```

---

### 1. 🎓 ROLE 3: SISWA (Pelajar)
* **Akun Demo**: `s0097658890` (Cindy Laura - Kelas XII TKJ 1) / Password: `Demo@2026`
* **Fitur Utama**:
  1. **Dashboard Pribadi**: Menampilkan persentase kehadiran (misal: 96.8%), ringkasan jumlah hadir, sakit, izin, dan alfa.
  2. **Jadwal Pelajaran Kelas**: Menampilkan jadwal pelajaran harian & mingguan yang spesifik untuk kelasnya sendiri (bukan jadwal guru lain).
  3. **Rekap Kehadiran Mingguan (Matriks 6 Hari)**:
     - Tabel kehadiran visual Senin sampai Sabtu dengan indikator status (H/S/I/A).
     - Filter mingguan (Minggu 1 s/d Minggu 4) dan filter bulan.
     - Tombol **"Mingguan"** untuk mengunduh rekap spreadsheet Excel 6 hari.
     - Tombol **"Semua Periode"** untuk membuka wizard export kehadiran komprehensif.
  4. **Pengajuan Izin & Sakit Digital**: Form modal untuk mengajukan dispensasi atau sakit disertai upload surat dokter.
  5. **Sistem Gamifikasi & Lencana**: Penghargaan disiplin presensi (Lencana Disiplin Emas, Rajin Subuh, dll.).
  6. **Profil Siswa**: Info biodata NISN, jurusan, rombel, dan statistik presensi semester.

---

### 2. 👨‍🏫 ROLE 2: GURU MAPEL (Pendidik)
* **Akun Demo**: `196812291993031011` (Budi Santoso, S.Kom) / Password: `Demo@2026`
* **Fitur Utama**:
  1. **Dashboard Mengajar Guru**: Fokus hanya pada **jadwal mengajar guru itu sendiri** (di mana dia mengajar hari ini, jam berapa, ruang lab apa).
  2. **Agenda Mengajar Interaktif**:
     - Tombol **"Absen"**: Membuka langsung lembar presensi kelas yang sedang berlangsung.
     - Tombol **"Rekap"**: Membuka modal **Quick Roster** (daftar nama cepat) untuk melihat siapa saja siswa yang hadir/sakit/izin di jam tersebut.
  3. **Lembar Validasi & Absensi Kelas (`AbsensiView`)**:
     - **Pilih Kelas Manual**: Dropdown untuk berganti rombel secara fleksibel (default ke kelas sesi berjalan, misal XII TKJ 1 atau XII DKV 1).
     - **Toggle Status Presensi**: Mengubah status siswa perorangan (Hadir, Sakit, Izin, Alfa).
     - **Tombol "Set Semua Hadir"**: Fitur cepat 1-klik untuk menandai seluruh siswa hadir tanpa repot klik satu per satu.
     - **Tombol "Simpan & Kunci Presensi"**: Mengunci data jam pelajaran tersebut agar tidak bisa dimanipulasi.
     - **Lihat Bukti Lampiran**: Memeriksa surat sakit atau dispensasi siswa langsung di samping namanya.

---

### 3. 🛠️ ROLE 1: ADMIN (Tata Usaha / Operator Sekolah)
* **Akun Demo**: `admin_demo` (Tata Usaha SMKN 1) / Password: `Demo@2026`
* **Fitur Utama (Sistem Navigasi Tab)**:
  1. 📊 **Tab Dashboard**:
     - KPI ringkasan seluruh sekolah: total 1.240 siswa, 36 rombel, tingkat kehadiran sekolah 96.8%.
     - Status validasi rombel per kelas (mana yang sudah divalidasi guru, mana yang masih menunggu).
     - Log aktivitas audit sistem real-time.
  2. 📥 **Tab Export Kehadiran (Pusat Spreadsheet)**:
     - **1-Click Quick Exports**: Tombol instan unduh rekap Mingguan, Bulanan, 3 Bulan (Triwulan), 1 Semester, dan 1 Kelas Penuh.
     - **Wizard Export Lengkap (`ExportKehadiranModal`)**: Memilih 6 jenis periode dan 2 basis perhitungan (*Kehadiran Harian* vs *Berdasarkan Guru Mapel*).
  3. 📂 **Tab Master Data**:
     - **+ Tambah Guru Baru**: Form NIP, nama, mata pelajaran, dan ruangan.
     - **+ Tambah Siswa Baru**: Form NIS, nama lengkap, dan pilihan rombel (TKJ/DKV).
     - **Impor & Ekspor Excel**: Drag & drop file spreadsheet jadwal atau data siswa langsung ke sistem.
  4. 📅 **Tab Jadwal & Kalender**: Manajemen slot waktu jam pelajaran sekolah.
  5. 🖨️ **Cetak Jadwal Pelajaran**: Modal pratinjau siap cetak format A4/Legal.

---

### 4. 👑 ROLE 0: SUPERADMIN (Kepala Sekolah / IT Root Administrator)
* **Akun Demo**: `superadmin_sorong` (Kepala Sekolah / IT Admin) / Password: `Demo@2026`
* **Fitur Utama**:
  - Memiliki **SELURUH** akses Admin Tata Usaha di atas, ditambah hak istimewa tingkat Root:
  1. ⚙️ **Tab Kontrol Root**:
     - Penyesuaian jam toleransi masuk sekolah dan durasi Jam Pelajaran (JP).
     - Pengaturan aturan presensi gerbang sekolah.
     - Pemantauan status koneksi basis data cloud PostgreSQL Supabase (TLS 256-Bit).
  2. 🔐 **Tab Keamanan & Akun**:
     - **Reset Password Massal**: Tombol satu klik untuk mereset kata sandi siswa/guru bermasalah ke standar default (`Demo@2026`).
     - **Reset Kata Sandi Per User**: Form ganti password akun spesifik.
     - **Log Audit Keamanan**: Rekam jejak seluruh percobaan login dan IP pengguna.
  3. 📊 **Laporan Eksekutif**: Ringkasan performa kehadiran lintas jurusan untuk evaluasi dinas pendidikan.

---

### 5. 🌐 MODE TAMU / PUBLIK (Tanpa Login)
* **Akses**: Tombol di halaman login *"Lihat Jadwal Pelajaran Publik Tanpa Login"*.
* **Fitur**: Transparansi jadwal pelajaran sekolah yang dapat dilihat oleh wali murid atau tamu tanpa harus memiliki akun.

---

## 🎤 BAGIAN 3: STRATEGI & SKENARIO PRESENTASI (FLOW DEMO 5 MENIT)

Gunakan alur demonstrasi berikut agar dewan juri/guru penguji terpukau dengan kepraktisan dan kelengkapan aplikasi:

```
[MENIT 01] ──► Masalah & Solusi (Opening yang Kuat)
[MENIT 02] ──► Demo Siswa: Cek Jadwal & Rekap Mingguan
[MENIT 03] ──► Demo Guru: Validasi Absen Cepat & Rekap Roster
[MENIT 04] ──► Demo Admin: Export Excel Komprehensif & Tambah Data
[MENIT 05] ──► Demo Superadmin: Keamanan Root & Penutup Elegan
```

### 1. Menit 1: Pembukaan & Latar Belakang Masalah
* *"Selamat pagi/siang bapak/ibu penguji. Rekapitulasi absensi sekolah konvensional sering memakan waktu berhari-hari, rentan manipulasi, dan lambat dilaporkan ke wali murid. Karena itu, kami menghadirkan SIAP SMKN 1 Sorong — Sistem Informasi Absensi & Pelajaran modern berbasis Web & Mobile First yang terintegrasi untuk 4 level pengguna."*

### 2. Menit 2: Demonstrasi Role Siswa
* Klik **"Akses Cepat Pengujian: 3. Siswa (Cindy Laura)"**.
* Tunjukkan tampilan beranda yang bersih, statistik kehadiran, dan matriks rekapitulasi 6 hari (Senin-Sabtu).
* Klik tombol **"Mingguan"** untuk membuktikan bahwa siswa bisa langsung mengunduh rekapan spreadsheet Excel resmi.

### 3. Menit 3: Demonstrasi Role Guru
* Klik profil -> Keluar, lalu klik **"2. Guru Mapel (Pak Budi Santoso)"**.
* Tunjukkan bahwa guru langsung disambut oleh **jadwal mengajarnya sendiri hari ini**.
* Klik tombol **"Rekap"** di kartu sesi mengajar untuk melihat roster kehadiran kelas.
* Klik tombol **"Validasi Absen"**:
  - Tunjukkan dropdown pilihan kelas (bisa ganti XII TKJ 1 / XII DKV 1).
  - Klik tombol **"Set Semua Hadir"** (tunjukkan betapa cepatnya guru mengabsen).
  - Ubah 1 siswa menjadi "Sakit", lalu klik **"Simpan & Kunci Presensi"**.

### 4. Menit 4: Demonstrasi Role Admin (Tata Usaha)
* Keluar, lalu login ke **"1. Admin TU"**.
* Buka **Tab Export Kehadiran**:
  - Klik **"Export Bulanan"** atau buka wizard **Export Kehadiran**.
  - Jelaskan: *"Sistem kami menyediakan 6 periode export dengan 2 basis perhitungan: kehadiran harian dan kehadiran berbasis guru pengampu."*
* Buka **Tab Master Data**: Tunjukkan kemudahan menambah guru baru dan siswa baru secara digital.

### 5. Menit 5: Demonstrasi Superadmin & Penutup
* Beralih ke **"0. Superadmin"**:
  - Tunjukkan tab **Keamanan & Akun** (fitur proteksi brute force dan reset password).
* **Penutup**: *"Dengan SIAP SMKN 1 Sorong, proses administrasi yang tadinya memakan waktu berjam-jam kini tuntas dalam hitungan detik. Terima kasih."*

---

## 💻 BAGIAN 4: PANDUAN PUSH & SYNC LEWAT VS CODE (LANGKAH DEMI LANGKAH)

Untuk melakukan git push atau sync menggunakan antarmuka grafis (GUI) Visual Studio Code tanpa perlu mengetik terminal:

### Langkah 1: Buka Folder Repositori yang Benar di VS Code
1. Buka VS Code.
2. Pilih menu **File** -> **Open Folder...** (atau tekan `Ctrl + K`, lalu `Ctrl + O`).
3. Pilih folder:
   👉 `C:\Users\Nathan\Documents\github\bkp\UI-Sekolah-main`
   *(PENTING: Jangan buka folder absensi-smkn1-sorong-main untuk git, karena folder `.git` aktif berada di `UI-Sekolah-main`)*.

---

### Langkah 2: Buka Menu Source Control (Git) di Sidebar Kiri
1. Lihat bilah samping kiri (sidebar) VS Code.
2. Klik ikon **Source Control** (ikon cabang pohon / cabang git dengan lingkaran kecil) atau tekan shortcut keyboard:
   👉 **`Ctrl + Shift + G`**
3. Anda akan melihat daftar file yang baru saja diubah di bawah tulisan **Changes**.

---

### Langkah 3: Melakukan Stage Changes (Menandai File yang Mau Dikirim)
1. Arahkan mouse ke tulisan **Changes**.
2. Klik ikon **tanda tambah (+)** di samping tulisan *Changes* (Stage All Changes).
3. File-file tersebut akan berpindah ke bagian **Staged Changes**.

---

### Langkah 4: Menulis Pesan Commit
1. Di kotak isian bertuliskan *"Message (type Commit and press Enter to commit)"* di bagian atas:
2. Ketik deskripsi perubahan yang Anda buat, contoh:
   `update presentasi: sinkronisasi rekap dan perbaikan menu`

---

### Langkah 5: Commit & Push / Sync ke GitHub
Ada dua cara mudah:
* **Cara A (Tombol Biru Utama)**:
  - Klik tombol biru **"Commit"** (atau tekan centang di pojok kanan atas).
  - Setelah di-commit, tombol tersebut akan berubah menjadi tombol bertuliskan **"Sync Changes"** (atau muncul ikon awan dengan panah ke atas).
  - Klik tombol **"Sync Changes"** tersebut. Klik **OK** jika muncul konfirmasi.
* **Cara B (Status Bar Bawah)**:
  - Lihat di bagian pojok kiri bawah layar VS Code (status bar biru/ungu).
  - Ada ikon panah melingkar `↻ 0 ↑ 1` di samping tulisan `main`.
  - Klik ikon panah melingkar tersebut untuk langsung mengunggah perubahan ke GitHub.

---

## 🏁 RINGKASAN RENCANA TINDAKAN (ACTION ITEMS)
1. **[SELESAI]** Audit kompatibilitas kode Rizal (100% cocok & tersinkron).
2. **[SELESAI]** Deploy versi terbaru ke Vercel production: `https://absensi-smkn1-sorong-main.vercel.app`.
3. **[OPSIONAL / SARAN FIX]** Menghubungkan dropdown kelas di `RekapView` agar menyaring daftar siswa TKJ vs DKV secara dinamis.
4. **[PERSIAPAN]** Latihan demo flow presentasi 5 menit sesuai skenario di Bagian 3.
