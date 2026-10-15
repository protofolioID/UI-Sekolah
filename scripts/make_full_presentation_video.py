import os
import sys
import asyncio
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from playwright.sync_api import sync_playwright
import edge_tts
import imageio_ffmpeg

BASE_DIR = Path(__file__).resolve().parent.parent
ASSETS_DIR = BASE_DIR / "video_assets"
TEAM_DIR = ASSETS_DIR / "team"
SLIDES_DIR = ASSETS_DIR / "slides"
AUDIO_DIR = ASSETS_DIR / "audio"
CLIPS_DIR = ASSETS_DIR / "clips"

for d in [ASSETS_DIR, TEAM_DIR, SLIDES_DIR, AUDIO_DIR, CLIPS_DIR]:
    d.mkdir(parents=True, exist_ok=True)

FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()
VOICE_NAME = "id-ID-ArdiNeural"

FONT_BOLD_PATH = "C:/Windows/Fonts/segoeuib.ttf"
FONT_REG_PATH = "C:/Windows/Fonts/segoeui.ttf"

def get_font(size: int, bold: bool = False):
    try:
        path = FONT_BOLD_PATH if bold else FONT_REG_PATH
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def draw_multiline_wrapped(draw, text, pos, max_width, font, fill, line_spacing=6, anchor=None):
    words = text.split(" ")
    lines = []
    current_line = ""
    for w in words:
        test = f"{current_line} {w}".strip()
        bbox = draw.textbbox((0, 0), test, font=font)
        if (bbox[2] - bbox[0]) <= max_width:
            current_line = test
        else:
            if current_line:
                lines.append(current_line)
            current_line = w
    if current_line:
        lines.append(current_line)
    
    x, y = pos
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        lh = bbox[3] - bbox[1]
        if anchor == "mt":
            draw.text((x, y), line, font=font, fill=fill, anchor="mt")
        else:
            draw.text((x, y), line, font=font, fill=fill)
        y += lh + line_spacing
    return y

# ═══════════════════════════════════════════════════════════════════════════════
# 1. SCENARIOS & VOICEOVER SCRIPTS
# ═══════════════════════════════════════════════════════════════════════════════

SCENES = [
    {
        "id": "scene_01_intro",
        "title": "Perkenalan Tim Pengembang",
        "script": (
            "Halo Dewan Juri yang terhormat dan rekan-rekan semua. Salam hangat dari kami, tim pengembang "
            "SMK Negeri 1 Sorong, Papua Barat Daya. Saya Andhika Ivander Nathanael dari kelas Dua Belas DKV Satu "
            "sebagai perancang antarmuka pengguna dan desainer grafis. Bersama rekan saya, Rahmad Rizal Fadilah "
            "dari kelas Dua Belas TKJ Satu sebagai arsitek basis data dan backend, serta Prima Adi Nugraha Soltif "
            "dari kelas Dua Belas TKJ Satu sebagai spesialis integrasi sistem dan gateway WhatsApp. "
            "Hari ini, dengan bangga kami mempersembahkan SIAKAD versi dua: Sistem Informasi Presensi dan Tata Kelola "
            "Pembelajaran Terpadu berbasis kecerdasan buatan untuk SMKN 1 Sorong."
        ),
    },
    {
        "id": "scene_02_masalah",
        "title": "Tantangan Nyata di Sekolah",
        "script": (
            "SMK Negeri 1 Sorong memiliki lebih dari seribu dua ratus siswa yang terbagi ke dalam lima puluh empat "
            "rombongan belajar serta puluhan laboratorium kejuruan. Dari hasil riset dan wawancara kami dengan guru, "
            "kami menemukan tiga tantangan utama. Pertama, saat jam kejuruan, siswa sering membuang waktu hingga "
            "dua puluh menit mencari guru pengampu secara manual. Kedua, ketika sekretaris kelas berhalangan hadir, "
            "buku absen kertas sering tercecer dan tidak ada sistem pendelegasian resmi. Dan ketiga, staf tata usaha "
            "memerlukan waktu berhari-hari untuk merekap ribuan lembar data kertas ke format laporan Dapodik."
        ),
    },
    {
        "id": "scene_03_solusi",
        "title": "Empat Pilar Inovasi SIAKAD",
        "script": (
            "Untuk menjawab persoalan tersebut, kami merancang SIAKAD versi dua dengan empat pilar solusi utama. "
            "Satu: Fitur Panggil Guru otomatis terintegrasi gateway WhatsApp. "
            "Dua: Sistem hierarki empat tingkat wewenang pengabsen pagi. "
            "Tiga: Dasbor radar guru piket dengan deteksi siswa bolos jam pelajaran. "
            "Dan empat: Generator rekapitulasi bulanan satu klik sesuai standar format Kemendikbudristek."
        ),
    },
    {
        "id": "scene_04_demo_login",
        "title": "Kemudahan Akses & Akun Demo Juri",
        "script": (
            "Mari kita masuk ke demonstrasi aplikasi. Pada halaman awal, kami menyediakan jalan pintas cepat "
            "khusus dewan juri. Cukup tekan tombol Wali Kelas, Tata Usaha, atau Super Admin, sistem akan langsung "
            "mengisi kredensial dan memverifikasi akses tanpa konfigurasi rumit. Aplikasi juga menyediakan akses "
            "jadwal publik yang dapat dipantau langsung oleh orang tua tanpa perlu login."
        ),
    },
    {
        "id": "scene_05_demo_panggil_guru",
        "title": "Fitur Panggil Guru via WhatsApp",
        "script": (
            "Berikut adalah fitur unggulan pertama kami: Panggil Guru. Saat jam pelajaran kejuruan dimulai namun guru "
            "pengampu belum hadir di lab, ketua kelas cukup menekan tombol Panggil Guru. Sebuah modal dialog akan muncul, "
            "dan notifikasi resmi otomatis dikirimkan ke ponsel guru pengampu dalam hitungan detik. Jika bot gateway lokal "
            "sedang offline, sistem secara cerdas mengalihkan ke tautan langsung wa titik me, sehingga panggilan "
            "dipastikan seratus persen tersampaikan."
        ),
    },
    {
        "id": "scene_06_demo_hierarki",
        "title": "Hierarki 4 Tingkat Pengabsen Pagi",
        "script": (
            "Fitur unggulan kedua adalah hierarki wewenang pengabsenan. Pengisian presensi pagi dipegang oleh Sekretaris Satu. "
            "Namun jika Sekretaris Satu sakit atau izin, wewenang input secara otomatis dialihkan ke Ketua Kelas. "
            "Bahkan jika keduanya tidak hadir, Wali Kelas dapat memberikan mandat khusus kepada siswa lain yang hadir. "
            "Melalui tab Perangkat Kelas, Wali Kelas dapat mengatur pengurus kelas dengan aman dan terisolasi."
        ),
    },
    {
        "id": "scene_07_demo_piket",
        "title": "Radar Piket & Deteksi Bolos Mapel",
        "script": (
            "Beralih ke peran Guru Piket. Sering kali siswa hadir di gerbang saat pagi hari, namun bolos saat jam kejuruan siang. "
            "Dasbor Guru Piket dilengkapi radar anomali presensi yang membandingkan kehadiran gerbang pagi dengan kehadiran di kelas. "
            "Guru piket dapat langsung mengetahui siswa yang bolos mapel secara waktu nyata dan mencatat penanganan kedisiplinan."
        ),
    },
    {
        "id": "scene_08_demo_rekap",
        "title": "Rekapitulasi 1-Klik Standar Dapodik",
        "script": (
            "Untuk staf Tata Usaha dan Kepala Sekolah, SIAKAD memangkas waktu kerja berhari-hari menjadi hitungan detik. "
            "Melalui generator rekapitulasi, staf cukup memilih periode dan format laporan. Sistem secara instan "
            "menghasilkan file Microsoft Excel dan dokumen PDF siap cetak dengan persentase kehadiran bersih yang siap "
            "diunggah ke Dapodik Kementerian Pendidikan."
        ),
    },
    {
        "id": "scene_09_tech_ai",
        "title": "Teknologi & Etika Asistensi AI",
        "script": (
            "Aplikasi SIAKAD dibangun dengan standar teknologi modern: React sembilan belas, Tailwind CSS, Supabase PostgreSQL "
            "dengan keamanan Row Level Security, serta library Baileys untuk integrasi WhatsApp. "
            "Sesuai prinsip lomba, kami memanfaatkan asisten kecerdasan buatan seperti Google Antigravity dan Gemini sebagai akselerator "
            "dalam merancang skema dan uji keamanan. Namun kemudi kendali dan logika arsitektur seratus persen kami kuasai."
        ),
    },
    {
        "id": "scene_10_closing",
        "title": "Penutup & Komitmen Kebermanfaatan",
        "script": (
            "SIAKAD telah kami rilis secara terbuka di GitHub dan dapat diakses langsung pada domain live Vercel. "
            "Inovasi ini adalah wujud nyata kepedulian kami siswa SMK Negeri 1 Sorong untuk memajukan pendidikan vokasi yang efisien, "
            "transparan, dan tanpa kertas. Terima kasih atas perhatian Dewan Juri yang terhormat. SMKN 1 Sorong, bisa dan hebat!"
        ),
    },
]

# ═══════════════════════════════════════════════════════════════════════════════
# 2. CAPTURE LIVE APP SCREENS
# ═══════════════════════════════════════════════════════════════════════════════

def capture_app_screens():
    print("[1/4] Capturing live screenshots from https://absensi-gabungan-main.vercel.app ...")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        
        # 1. Desktop Login
        p1 = browser.new_page(viewport={"width": 1920, "height": 1080})
        p1.goto("https://absensi-gabungan-main.vercel.app")
        p1.wait_for_timeout(2500)
        p1.screenshot(path=str(SLIDES_DIR / "cap_login_desktop.png"))
        
        # 2. Mobile Login
        p2 = browser.new_page(viewport={"width": 412, "height": 915})
        p2.goto("https://absensi-gabungan-main.vercel.app")
        p2.wait_for_timeout(2000)
        p2.screenshot(path=str(SLIDES_DIR / "cap_login_mobile.png"))
        
        # 3. Student Home & Panggil Guru Modal
        p3 = browser.new_page(viewport={"width": 412, "height": 915})
        p3.goto("https://absensi-gabungan-main.vercel.app")
        p3.wait_for_timeout(2000)
        # Click login as Siswa RPL 1 (using demo helper or filling credentials)
        try:
            p3.fill("input[type='text']", "s0071234001")
            p3.fill("input[type='password']", "Demo@2025")
            p3.click("button[type='submit']")
            p3.wait_for_timeout(3000)
            p3.screenshot(path=str(SLIDES_DIR / "cap_student_home.png"))
            
            # Click Panggil Guru
            panggil_btn = p3.locator("button:has-text('Panggil Guru')").first
            if panggil_btn.is_visible():
                panggil_btn.click()
                p3.wait_for_timeout(1500)
                p3.screenshot(path=str(SLIDES_DIR / "cap_panggil_modal.png"))
        except Exception as e:
            print("Notice on student capture:", e)
            
        # 4. Guru / Wali Kelas Dashboard & Perangkat
        p4 = browser.new_page(viewport={"width": 412, "height": 915})
        p4.goto("https://absensi-gabungan-main.vercel.app")
        p4.wait_for_timeout(1500)
        try:
            # Use quick guru button
            wali_btn = p4.locator("button:has-text('Wali')").first
            if wali_btn.is_visible():
                wali_btn.click()
                p4.click("button[type='submit']")
                p4.wait_for_timeout(3000)
                p4.screenshot(path=str(SLIDES_DIR / "cap_guru_home.png"))
                
                # Navigate to Perangkat tab
                perangkat_tab = p4.locator("button:has-text('Perangkat')").first
                if perangkat_tab.is_visible():
                    perangkat_tab.click()
                    p4.wait_for_timeout(2000)
                    p4.screenshot(path=str(SLIDES_DIR / "cap_perangkat_kelas.png"))
        except Exception as e:
            print("Notice on guru capture:", e)
            
        # 5. Super Admin Dashboard & WhatsApp Gateway
        p5 = browser.new_page(viewport={"width": 1920, "height": 1080})
        p5.goto("https://absensi-gabungan-main.vercel.app")
        p5.wait_for_timeout(1500)
        try:
            super_btn = p5.locator("button:has-text('Super')").first
            if super_btn.is_visible():
                super_btn.click()
                p5.click("button[type='submit']")
                p5.wait_for_timeout(3000)
                p5.screenshot(path=str(SLIDES_DIR / "cap_admin_dashboard.png"))
                
                # Click tab WhatsApp
                wa_tab = p5.locator("button:has-text('Integrasi WA')").first
                if wa_tab.is_visible():
                    wa_tab.click()
                    p5.wait_for_timeout(1500)
                    p5.screenshot(path=str(SLIDES_DIR / "cap_admin_wa.png"))
                    
                # Click tab Rekapitulasi & Export modal
                rekap_tab = p5.locator("button:has-text('Rekapitulasi')").first
                if rekap_tab.is_visible():
                    rekap_tab.click()
                    p5.wait_for_timeout(1500)
                    p5.screenshot(path=str(SLIDES_DIR / "cap_admin_rekap.png"))
        except Exception as e:
            print("Notice on superadmin capture:", e)

        browser.close()
    print("Screenshots captured successfully!")

# ═══════════════════════════════════════════════════════════════════════════════
# 3. GENERATE AUDIO WITH EDGE-TTS
# ═══════════════════════════════════════════════════════════════════════════════

async def generate_voiceovers():
    print("[2/4] Generating Indonesian neural voiceover with Edge-TTS ...")
    for scene in SCENES:
        sid = scene["id"]
        out_file = AUDIO_DIR / f"{sid}.mp3"
        if not out_file.exists():
            print(f"  -> Synthesizing: {sid} ({scene['title']})")
            comm = edge_tts.Communicate(scene["script"], VOICE_NAME, rate="+5%", pitch="+0Hz")
            await comm.save(str(out_file))
        else:
            print(f"  -> Found cached: {sid}.mp3")
    print("Voiceover audio generated!")

# ═══════════════════════════════════════════════════════════════════════════════
# 4. SLIDE GRAPHICS COMPOSITING (PIL @ 1920x1080)
# ═══════════════════════════════════════════════════════════════════════════════

def create_base_canvas():
    """Generates standard 1920x1080 canvas with rich dark-blue gradient."""
    img = Image.new("RGB", (1920, 1080), "#0B1C30")
    draw = ImageDraw.Draw(img)
    # Subtle gradient bands
    for y in range(1080):
        r = int(11 + (y / 1080) * 10)
        g = int(28 + (y / 1080) * 18)
        b = int(48 + (y / 1080) * 35)
        draw.line([(0, y), (1920, y)], fill=(r, g, b))
    
    # Grid lines / tech accents
    grid_color = (255, 255, 255, 12)
    overlay = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
    d_over = ImageDraw.Draw(overlay)
    for x in range(0, 1920, 120):
        d_over.line([(x, 0), (x, 1080)], fill=grid_color, width=1)
    for y in range(0, 1080, 120):
        d_over.line([(0, y), (1920, y)], fill=grid_color, width=1)
    
    # Glowing top accent line
    d_over.rectangle([(0, 0), (1920, 6)], fill=(0, 150, 255, 255))
    img.paste(overlay, (0, 0), overlay)
    return img

def draw_header_footer(canvas: Image.Image, subtitle: str, current_idx: int):
    draw = ImageDraw.Draw(canvas)
    
    # Header Badges
    draw.text((80, 45), "SMKN 1 SORONG", font=get_font(20, bold=True), fill="#38BDF8")
    draw.text((250, 45), "•  LOMBA APLIKASI WEB BERBANTUAN AI 2026", font=get_font(20, bold=False), fill="#94A3B8")
    
    draw.text((80, 78), subtitle, font=get_font(38, bold=True), fill="#FFFFFF")
    
    # Top Right Live Badge
    badge_bg = (16, 185, 129, 40)
    draw.rounded_rectangle([(1600, 45), (1840, 95)], radius=12, fill="#042F2E", outline="#10B981", width=2)
    draw.ellipse([(1625, 65), (1637, 77)], fill="#34D399")
    draw.text((1650, 58), "SIAKAD v2.0 LIVE", font=get_font(18, bold=True), fill="#34D399")
    
    # Footer Lower-Third
    draw.line([(80, 1005), (1840, 1005)], fill="#1E293B", width=2)
    draw.text((80, 1025), "Tim Pengembang: Andhika Ivander N. • Rahmad Rizal F. • Prima Adi Nugraha S.", font=get_font(18, bold=False), fill="#94A3B8")
    draw.text((1650, 1025), f"Bagian {current_idx} dari 10", font=get_font(18, bold=True), fill="#38BDF8")

def crop_circular_photo(path: Path, size: int) -> Image.Image:
    try:
        im = Image.open(path).convert("RGBA")
        # Center crop square
        min_dim = min(im.size)
        left = (im.width - min_dim) // 2
        top = (im.height - min_dim) // 2
        im = im.crop((left, top, left + min_dim, top + min_dim))
        im = im.resize((size, size), Image.Resampling.LANCZOS)
        
        mask = Image.new("L", (size, size), 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0, size, size), fill=255)
        
        output = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        output.paste(im, (0, 0), mask=mask)
        return output
    except Exception as e:
        print(f"Error cropping {path}:", e)
        fallback = Image.new("RGBA", (size, size), (30, 41, 59, 255))
        return fallback

def generate_slides():
    print("[3/4] Composing 1080p slide graphics with Pillow ...")
    
    # ─── SLIDE 1: INTRO TIM PENGEMBANG ───
    s1 = create_base_canvas()
    draw1 = ImageDraw.Draw(s1)
    draw_header_footer(s1, "Profil Tim Pengembang & Inovasi SIAKAD v2.0", 1)
    
    # Sub-headline
    draw1.text((80, 140), "Sistem Informasi Presensi & Tata Kelola Pembelajaran Terpadu SMKN 1 Sorong", font=get_font(24, bold=False), fill="#38BDF8")
    
    # 3 Member Cards
    members = [
        {
            "name": "Andhika Ivander Nathanael",
            "class": "Kelas XII DKV 1",
            "role": "UI/UX Designer & Frontend",
            "desc": "Merancang arsitektur antarmuka responsif mobile-first, visual brandkit, serta kenyamanan pengguna.",
            "photo": TEAM_DIR / "andhika.jpeg",
            "badge_color": "#0284C7",
        },
        {
            "name": "RAHMAD RIZAL FADILAH",
            "class": "Kelas XII TKJ 1",
            "role": "Backend & Cloud Architect",
            "desc": "Merancang basis data PostgreSQL Supabase, otentikasi sesi multi-role, dan generator rekap Kemendikbud.",
            "photo": TEAM_DIR / "rizal.jpeg",
            "badge_color": "#7C3AED",
        },
        {
            "name": "PRIMA ADI NUGRAHA S.",
            "class": "Kelas XII TKJ 1",
            "role": "WhatsApp Gateway Specialist",
            "desc": "Mengintegrasikan bot Baileys WhatsApp Web JS, QR Code pairing, dan logika pendelegasian presensi.",
            "photo": TEAM_DIR / "prima.jpeg",
            "badge_color": "#059669",
        },
    ]
    
    card_w = 540
    card_h = 720
    card_y = 210
    start_x = 80
    gap = 60
    
    for i, m in enumerate(members):
        cx = start_x + i * (card_w + gap)
        # Outer Card
        draw1.rounded_rectangle([(cx, card_y), (cx + card_w, card_y + card_h)], radius=28, fill="#0F213A", outline="#1E3A5F", width=2)
        
        # Photo Avatar with Glowing Ring
        avatar = crop_circular_photo(m["photo"], 220)
        ax = cx + (card_w - 220) // 2
        ay = card_y + 45
        
        # Ring outline
        draw1.ellipse([(ax - 6, ay - 6), (ax + 226, ay + 226)], outline=m["badge_color"], width=4)
        s1.paste(avatar, (ax, ay), avatar)
        
        # Role Badge
        bx = cx + 50
        by = card_y + 300
        draw1.rounded_rectangle([(bx, by), (bx + card_w - 100, by + 40)], radius=12, fill=m["badge_color"])
        draw1.text((cx + card_w // 2, by + 10), m["role"], font=get_font(18, bold=True), fill="#FFFFFF", anchor="mt")
        
        # Name & Class
        draw1.text((cx + card_w // 2, card_y + 365), m["name"], font=get_font(24, bold=True), fill="#FFFFFF", anchor="mt")
        draw1.text((cx + card_w // 2, card_y + 405), m["class"], font=get_font(20, bold=False), fill="#38BDF8", anchor="mt")
        
        # Description
        draw1.line([(cx + 40, card_y + 450), (cx + card_w - 40, card_y + 450)], fill="#1E3A5F", width=1)
        draw_multiline_wrapped(
            draw1, m["desc"],
            (cx + card_w // 2, card_y + 475),
            max_width=card_w - 80,
            font=get_font(18, bold=False),
            fill="#94A3B8",
            line_spacing=8,
            anchor="mt"
        )

    s1.save(SLIDES_DIR / "slide_01.png")
    
    # ─── SLIDE 2: MASALAH NYATA ───
    s2 = create_base_canvas()
    draw2 = ImageDraw.Draw(s2)
    draw_header_footer(s2, "Latar Belakang: Masalah Nyata di SMKN 1 Sorong", 2)
    draw2.text((80, 140), "Hasil Wawancara Langsung dengan Pengguna: Siswa, Guru, Wali Kelas, dan Staf Tata Usaha", font=get_font(24, bold=False), fill="#F87171")
    
    problems = [
        ("01", "Kekosongan Jam Pelajaran & Lab", "Siswa harus berjalan jauh mencari guru pengampu secara manual saat jam pelajaran lab kejuruan kosong. Rata-rata 15-30 menit waktu efektif belajar terbuang percuma.", "#EF4444"),
        ("02", "Buku Absen Kertas Tercecer", "Jika Sekretaris Kelas sakit atau tidak hadir, tidak ada regulasi pelimpahan wewenang. Buku absensi fisik sering hilang atau terlambat diisi sehingga rekap tidak akurat.", "#F59E0B"),
        ("03", "Beban Rekapitulasi Manual TU", "Staf Tata Usaha harus menginput ulang ribuan lembar kertas absen dari 54 kelas ke format Dapodik/Kemendikbudristek setiap akhir bulan. Proses ini memakan waktu 3-5 hari kerja.", "#3B82F6"),
    ]
    for i, p in enumerate(problems):
        py = 220 + i * 245
        draw2.rounded_rectangle([(80, py), (1840, py + 215)], radius=24, fill="#0F213A", outline="#1E3A5F", width=2)
        # Badge
        draw2.rounded_rectangle([(110, py + 35), (200, py + 125)], radius=18, fill=p[3])
        draw2.text((155, py + 55), p[0], font=get_font(40, bold=True), fill="#FFFFFF", anchor="mt")
        # Text
        draw2.text((230, py + 35), p[1], font=get_font(30, bold=True), fill="#FFFFFF")
        draw_multiline_wrapped(
            draw2, p[2],
            (230, py + 85),
            max_width=1540,
            font=get_font(21, bold=False),
            fill="#94A3B8",
            line_spacing=6
        )
    s2.save(SLIDES_DIR / "slide_02.png")
    
    # ─── SLIDE 3: 4 PILAR SOLUSI ───
    s3 = create_base_canvas()
    draw3 = ImageDraw.Draw(s3)
    draw_header_footer(s3, "Solusi Unggulan: 4 Pilar Inovasi SIAKAD v2.0", 3)
    draw3.text((80, 140), "Ekosistem Terintegrasi Memadukan Presensi Digital, Otomasi WhatsApp, dan Sinkronisasi Dapodik", font=get_font(24, bold=False), fill="#34D399")
    
    pillars = [
        ("01", "Panggil Guru via WhatsApp", "Panggilan darurat instan berformat resmi dikirim ke nomor WhatsApp guru pengampu saat jam pelajaran kosong.", "#10B981"),
        ("02", "Hierarki 4-Tingkat Pengabsen", "Pelimpahan hak absen otomatis: Sekretaris 1 -> Ketua Kelas -> Mandat Wali Kelas -> Guru Mapel.", "#3B82F6"),
        ("03", "Radar Piket & Deteksi Bolos", "Memantau perbedaan presensi gerbang pagi vs jam pelajaran kejuruan secara real-time.", "#F59E0B"),
        ("04", "Rekap Kemendikbud 1-Klik", "Ekspor rekapitulasi bulanan otomatis dalam format Microsoft Excel (.xlsx) dan PDF siap lapor Dapodik.", "#8B5CF6"),
    ]
    for i, pil in enumerate(pillars):
        row = i // 2
        col = i % 2
        bx = 80 + col * 910
        by = 220 + row * 360
        draw3.rounded_rectangle([(bx, by), (bx + 850, by + 320)], radius=24, fill="#0F213A", outline="#1E3A5F", width=2)
        
        # Pill number badge
        draw3.rounded_rectangle([(bx + 35, by + 35), (bx + 115, by + 85)], radius=12, fill=pil[3])
        draw3.text((bx + 75, by + 46), pil[0], font=get_font(26, bold=True), fill="#FFFFFF", anchor="mt")
        
        # Pillar Title
        draw3.text((bx + 135, by + 45), pil[1], font=get_font(28, bold=True), fill=pil[3])
        
        # Multi-line desc with wrapping
        draw_multiline_wrapped(
            draw3, pil[2],
            (bx + 35, by + 115),
            max_width=780,
            font=get_font(21, bold=False),
            fill="#CBD5E1",
            line_spacing=8
        )
    s3.save(SLIDES_DIR / "slide_03.png")

    # Helper function for live capture slides
    def compose_demo_slide(slide_num: int, title: str, subtitle: str, cap_path: Path, points: list, is_mobile: bool = True):
        canvas = create_base_canvas()
        draw = ImageDraw.Draw(canvas)
        draw_header_footer(canvas, f"Live Demo: {title}", slide_num)
        draw.text((80, 140), subtitle, font=get_font(24, bold=False), fill="#38BDF8")
        
        # Left or Right: Render Screenshot
        if cap_path.exists():
            cap_img = Image.open(cap_path).convert("RGBA")
            if is_mobile:
                # Frame mobile in phone mockup
                mw = 420
                mh = 760
                resized = cap_img.resize((mw, mh), Image.Resampling.LANCZOS)
                draw.rounded_rectangle([(100, 200), (100 + mw + 24, 200 + mh + 24)], radius=36, fill="#020617", outline="#38BDF8", width=3)
                canvas.paste(resized, (112, 212))
                rx = 580
                avail_w = 1840 - rx
                card_h = 165
                step_y = 190
            else:
                # Frame desktop
                dw = 980
                dh = 590
                resized = cap_img.resize((dw, dh), Image.Resampling.LANCZOS)
                draw.rounded_rectangle([(80, 220), (80 + dw + 20, 220 + dh + 20)], radius=20, fill="#020617", outline="#38BDF8", width=3)
                canvas.paste(resized, (90, 230))
                rx = 1120
                avail_w = 1840 - rx
                card_h = 180
                step_y = 205
        else:
            rx = 600
            avail_w = 1840 - rx
            card_h = 165
            step_y = 190

        # Points
        py = 225
        for pt_title, pt_desc in points:
            draw.rounded_rectangle([(rx, py), (1840, py + card_h)], radius=20, fill="#0F213A", outline="#1E3A5F", width=2)
            draw.ellipse([(rx + 25, py + 25), (rx + 45, py + 45)], fill="#10B981")
            draw.text((rx + 65, py + 20), pt_title, font=get_font(24, bold=True), fill="#FFFFFF")
            draw_multiline_wrapped(
                draw, pt_desc,
                (rx + 65, py + 62),
                max_width=avail_w - 95,
                font=get_font(19, bold=False),
                fill="#94A3B8",
                line_spacing=6
            )
            py += step_y

        canvas.save(SLIDES_DIR / f"slide_{slide_num:02d}.png")

    # ─── SLIDE 4: DEMO LOGIN CEPAT ───
    compose_demo_slide(
        4, "Halaman Login & Jalan Pintas Dewan Juri",
        "Pengujian Instan Tanpa Repot Menghafal Kredensial Pengguna",
        SLIDES_DIR / "cap_login_mobile.png",
        [
            ("One-Click Role Shortcuts", "Tombol pintas Wali Kelas, Admin TU, dan Super Admin mengisi identitas & sandi secara otomatis."),
            ("Akses Jadwal Publik Tanpa Login", "Orang tua murid dan masyarakat dapat memantau jadwal KBM sekolah tanpa autentikasi."),
            ("Proteksi Autentikasi Supabase", "Server-side password hashing, token JWT, dan isolasi keamanan Row Level Security."),
        ],
        is_mobile=True
    )
    
    # ─── SLIDE 5: DEMO PANGGIL GURU ───
    panggil_cap = SLIDES_DIR / "cap_panggil_modal.png"
    if not panggil_cap.exists(): panggil_cap = SLIDES_DIR / "cap_student_home.png"
    compose_demo_slide(
        5, "Panggilan Guru Terintegrasi WhatsApp Gateway",
        "Menghilangkan Kekosongan Kelas Lab dengan Notifikasi Otomatis",
        panggil_cap,
        [
            ("Pengiriman Notifikasi Resmi", "Pesan otomatis memuat nama kelas, ruang lab, jam pelajaran WIT, dan nama siswa pemanggil."),
            ("Engine Baileys WhatsApp Web JS", "Beroperasi di jaringan internal sekolah tanpa biaya langganan API berbayar pihak ketiga."),
            ("Smart Fallback wa.me", "Jika bot sedang tidak tersambung, panggilan dialihkan otomatis ke tautan WhatsApp langsung."),
        ],
        is_mobile=True
    )
    
    # ─── SLIDE 6: DEMO HIERARKI & PERANGKAT ───
    perangkat_cap = SLIDES_DIR / "cap_perangkat_kelas.png"
    if not perangkat_cap.exists(): perangkat_cap = SLIDES_DIR / "cap_guru_home.png"
    compose_demo_slide(
        6, "Hierarki 4-Tingkat Pengabsen & Perangkat Kelas",
        "Jaminan Presensi Tetap Terisi Tanpa Terkendala Petugas yang Sakit",
        perangkat_cap,
        [
            ("Pelimpahan Otomatis Bertingkat", "Jika Sekretaris 1 berhalangan hadir, sistem langsung melimpahkan akses ke Ketua Kelas."),
            ("Mandat Khusus Wali Kelas", "Wali kelas dapat menunjuk siswa pengganti harian secara darurat langsung dari dasbor."),
            ("Isolasi Data Demo Rombel", "Query terkunci ketat pada 2 kelas uji coba (XII RPL 1 & XII TKJ 1) guna menjaga privasi sekolah."),
        ],
        is_mobile=True
    )
    
    # ─── SLIDE 7: DEMO RADAR GURU PIKET ───
    compose_demo_slide(
        7, "Dasbor Radar Guru Piket & Deteksi Bolos Mapel",
        "Mencegah Fenomena Hadir Pagi di Gerbang tapi Menghilang di Jam Siang",
        SLIDES_DIR / "cap_guru_home.png",
        [
            ("Deteksi Anomali Jam Pelajaran", "Sistem mendeteksi selisih kehadiran gerbang sekolah dengan presensi tiap jam kejuruan."),
            ("Pencatatan Penanganan Siswa", "Guru piket dapat mencatat siswa terlambat dan alasan ketidakhadiran di satu portal terpusat."),
            ("Monitoring Real-Time Seluruh Rombel", "Menghapus ketergantungan pada lembaran kertas monitoring fisik yang rawan hilang."),
        ],
        is_mobile=True
    )
    
    # ─── SLIDE 8: DEMO REKAP DAPODIK ───
    admin_cap = SLIDES_DIR / "cap_admin_dashboard.png"
    compose_demo_slide(
        8, "Dasbor Tata Usaha & Generator Laporan Kemendikbud",
        "Efisiensi Rekapitulasi Kehadiran dari 5 Hari Menjadi Kurang dari 3 Detik",
        admin_cap,
        [
            ("Ekspor Microsoft Excel (.xlsx) 1-Klik", "Menghasilkan format tabel resmi dengan kolom NISN, hadir, sakit, izin, dan persentase."),
            ("Dokumen PDF Siap Cetak", "Dapat langsung dicetak untuk keperluan arsip fisik kepala sekolah dan pengawas pembina."),
            ("Panel WhatsApp Gateway Super Admin", "Menampilkan QR scanner pairing WhatsApp bot dan log riwayat panggilan guru."),
        ],
        is_mobile=False
    )
    
    # ─── SLIDE 9: TEKNOLOGI & TRANSPARANSI AI ───
    s9 = create_base_canvas()
    draw9 = ImageDraw.Draw(s9)
    draw_header_footer(s9, "Arsitektur Teknologi & Kepatuhan Etika AI", 9)
    draw9.text((80, 140), "Siswa Memegang Kemudi Kendali Penuh — AI Berperan Sebagai Akselerator Cerdas", font=get_font(24, bold=False), fill="#A78BFA")
    
    tech_stacks = [
        ("Frontend Modern", "React 19 + TypeScript + Vite + Tailwind CSS v4. Animasi performa tinggi dengan Motion & Lucide Icons."),
        ("Cloud Database & Auth", "PostgreSQL Supabase dengan Row Level Security (RLS). Otentikasi token JWT aman & isolasi role 4 tingkatan."),
        ("WhatsApp Gateway", "Node.js WebSocket Baileys WhatsApp Web JS. QR Pairing Code & direct dispatch wa.me fallback."),
        ("Etika Pemanfaatan AI", "Google Antigravity & Gemini digunakan sebagai asisten coding, perancang skema DB, dan pemeriksa keamanan. Kode 100% dipahami tim."),
    ]
    for i, t in enumerate(tech_stacks):
        row = i // 2
        col = i % 2
        tx = 80 + col * 910
        ty = 220 + row * 360
        draw9.rounded_rectangle([(tx, ty), (tx + 850, ty + 320)], radius=24, fill="#0F213A", outline="#1E3A5F", width=2)
        draw9.text((tx + 40, ty + 35), t[0], font=get_font(28, bold=True), fill="#38BDF8")
        draw_multiline_wrapped(
            draw9, t[1],
            (tx + 40, ty + 95),
            max_width=770,
            font=get_font(21, bold=False),
            fill="#CBD5E1",
            line_spacing=8
        )
    s9.save(SLIDES_DIR / "slide_09.png")
    
    # ─── SLIDE 10: CLOSING ───
    s10 = create_base_canvas()
    draw10 = ImageDraw.Draw(s10)
    draw_header_footer(s10, "Penutup & Tautan Pengujian Langsung", 10)
    draw10.text((80, 140), "SMK Negeri 1 Sorong — Vokasi Hebat, Berdaya Saing, dan Berkelanjutan", font=get_font(24, bold=False), fill="#34D399")
    
    # Big Center Banner
    draw10.rounded_rectangle([(80, 220), (1840, 950)], radius=32, fill="#0F213A", outline="#10B981", width=3)
    
    draw10.text((960, 270), "SIAKAD v2.0 Telah Online & Siap Digunakan", font=get_font(40, bold=True), fill="#FFFFFF", anchor="mt")
    
    # URL Pill + Link
    draw10.rounded_rectangle([(340, 350), (450, 395)], radius=10, fill="#0284C7")
    draw10.text((395, 360), "ONLINE", font=get_font(20, bold=True), fill="#FFFFFF", anchor="mt")
    draw10.text((470, 360), "https://absensi-gabungan-main.vercel.app", font=get_font(28, bold=True), fill="#38BDF8")
    
    # Repo Pill + Link
    draw10.rounded_rectangle([(340, 420), (450, 465)], radius=10, fill="#475569")
    draw10.text((395, 430), "GITHUB", font=get_font(20, bold=True), fill="#FFFFFF", anchor="mt")
    draw10.text((470, 430), "https://github.com/protofolioID/UI-Sekolah", font=get_font(26, bold=False), fill="#94A3B8")
    
    # 3 Member Mini Badges
    draw10.text((960, 520), "Karya Tim Siswa SMK Negeri 1 Sorong:", font=get_font(24, bold=True), fill="#FFFFFF", anchor="mt")
    draw10.text((960, 565), "Andhika Ivander Nathanael (XII DKV 1) • Rahmad Rizal Fadilah (XII TKJ 1) • Prima Adi Nugraha S. (XII TKJ 1)", font=get_font(25, bold=True), fill="#FCD34D", anchor="mt")
    
    draw10.rounded_rectangle([(260, 680), (1660, 850)], radius=20, fill="#042F2E", outline="#059669", width=2)
    draw10.text((960, 715), "“Inovasi Hadir dari Masalah Nyata di Lingkungan Kita Sendiri”", font=get_font(32, bold=True), fill="#34D399", anchor="mt")
    draw10.text((960, 775), "Terima kasih kepada Dewan Juri atas apresiasi dan penilaian yang diberikan.", font=get_font(22, bold=False), fill="#E2E8F0", anchor="mt")
    
    s10.save(SLIDES_DIR / "slide_10.png")
    print("All 10 Full HD slide graphics created successfully!")

# ═══════════════════════════════════════════════════════════════════════════════
# 5. RENDER SCENE CLIPS & STITCH FINAL VIDEO
# ═══════════════════════════════════════════════════════════════════════════════

def get_audio_duration(audio_file: Path) -> float:
    cmd = [
        FFMPEG_EXE, "-i", str(audio_file)
    ]
    res = subprocess.run(cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True)
    # Parse Duration: 00:00:23.45
    for line in res.stderr.split("\n"):
        if "Duration:" in line:
            parts = line.split("Duration:")[1].split(",")[0].strip()
            h, m, s = parts.split(":")
            return float(h) * 3600 + float(m) * 60 + float(s)
    return 15.0

def render_final_video():
    print("[4/4] Stitching slides and audio with FFmpeg into master MP4 ...")
    clip_files = []
    
    for i, scene in enumerate(SCENES):
        num = i + 1
        slide_img = SLIDES_DIR / f"slide_{num:02d}.png"
        audio_mp3 = AUDIO_DIR / f"{scene['id']}.mp3"
        clip_out = CLIPS_DIR / f"clip_{num:02d}.mp4"
        
        duration = get_audio_duration(audio_mp3) + 0.8 # add small padding
        print(f"  -> Rendering Clip {num}/10 ({scene['title']}): {duration:.1f}s")
        
        # FFmpeg command: loop image, take audio, encode x264 1080p 30fps
        cmd = [
            FFMPEG_EXE, "-y",
            "-loop", "1",
            "-i", str(slide_img),
            "-i", str(audio_mp3),
            "-c:v", "libx264",
            "-tune", "stillimage",
            "-c:a", "aac",
            "-b:a", "192k",
            "-pix_fmt", "yuv420p",
            "-t", f"{duration:.2f}",
            "-shortest",
            str(clip_out)
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        clip_files.append(clip_out)

    # Create concat list
    concat_txt = CLIPS_DIR / "concat_list.txt"
    with open(concat_txt, "w", encoding="utf-8") as f:
        for c in clip_files:
            f.write(f"file '{c.resolve().as_posix()}'\n")

    # Output master video
    final_video = BASE_DIR / "video_presentasi_siakad.mp4"
    print(f"  -> Merging all clips into: {final_video}")
    concat_cmd = [
        FFMPEG_EXE, "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", str(concat_txt),
        "-c", "copy",
        str(final_video)
    ]
    subprocess.run(concat_cmd, check=True)
    
    print("\n" + "=" * 60)
    print("SUCCESS: Video presentasi selesai dibuat:")
    print(f"File: {final_video}")
    size_mb = final_video.stat().st_size / (1024 * 1024)
    print(f"Ukuran File: {size_mb:.2f} MB")
    print("=" * 60)

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN ENTRYPOINT
# ═══════════════════════════════════════════════════════════════════════════════

def main():
    capture_app_screens()
    asyncio.run(generate_voiceovers())
    generate_slides()
    render_final_video()

if __name__ == "__main__":
    main()
