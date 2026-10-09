import React from 'react';
import { ASSETS } from '../data/mockData';

interface ProfilViewProps {
  onOpenLencanaModal: () => void;
  onNavigateToAbsensi: () => void;
}

export const ProfilView: React.FC<ProfilViewProps> = ({
  onOpenLencanaModal,
  onNavigateToAbsensi,
}) => {
  return (
    <div className="flex flex-col w-full pb-28">
      {/* Curved Blue Header */}
      <div className="bg-gradient-to-b from-[#00609b] to-[#0761a2] pt-4 pb-16 px-4 rounded-b-[28px] shadow-sm text-white">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[12px] uppercase font-bold tracking-wider text-[#cfe4ff]">
            Profil Siswa
          </span>
          <span className="bg-[#6ffbbe]/20 text-[#6ffbbe] border border-[#6ffbbe]/40 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
            Status: Siswa Aktif
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={ASSETS.cindyPortrait}
              alt="Cindy Laura"
              className="w-16 h-16 rounded-full object-cover ring-4 ring-white/30 shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#6ffbbe] rounded-full ring-2 ring-[#00609b]" />
          </div>
          <div>
            <h2 className="text-[20px] font-bold leading-tight">Cindy Laura</h2>
            <p className="text-[12px] text-[#cfe4ff]">NISN: 0068192041 • NIS: 20240102</p>
            <p className="text-[11px] text-white/80">SMKN 1 Sorong, Papua Barat Daya</p>
          </div>
        </div>
      </div>

      {/* Floating Info Cards */}
      <div className="px-4 -mt-9 flex flex-col gap-3 relative z-10">
        {/* Academic Details Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eceef0] flex flex-col gap-3">
          <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#404751]">
            Informasi Akademik
          </h3>
          <div className="space-y-2 text-[12px]">
            <div className="flex justify-between py-1 border-b border-[#eceef0]">
              <span className="text-[#404751]">Kompetensi Keahlian</span>
              <span className="font-bold text-[#191c1e]">Teknik Komputer &amp; Jaringan (TKJ)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#eceef0]">
              <span className="text-[#404751]">Rombongan Belajar</span>
              <span className="font-bold text-[#191c1e]">Kelas XII TKJ 1</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#eceef0]">
              <span className="text-[#404751]">Wali Kelas</span>
              <span className="font-bold text-[#00609b]">Budi Santoso, S.Kom</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#eceef0]">
              <span className="text-[#404751]">Tahun Ajaran</span>
              <span className="font-bold text-[#191c1e]">2026 / 2027 (Semester Ganjil)</span>
            </div>
          </div>
        </div>

        {/* Gamification & Lencana Banner */}
        <div
          onClick={onOpenLencanaModal}
          className="bg-gradient-to-r from-[#cfe4ff] to-[#d1e4ff] rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#00609b] shadow-xs">
              <span
                className="material-symbols-outlined text-[26px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                military_tech
              </span>
            </div>
            <div>
              <p className="text-[13px] font-extrabold text-[#001d34]">
                14 Hari Disiplin Streak
              </p>
              <p className="text-[11px] text-[#004a79]">
                Lencana Teladan Sorong (Tingkat 3 dari 5)
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#00609b]">chevron_right</span>
        </div>

        {/* Data Wali & Kontak */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eceef0] flex flex-col gap-2">
          <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#404751]">
            Kontak &amp; Keamanan
          </h3>
          <div className="space-y-2 text-[12px]">
            <div className="flex justify-between py-1 border-b border-[#eceef0]">
              <span className="text-[#404751]">Email Sekolah</span>
              <span className="font-mono text-[#00609b]">cindy.laura@smkn1sorong.sch.id</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#eceef0]">
              <span className="text-[#404751]">Nomor Kontak Wali</span>
              <span className="font-semibold">+62 812-4822-XXXX</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#404751]">Integrasi SIAP</span>
              <span className="text-[#006947] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Tersinkronisasi Otomatis
              </span>
            </div>
          </div>
        </div>

        {/* Switch to Teacher Mode CTA */}
        <div className="bg-[#f2f4f6] rounded-2xl p-4 border border-[#eceef0] flex items-center justify-between">
          <div>
            <p className="text-[12px] font-bold text-[#191c1e]">Masuk Sebagai Guru Piket</p>
            <p className="text-[11px] text-[#404751]">Buka lembar roll-call Absensi Kelas</p>
          </div>
          <button
            type="button"
            onClick={onNavigateToAbsensi}
            className="px-3 py-1.5 rounded-full bg-[#00609b] text-white text-[11px] font-bold shadow-xs active:scale-95"
          >
            Buka Roll-Call
          </button>
        </div>
      </div>
    </div>
  );
};
