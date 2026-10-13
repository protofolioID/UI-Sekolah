import React, { useState } from 'react';
import { ASSETS, INITIAL_STUDENTS } from '../data/mockData';
import { Student } from '../types';

interface GuruDashboardViewProps {
  onOpenAbsensiKelas: (classId: string, className: string, subjectName: string) => void;
  onNavigateToJadwal: () => void;
  onNavigateToRekap: () => void;
  onOpenNotifications: () => void;
  students?: Student[];
}

export const GuruDashboardView: React.FC<GuruDashboardViewProps> = ({
  onOpenAbsensiKelas,
  onNavigateToJadwal,
  onNavigateToRekap,
  onOpenNotifications,
  students = INITIAL_STUDENTS,
}) => {
  const [selectedDay] = useState('Selasa');
  const [selectedRosterSession, setSelectedRosterSession] = useState<{
    className: string;
    subject: string;
    room: string;
    timeRange: string;
    jpLabel: string;
    classId: string;
  } | null>(null);

  const teacherScheduleToday = [
    {
      id: 'g-sch-1',
      timeRange: '07:15 - 09:30 WIT',
      jpLabel: 'JP 1 - 3',
      className: 'XII TKJ 1',
      classId: 'e88128be-8fc3-4973-8d69-00ef17571626',
      subject: 'Pemodelan Perangkat Lunak (BA)',
      room: 'Lab Komputer 2',
      status: 'live',
      attendanceSubmitted: true,
      presentCount: 32,
      totalStudents: 34,
    },
    {
      id: 'g-sch-2',
      timeRange: '09:50 - 12:05 WIT',
      jpLabel: 'JP 4 - 6',
      className: 'XII RPL 2',
      classId: '3c456ddb-721a-42b9-9ec0-907f518213d5',
      subject: 'Basis Data & Cloud Computing',
      room: 'Lab Rekayasa Perangkat Lunak',
      status: 'upcoming',
      attendanceSubmitted: false,
      presentCount: 0,
      totalStudents: 36,
    },
    {
      id: 'g-sch-3',
      timeRange: '12:45 - 15:00 WIT',
      jpLabel: 'JP 7 - 9',
      className: 'XI TKJ 2',
      classId: '25c12e11-3b94-471b-b8d5-265c4a6b8919',
      subject: 'Teknologi Layanan Jaringan',
      room: 'Bengkel Jaringan',
      status: 'normal',
      attendanceSubmitted: false,
      presentCount: 0,
      totalStudents: 35,
    },
  ];

  return (
    <div className="flex flex-col w-full relative pb-28">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-[#00609b] via-[#0079c2] to-[#0761a2] pb-14 pt-4 px-4 rounded-b-[32px] relative overflow-hidden shadow-sm">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-[#77b7fe]/20 blur-2xl pointer-events-none" />
        <div className="absolute -left-10 bottom-0 w-36 h-36 rounded-full bg-[#6ffbbe]/15 blur-xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-white/30"
                src={ASSETS.teacherAvatar}
                alt="Portrait Guru"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#6ffbbe] rounded-full ring-2 ring-[#00609b]" />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[16px] text-white font-bold truncate">
                  Budi Santoso, S.Kom
                </span>
                <span className="text-base select-none">👨‍🏫</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#cfe4ff] font-semibold uppercase tracking-wider">
                  Guru Pengampu
                </span>
                <span className="w-1 h-1 rounded-full bg-[#cfe4ff]/60" />
                <span className="text-[11px] text-white/80">NIP: 196812291993031011</span>
              </div>
            </div>
          </div>

          <button
            aria-label="Notifikasi"
            type="button"
            onClick={onOpenNotifications}
            className="relative w-10 h-10 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 active:scale-95 transition-all shadow-sm shrink-0"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ffdad6]" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="relative z-10 mt-3 flex items-center justify-between bg-black/15 backdrop-blur-md rounded-xl py-1.5 px-3">
          <div className="flex items-center gap-1.5 text-white">
            <span className="material-symbols-outlined text-[16px] text-[#6ffbbe]">
              event_available
            </span>
            <span className="text-[11px] font-bold tracking-wide">
              {selectedDay}, 9 Okt 2026 • 3 Kelas Mengajar Hari Ini
            </span>
          </div>
          <span className="text-[11px] bg-[#6ffbbe] text-[#003823] px-2 py-0.5 rounded-full font-extrabold">
            Aktif
          </span>
        </div>
      </div>

      {/* Content Stream */}
      <div className="px-4 -mt-8 flex flex-col gap-4 relative z-20">
        {/* Active Class Highlight Card */}
        <div
          onClick={() => onOpenAbsensiKelas('e88128be-8fc3-4973-8d69-00ef17571626', 'XII TKJ 1', 'Pemodelan Perangkat Lunak (BA)')}
          className="bg-white rounded-3xl p-5 shadow-[0_10px_25px_-5px_rgba(0,95,160,0.12)] border-2 border-[#00609b]/20 hover:border-[#00609b] flex flex-col gap-3 cursor-pointer transition-all active:scale-[0.99] group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006947] animate-pulse" />
              <span className="text-[12px] uppercase tracking-wider text-[#404751] font-bold">
                KELAS SEDANG BERLANGSUNG
              </span>
            </div>
            <span className="bg-[#00855b]/10 text-[#006947] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              LIVE • JP 1-3
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h3 className="text-[19px] font-extrabold text-[#191c1e] group-hover:text-[#00609b] transition-colors">
                XII TKJ 1
              </h3>
              <span className="text-[12px] text-[#00609b] font-bold">
                07:15 - 09:30 WIT
              </span>
            </div>
            <p className="text-[13px] font-semibold text-[#404751]">
              Pemodelan Perangkat Lunak (BA)
            </p>
            <p className="text-[11px] text-[#707882]">
              📍 Lab Komputer 2 • 5 Siswa Terdaftar
            </p>
          </div>

          {/* Action Bar: 2 Menu Klik dengan Kata Sederhana */}
          <div className="pt-3 border-t border-[#eceef0] flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[12px] text-[#006947] font-bold">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>3 Hadir • 1 Izin • 1 Sakit</span>
            </div>

            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={onNavigateToRekap}
                className="px-3 py-2 rounded-full border border-[#c3c7cf] hover:bg-[#f0f4f8] text-[#404751] text-[11px] font-bold transition-all"
                title="Lihat Rekap Presensi Kelas"
              >
                Rekap
              </button>
              <button
                type="button"
                onClick={() => onOpenAbsensiKelas('e88128be-8fc3-4973-8d69-00ef17571626', 'XII TKJ 1', 'Pemodelan Perangkat Lunak (BA)')}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-[#00609b] to-[#0a75c2] text-white text-[12px] font-extrabold shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[17px]">how_to_reg</span>
                <span>Mulai Absen</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Tools Navigation */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={onNavigateToJadwal}
            className="p-3 bg-white rounded-2xl border border-[#eceef0] flex flex-col items-center gap-1.5 shadow-xs hover:border-[#00609b] active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[#cfe4ff]/60 text-[#00609b] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">calendar_month</span>
            </div>
            <span className="text-[11px] font-bold text-[#191c1e]">Jadwal Mengajar</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToRekap}
            className="p-3 bg-white rounded-2xl border border-[#eceef0] flex flex-col items-center gap-1.5 shadow-xs hover:border-[#00609b] active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[#6ffbbe]/30 text-[#006947] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">analytics</span>
            </div>
            <span className="text-[11px] font-bold text-[#191c1e]">Rekap Kehadiran</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenAbsensiKelas('e88128be-8fc3-4973-8d69-00ef17571626', 'XII TKJ 1', 'Roll Call')}
            className="p-3 bg-white rounded-2xl border border-[#eceef0] flex flex-col items-center gap-1.5 shadow-xs hover:border-[#00609b] active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[#d1e4ff]/60 text-[#0761a2] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">fact_check</span>
            </div>
            <span className="text-[11px] font-bold text-[#191c1e]">Lembar Absensi</span>
          </button>
        </div>

        {/* Today's Teaching Schedule List */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-[#191c1e]">
              Agenda Mengajar Hari Ini
            </h3>
            <span className="text-[11px] text-[#00609b] font-bold">
              3 Sesi Pelajaran
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {teacherScheduleToday.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3.5 border border-[#eceef0] shadow-xs flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#00609b]/10 text-[#00609b] text-[11px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-[13px] font-bold text-[#191c1e]">
                      {item.className}
                    </span>
                    <span className="text-[11px] text-[#707882]">
                      • {item.jpLabel}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#00609b]">
                    {item.timeRange}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-semibold text-[#404751] truncate max-w-[200px]">
                    {item.subject}
                  </span>
                  <span className="text-[11px] text-[#707882]">
                    {item.room}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#f2f4f6] flex items-center justify-between gap-2">
                  <span className="text-[11px] text-[#707882]">
                    {item.attendanceSubmitted ? '✅ Absensi Telah Divalidasi' : '⏳ Belum Diabsen'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedRosterSession(item)}
                      className="px-2.5 py-1 rounded-lg border border-[#c3c7cf] hover:bg-[#f0f4f8] text-[#404751] text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">analytics</span>
                      <span>Rekap</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenAbsensiKelas(item.classId, item.className, item.subject)}
                      className="px-3 py-1 rounded-lg bg-[#00609b] hover:bg-[#0079c2] text-white text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[15px]">how_to_reg</span>
                      <span>Absen</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── QUICK ROSTER REKAP MODAL (DAFTAR HADIR SISWA) ─── */}
      {selectedRosterSession && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-[#eceef0] overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#00609b] to-[#0a75c2] text-white p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#6ffbbe]">analytics</span>
                  <span className="text-[11px] uppercase font-bold tracking-wider text-[#cfe4ff]">
                    Rekap Presensi Sesi
                  </span>
                </div>
                <h3 className="text-[16px] font-extrabold">{selectedRosterSession.className}</h3>
                <p className="text-[11px] text-white/80">{selectedRosterSession.subject} • {selectedRosterSession.jpLabel}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRosterSession(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="bg-[#f7f9fb] px-4 py-2 border-b border-[#eceef0] flex items-center justify-between text-[11px] font-bold text-[#404751]">
              <span>📍 {selectedRosterSession.room}</span>
              <span className="text-[#00609b]">{selectedRosterSession.timeRange}</span>
            </div>

            {/* Student List */}
            <div className="p-4 overflow-y-auto divide-y divide-[#f2f4f6] flex-1">
              {(() => {
                const roster = students.filter(
                  (s) => !s.kelas || s.kelas === selectedRosterSession.className
                );
                const displayList = roster.length > 0 ? roster : students.slice(0, 5);

                const hadir = displayList.filter((s) => s.status === 'Hadir').length;
                const sakit = displayList.filter((s) => s.status === 'Sakit').length;
                const izin = displayList.filter((s) => s.status === 'Izin').length;
                const alfa = displayList.filter((s) => s.status === 'Alfa').length;

                return (
                  <div className="flex flex-col gap-3">
                    {/* Status Pill Counts */}
                    <div className="grid grid-cols-4 gap-1.5 text-center">
                      <div className="bg-emerald-50 text-emerald-800 p-2 rounded-xl">
                        <p className="text-[14px] font-extrabold">{hadir}</p>
                        <p className="text-[9px] font-bold uppercase">Hadir</p>
                      </div>
                      <div className="bg-sky-50 text-sky-800 p-2 rounded-xl">
                        <p className="text-[14px] font-extrabold">{sakit}</p>
                        <p className="text-[9px] font-bold uppercase">Sakit</p>
                      </div>
                      <div className="bg-amber-50 text-amber-800 p-2 rounded-xl">
                        <p className="text-[14px] font-extrabold">{izin}</p>
                        <p className="text-[9px] font-bold uppercase">Izin</p>
                      </div>
                      <div className="bg-rose-50 text-rose-800 p-2 rounded-xl">
                        <p className="text-[14px] font-extrabold">{alfa}</p>
                        <p className="text-[9px] font-bold uppercase">Alfa</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <p className="text-[11px] font-bold text-[#707882] uppercase tracking-wider">
                        Daftar Kehadiran Siswa ({displayList.length} Murid)
                      </p>
                      {displayList.map((s, idx) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-[#f7f9fb] transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-[#f2f4f6] text-[10px] font-bold flex items-center justify-center text-[#707882] shrink-0">
                              {idx + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="text-[12px] font-bold text-[#191c1e] truncate">{s.name}</p>
                              <p className="text-[10px] text-[#707882]">NIS: {s.nis}</p>
                              {s.note && (
                                <p className="text-[10px] text-amber-700 italic truncate max-w-[200px]">
                                  {s.note}
                                </p>
                              )}
                            </div>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                              s.status === 'Hadir'
                                ? 'bg-emerald-100 text-emerald-800'
                                : s.status === 'Sakit'
                                ? 'bg-sky-100 text-sky-800'
                                : s.status === 'Izin'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {s.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-3 bg-[#f7f9fb] border-t border-[#eceef0] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRosterSession(null);
                  onNavigateToRekap();
                }}
                className="px-3.5 py-2 rounded-xl border border-[#00609b] text-[#00609b] hover:bg-[#cfe4ff]/30 text-[11px] font-bold transition-all"
              >
                Halaman Rekap Detail →
              </button>
              <button
                type="button"
                onClick={() => {
                  const s = selectedRosterSession;
                  setSelectedRosterSession(null);
                  onOpenAbsensiKelas(s.classId, s.className, s.subject);
                }}
                className="px-4 py-2 rounded-xl bg-[#00609b] hover:bg-[#0079c2] text-white text-[11px] font-bold transition-all shadow-xs"
              >
                Mulai Absen Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
