import React, { useState } from 'react';
import { Student } from '../types';
import { exportAttendanceRecapToExcel } from '../utils/excelHelper';
import { INITIAL_STUDENTS } from '../data/mockData';

interface UserSession {
  username: string;
  role: 'siswa' | 'guru' | 'admin' | 'superadmin';
  nama: string;
}

interface RekapViewProps {
  onBackToBeranda: () => void;
  onDownloadReport: () => void;
  userRole?: 'siswa' | 'guru' | 'admin' | 'superadmin';
  session?: UserSession | null;
  students?: Student[];
}

export const RekapView: React.FC<RekapViewProps> = ({
  onBackToBeranda,
  onDownloadReport,
  userRole = 'siswa',
  session,
  students = INITIAL_STUDENTS,
}) => {
  const isTeacherOrAdmin = userRole === 'guru' || userRole === 'admin' || userRole === 'superadmin';
  const [selectedClass, setSelectedClass] = useState('XII TKJ 1');
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Oktober 2026');

  const classList = ['XII TKJ 1', 'XII TKJ 2', 'XII RPL 1', 'XI TKJ 1', 'X PPLG'];

  const studentName = session?.nama || 'Cindy Laura';
  const rawId = session?.username || '0068192041';
  const studentNis = rawId.startsWith('s') ? rawId.slice(1) : rawId;

  // Student specific history
  const historyItems = [
    { date: 'Selasa, 9 Okt 2026', subject: 'Pemodelan Perangkat Lunak (BA)', time: '07:10 WIT', status: 'Hadir' },
    { date: 'Senin, 8 Okt 2026', subject: 'Administrasi Infrastruktur Jaringan (AIJ)', time: '07:08 WIT', status: 'Hadir' },
    { date: 'Jumat, 5 Okt 2026', subject: 'Pendidikan Agama & Budi Pekerti', time: '07:12 WIT', status: 'Hadir' },
    { date: 'Kamis, 4 Okt 2026', subject: 'Pemrograman Berorientasi Objek (PBO)', time: '07:05 WIT', status: 'Hadir' },
    { date: 'Rabu, 3 Okt 2026', subject: 'Matematika Terapan Kejuruan', time: '07:14 WIT', status: 'Hadir' },
    { date: 'Selasa, 2 Okt 2026', subject: 'Bahasa Inggris Maritim & Kejuruan', time: '07:09 WIT', status: 'Hadir' },
  ];

  // Class stats for teacher / admin
  const classStats = {
    total: students.length,
    hadir: students.filter((s) => s.status === 'Hadir').length,
    sakit: students.filter((s) => s.status === 'Sakit').length,
    izin: students.filter((s) => s.status === 'Izin').length,
    alfa: students.filter((s) => s.status === 'Alfa').length,
  };
  const classAttendancePct = ((classStats.hadir / (classStats.total || 1)) * 100).toFixed(1);

  const handleExportClassExcel = () => {
    exportAttendanceRecapToExcel(students, selectedClass, selectedPeriod);
  };

  // ─── GURU / ADMIN VIEW: REKAP KELAS ───
  if (isTeacherOrAdmin) {
    return (
      <div className="flex flex-col w-full pb-28">
        {/* Curved Blue Header */}
        <div className="bg-gradient-to-b from-[#00609b] to-[#0761a2] pt-4 pb-14 px-4 rounded-b-[28px] shadow-sm text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[20px] text-[#6ffbbe]">
                table_chart
              </span>
              <span className="text-[12px] uppercase font-bold tracking-wider">
                Rekap Presensi Rombel
              </span>
            </div>
            <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
              {selectedPeriod}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[20px] font-bold">Rekap Kehadiran Kelas</h2>
              <p className="text-[12px] text-[#cfe4ff]">
                Laporan presensi mengajar {session?.nama || 'Guru Mapel'}
              </p>
            </div>

            {/* Class Dropdown Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
                className="bg-white/15 hover:bg-white/25 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 text-[12px] font-bold active:scale-95 transition-all cursor-pointer"
              >
                <span>{selectedClass}</span>
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>

              {isClassDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-40 bg-white rounded-2xl shadow-xl border border-[#eceef0] py-1 z-30 animate-fadeIn text-[#191c1e]">
                  {classList.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setSelectedClass(c);
                        setIsClassDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-[12px] flex items-center justify-between hover:bg-[#cfe4ff]/30 ${
                        selectedClass === c ? 'font-bold text-[#00609b] bg-[#cfe4ff]/20' : ''
                      }`}
                    >
                      <span>{c}</span>
                      {selectedClass === c && (
                        <span className="material-symbols-outlined text-[16px] text-[#00609b]">
                          check
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating Content Island */}
        <div className="px-4 -mt-9 flex flex-col gap-4 relative z-10">
          {/* Class KPI Card */}
          <div className="bg-white rounded-3xl p-5 shadow-md border border-[#eceef0]/70 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#eceef0]">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#404751] font-bold">
                  Kehadiran Rata-Rata Kelas
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-[32px] font-extrabold text-[#00609b] leading-tight">
                    {classAttendancePct}%
                  </p>
                  <span className="text-[12px] font-bold text-[#006947]">
                    ({classStats.hadir}/{classStats.total} Siswa)
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleExportClassExcel}
                className="px-3.5 py-2 rounded-xl bg-[#00609b] hover:bg-[#0079c2] text-white text-[12px] font-bold shadow-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">file_download</span>
                <span>Ekspor Excel</span>
              </button>
            </div>

            {/* 4 Metric Pills */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-[#00855b]/10 p-2.5 rounded-2xl">
                <p className="text-[18px] font-bold text-[#006947]">{classStats.hadir}</p>
                <p className="text-[10px] text-[#404751] font-medium">Hadir</p>
              </div>
              <div className="bg-[#d1e4ff]/50 p-2.5 rounded-2xl">
                <p className="text-[18px] font-bold text-[#0761a2]">{classStats.sakit}</p>
                <p className="text-[10px] text-[#404751] font-medium">Sakit</p>
              </div>
              <div className="bg-[#fef3c7] p-2.5 rounded-2xl">
                <p className="text-[18px] font-bold text-[#b45309]">{classStats.izin}</p>
                <p className="text-[10px] text-[#404751] font-medium">Izin</p>
              </div>
              <div className="bg-[#ffdad6]/60 p-2.5 rounded-2xl">
                <p className="text-[18px] font-bold text-[#ba1a1a]">{classStats.alfa}</p>
                <p className="text-[10px] text-[#404751] font-medium">Alfa</p>
              </div>
            </div>
          </div>

          {/* Student Roster Table Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eceef0] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-[#191c1e]">
                Daftar Kehadiran Siswa ({selectedClass})
              </h3>
              <span className="text-[11px] text-[#707882]">34 Siswa Terdaftar</span>
            </div>

            <div className="divide-y divide-[#f2f4f6] max-h-96 overflow-y-auto no-scrollbar">
              {students.map((s, idx) => (
                <div key={s.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-[#f2f4f6] text-[#404751] text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-[#191c1e] truncate">{s.name}</p>
                      <p className="text-[10px] text-[#707882]">NISN: {s.nis}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                        s.status === 'Hadir'
                          ? 'bg-[#00855b]/15 text-[#006947]'
                          : s.status === 'Sakit'
                          ? 'bg-blue-100 text-blue-700'
                          : s.status === 'Izin'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Download PDF / Rekap Button */}
          <button
            type="button"
            onClick={onDownloadReport}
            className="w-full h-12 rounded-full bg-[#00609b] text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-md hover:bg-[#0079c2] active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            Cetak / Unduh Laporan Rekapitulasi Rombel
          </button>
        </div>
      </div>
    );
  }

  // ─── SISWA VIEW: LAPORAN MANDIRI ───
  return (
    <div className="flex flex-col w-full pb-28">
      {/* Curved Blue Header */}
      <div className="bg-gradient-to-b from-[#00609b] to-[#0761a2] pt-4 pb-14 px-4 rounded-b-[28px] shadow-sm text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-[#6ffbbe]">
              analytics
            </span>
            <span className="text-[12px] uppercase font-bold tracking-wider">
              Rekapitulasi Kehadiran
            </span>
          </div>
          <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
            Semester Ganjil 2026/2027
          </span>
        </div>

        <div>
          <h2 className="text-[20px] font-bold">Laporan Disiplin {studentName}</h2>
          <p className="text-[12px] text-[#cfe4ff]">NISN: {studentNis} • Kelas XII TKJ 1</p>
        </div>
      </div>

      {/* Floating Metrics Island */}
      <div className="px-4 -mt-9 flex flex-col gap-4 relative z-10">
        <div className="bg-white rounded-3xl p-5 shadow-md border border-[#eceef0]/70 flex flex-col gap-4">
          {/* Main Big Percentage Banner */}
          <div className="flex items-center justify-between pb-3 border-b border-[#eceef0]">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#404751] font-bold">
                Persentase Kehadiran
              </p>
              <p className="text-[36px] font-extrabold text-[#00609b] leading-tight">
                98.5%
              </p>
              <p className="text-[11px] text-[#006947] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                Target Kelulusan &gt; 90% Terpenuhi
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-[#cfe4ff]/50 flex items-center justify-center text-[#00609b]">
              <span
                className="material-symbols-outlined text-4xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
          </div>

          {/* 4 Metric Pills */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-[#00855b]/10 p-2.5 rounded-2xl">
              <p className="text-[18px] font-bold text-[#006947]">68</p>
              <p className="text-[10px] text-[#404751] font-medium">Hadir (Hari)</p>
            </div>
            <div className="bg-[#d1e4ff]/50 p-2.5 rounded-2xl">
              <p className="text-[18px] font-bold text-[#0761a2]">1</p>
              <p className="text-[10px] text-[#404751] font-medium">Sakit</p>
            </div>
            <div className="bg-[#fef3c7] p-2.5 rounded-2xl">
              <p className="text-[18px] font-bold text-[#b45309]">1</p>
              <p className="text-[10px] text-[#404751] font-medium">Izin</p>
            </div>
            <div className="bg-[#ffdad6]/60 p-2.5 rounded-2xl">
              <p className="text-[18px] font-bold text-[#ba1a1a]">0</p>
              <p className="text-[10px] text-[#404751] font-medium">Alfa</p>
            </div>
          </div>
        </div>

        {/* Riwayat Kehadiran Terakhir */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eceef0] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#191c1e]">Riwayat Kehadiran Sesi</h3>
            <span className="text-[11px] text-[#707882]">6 Sesi Terakhir</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {historyItems.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-[#f7f9fb] rounded-xl flex items-center justify-between gap-2 border border-[#eceef0]/60"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-[#00855b]/15 text-[#006947] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-[#191c1e] truncate">
                      {item.subject}
                    </p>
                    <p className="text-[11px] text-[#404751]">
                      {item.date} • {item.time}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] bg-[#00855b]/15 text-[#006947] px-2.5 py-0.5 rounded-full font-bold shrink-0">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
