import React from 'react';
import { ASSETS } from '../data/mockData';

interface BerandaViewProps {
  onNavigateToJadwal: () => void;
  onNavigateToRekap: () => void;
  onNavigateToAbsensi: () => void;
  onOpenIzinModal: () => void;
  onOpenLencanaModal: () => void;
  onOpenQrScan: () => void;
  onOpenNotifications: () => void;
}

export const BerandaView: React.FC<BerandaViewProps> = ({
  onNavigateToJadwal,
  onNavigateToRekap,
  onNavigateToAbsensi,
  onOpenIzinModal,
  onOpenLencanaModal,
  onOpenQrScan,
  onOpenNotifications,
}) => {
  return (
    <div className="flex flex-col w-full relative pb-28">
      {/* Dynamic Curved Blue Header Anchor */}
      <div className="bg-gradient-to-b from-[#00609b] via-[#0079c2] to-[#0761a2] pb-14 pt-4 px-4 rounded-b-[32px] relative overflow-hidden shadow-sm">
        {/* Decorative Ambient Waves (Fintech Aura) */}
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-[#77b7fe]/20 blur-2xl pointer-events-none" />
        <div className="absolute -left-10 bottom-0 w-36 h-36 rounded-full bg-[#6ffbbe]/15 blur-xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-white/30"
                src={ASSETS.cindyPortrait}
                alt="Portrait Cindy Laura"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#6ffbbe] rounded-full ring-2 ring-[#00609b]" />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[16px] text-white font-bold truncate">
                  Hai, Cindy Laura
                </span>
                <span className="text-base select-none">👋</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#cfe4ff] font-semibold uppercase tracking-wider">
                  XII TKJ 1
                </span>
                <span className="w-1 h-1 rounded-full bg-[#cfe4ff]/60" />
                <span className="text-[11px] text-white/80">NISN: 0068192041</span>
              </div>
            </div>
          </div>

          {/* Interactive Quick Notif Indicator */}
          <button
            aria-label="Notifikasi Presensi Terkini"
            type="button"
            onClick={onOpenNotifications}
            className="relative w-10 h-10 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 active:scale-95 transition-all shadow-sm shrink-0"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ffdad6]" />
          </button>
        </div>

        {/* Live Academic Badge */}
        <div className="relative z-10 mt-3 flex items-center justify-between bg-black/15 backdrop-blur-md rounded-xl py-1.5 px-3">
          <div className="flex items-center gap-1.5 text-white">
            <span className="material-symbols-outlined text-[16px] text-[#6ffbbe]">
              schedule
            </span>
            <span className="text-[11px] font-bold tracking-wide">
              08:15 WIT • Selasa, 9 Okt
            </span>
          </div>
          <span className="text-[11px] bg-[#00855b]/80 text-white px-2 py-0.5 rounded-full font-bold">
            Semester Ganjil
          </span>
        </div>
      </div>

      {/* Content Stream (Overlapping Hero Architecture) */}
      <div className="px-4 -mt-8 flex flex-col gap-4 relative z-20">
        {/* FLOATING ATTENDANCE CARD (DANA FinTech Aesthetics) */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_10px_25px_-5px_rgba(0,95,160,0.1),0_8px_10px_-6px_rgba(15,23,42,0.05)] border border-[#eceef0]/70 flex flex-col gap-4">
          {/* Status Meta Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006947] animate-pulse" />
              <span className="text-[12px] uppercase tracking-wider text-[#404751] font-bold">
                STATUS HARI INI
              </span>
            </div>
            <div className="bg-[#f2f4f6] px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#00609b]">
                verified_user
              </span>
              <span className="text-[11px] text-[#191c1e] font-semibold">
                Tepat Waktu
              </span>
            </div>
          </div>

          {/* Live Session Pills */}
          <div className="flex flex-col gap-2">
            {/* Live Confirmed JP */}
            <div className="bg-[#00855b]/10 px-3 py-2.5 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#00855b] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] text-[#191c1e] font-bold truncate">
                    Hadir JP 1–3
                  </span>
                  <span className="text-[12px] text-[#404751] truncate">
                    BA - Pemodelan PL
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-[#006947] bg-white px-2 py-0.5 rounded-lg shadow-xs shrink-0 font-bold">
                07:10 WIT
              </span>
            </div>

            {/* Pending Next JP */}
            <div className="bg-[#d1e4ff]/40 px-3 py-2.5 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#0079c2] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[16px]">
                    hourglass_top
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] text-[#191c1e] font-bold truncate">
                    Belum diabsen JP 4–9
                  </span>
                  <span className="text-[12px] text-[#404751] truncate">
                    Sesi Siang Dimulai 09:50 WIT
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-[#00487a] bg-white/90 px-2 py-0.5 rounded-lg shadow-xs shrink-0 font-semibold">
                Standby
              </span>
            </div>
          </div>

          {/* Gamified Disiplin Streak Banner */}
          <div
            onClick={onOpenLencanaModal}
            className="bg-gradient-to-r from-[#cfe4ff] to-[#d1e4ff] rounded-2xl p-3.5 relative overflow-hidden flex flex-col gap-2 cursor-pointer hover:shadow-sm active:scale-[0.99] transition-all"
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-xl select-none">🔥</span>
                <div>
                  <span className="text-[12px] text-[#001d34] uppercase tracking-wider block font-extrabold leading-tight">
                    14 HARI DISIPLIN STREAK
                  </span>
                  <span className="text-[12px] text-[#004a79]">
                    Konsistensi jempolan Cindy!
                  </span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-[#00609b] text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  military_tech
                </span>
              </div>
            </div>

            {/* Progress Gauge */}
            <div className="relative z-10 flex flex-col gap-1 mt-1">
              <div className="flex items-center justify-between text-[#001d34]">
                <span className="text-[11px] font-semibold">14/20 Hari Disiplin</span>
                <span className="text-[11px] font-bold text-[#00609b]">
                  Lencana Teladan Sorong
                </span>
              </div>
              <div className="w-full bg-white/70 h-2.5 rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  className="bg-gradient-to-r from-[#00609b] via-[#0079c2] to-[#00855b] h-full rounded-full transition-all duration-700"
                  style={{ width: '70%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTION GRID (Fintech 4-Tile Launcher) */}
        <div className="grid grid-cols-4 gap-2">
          {/* Jadwal */}
          <button
            type="button"
            onClick={onNavigateToJadwal}
            className="flex flex-col items-center gap-1.5 group active:scale-95 transition-transform"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#cfe4ff]/60 flex items-center justify-center shadow-xs group-hover:bg-[#cfe4ff] transition-colors">
              <span className="material-symbols-outlined text-[#00609b] text-[26px]">
                calendar_today
              </span>
            </div>
            <span className="text-[11px] text-[#191c1e] font-semibold text-center">
              Jadwal
            </span>
          </button>

          {/* Rekap */}
          <button
            type="button"
            onClick={onNavigateToRekap}
            className="flex flex-col items-center gap-1.5 group active:scale-95 transition-transform"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#d1e4ff]/60 flex items-center justify-center shadow-xs group-hover:bg-[#d1e4ff] transition-colors">
              <span className="material-symbols-outlined text-[#0761a2] text-[26px]">
                analytics
              </span>
            </div>
            <span className="text-[11px] text-[#191c1e] font-semibold text-center">
              Rekap
            </span>
          </button>

          {/* Izin / Dispensasi */}
          <button
            type="button"
            onClick={onOpenIzinModal}
            className="flex flex-col items-center gap-1.5 group active:scale-95 transition-transform"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#6ffbbe]/30 flex items-center justify-center shadow-xs group-hover:bg-[#6ffbbe]/50 transition-colors">
              <span className="material-symbols-outlined text-[#006947] text-[26px]">
                description
              </span>
            </div>
            <span className="text-[11px] text-[#191c1e] font-semibold text-center">
              Izin
            </span>
          </button>

          {/* Streak Rewards */}
          <button
            type="button"
            onClick={onOpenLencanaModal}
            className="flex flex-col items-center gap-1.5 group active:scale-95 transition-transform"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#9acbff]/30 flex items-center justify-center shadow-xs group-hover:bg-[#9acbff]/50 transition-colors">
              <span
                className="material-symbols-outlined text-[#00609b] text-[26px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                emoji_events
              </span>
            </div>
            <span className="text-[11px] text-[#191c1e] font-semibold text-center">
              Lencana
            </span>
          </button>
        </div>

        {/* TODAY'S SCHEDULE TIMELINE */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[16px] text-[#191c1e] font-bold">
                Jadwal Hari Ini
              </span>
              <span className="text-[11px] bg-[#00609b]/10 text-[#00609b] px-2 py-0.5 rounded-full font-bold">
                3 Sesi
              </span>
            </div>
            <button
              type="button"
              onClick={onNavigateToJadwal}
              className="text-[12px] text-[#00609b] font-bold hover:underline flex items-center"
            >
              Lihat Semua
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {/* SESSION 1: LIVE ACTIVE CARD */}
            <div className="bg-white rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col gap-3 border border-[#eceef0]/60">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#00855b]" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] text-[#191c1e] font-bold">
                    07:15 - 09:30 WIT
                  </span>
                  <span className="text-[12px] text-[#404751]">• JP 1-3</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#00855b]/15 px-2.5 py-0.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-[#006947] animate-ping" />
                  <span className="text-[11px] text-[#006947] font-extrabold uppercase tracking-wide">
                    LIVE
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">📘</span>
                  <span className="text-[16px] text-[#191c1e] font-bold leading-tight">
                    Pemodelan Perangkat Lunak (BA)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[#404751] text-[12px] mt-0.5">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#00609b]">
                      meeting_room
                    </span>
                    Lab Komputer 2
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#00609b]">
                      person
                    </span>
                    Budi Santoso, S.Kom
                  </span>
                </div>
              </div>

              {/* Bottom Session Status Strip */}
              <div className="bg-[#f2f4f6] rounded-xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#006947]">
                    check_circle
                  </span>
                  <span className="text-[12px] text-[#191c1e] font-semibold">
                    Status Presensi: <span className="text-[#006947] font-bold">Hadir</span>
                  </span>
                </div>
                <span className="text-[11px] text-[#404751]">Dicatat 07:10 WIT</span>
              </div>
            </div>

            {/* BREAK DIVIDER CARD */}
            <div className="bg-[#e6e8ea]/60 rounded-2xl py-2 px-4 flex items-center justify-between shadow-none">
              <div className="flex items-center gap-2 text-[#404751]">
                <span className="text-lg select-none">☕</span>
                <span className="text-[12px] font-bold">Istirahat Pagi</span>
              </div>
              <span className="text-[11px] text-[#404751] font-medium">
                09:30 - 09:50 WIT
              </span>
            </div>

            {/* SESSION 2: UPCOMING */}
            <div className="bg-white rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col gap-3 border border-[#eceef0]/60">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0079c2]" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] text-[#191c1e] font-bold">
                    09:50 - 11:20 WIT
                  </span>
                  <span className="text-[12px] text-[#404751]">• JP 4-5</span>
                </div>
                <span className="text-[11px] bg-[#cfe4ff] text-[#001d34] px-2.5 py-0.5 rounded-full font-bold">
                  Mendatang
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">📗</span>
                  <span className="text-[16px] text-[#191c1e] font-bold leading-tight">
                    Pemrograman Web &amp; Bergerak (TS)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[#404751] text-[12px] mt-0.5">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#0761a2]">
                      handyman
                    </span>
                    Bengkel RPL
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#0761a2]">
                      person
                    </span>
                    Ratna Dewi, M.Pd
                  </span>
                </div>
              </div>

              {/* Bottom Session Status Strip */}
              <div className="bg-[#f2f4f6] rounded-xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#404751]">
                    pending
                  </span>
                  <span className="text-[12px] text-[#404751]">
                    Menunggu Guru Membuka Presensi
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onOpenQrScan}
                  className="text-[11px] text-[#00609b] font-bold bg-[#cfe4ff]/50 px-2 py-0.5 rounded-md hover:bg-[#cfe4ff] transition-colors active:scale-95"
                >
                  Siapkan HP
                </button>
              </div>
            </div>

            {/* SESSION 3: LATER SESSION */}
            <div className="bg-white rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col gap-2 border border-[#eceef0]/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] text-[#404751] font-semibold">
                    11:20 - 12:05 WIT
                  </span>
                  <span className="text-[12px] text-[#404751]">• JP 6</span>
                </div>
                <span className="text-[11px] text-[#404751]">Sesi Akhir</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">📙</span>
                  <span className="text-[14px] text-[#191c1e] font-bold">
                    Bimbingan Konseling (BK)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#404751] text-[12px]">
                  <span className="material-symbols-outlined text-[16px]">person</span>
                  <span>Ahmad Dani, S.Pd</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DANA STYLE TIP BANNER */}
        <div className="bg-gradient-to-r from-[#cfe4ff] to-[#d1e4ff]/50 rounded-2xl p-3.5 flex items-start gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <span className="text-base select-none">💡</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] text-[#001d34] font-bold">
              Info Presensi Cerdas
            </span>
            <span className="text-[12px] text-[#004a79] leading-relaxed">
              Presensi ditutup otomatis 15 menit setelah jam pelajaran dimulai. Pastikan
              berada dalam radius WiFi sekolah saat melakukan tap QR.
            </span>
          </div>
        </div>

        {/* Fast Action Card for Teachers & Class Captains to open Absensi Kelas */}
        <div className="bg-white rounded-2xl p-3.5 border border-[#eceef0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#00609b]/10 text-[#00609b] flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                fact_check
              </span>
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#191c1e]">Mode Guru / Piket Kelas</p>
              <p className="text-[11px] text-[#404751]">Absensi roll-call & kunci kehadiran</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateToAbsensi}
            className="px-3 py-1.5 rounded-full bg-[#00609b] text-white text-[11px] font-bold shadow-xs active:scale-95 transition-all"
          >
            Buka Absensi
          </button>
        </div>
      </div>
    </div>
  );
};
