import React, { useState } from 'react';
import { ASSETS } from '../data/mockData';
import { ScheduleSlot } from '../types';

interface GuruDashboardViewProps {
  onOpenAbsensiKelas: (classId: string, className: string, subjectName: string) => void;
  onNavigateToJadwal: () => void;
  onNavigateToRekap: () => void;
  onOpenNotifications: () => void;
}

export const GuruDashboardView: React.FC<GuruDashboardViewProps> = ({
  onOpenAbsensiKelas,
  onNavigateToJadwal,
  onNavigateToRekap,
  onOpenNotifications,
}) => {
  const [selectedDay] = useState('Selasa');

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
        <div className="bg-white rounded-3xl p-5 shadow-[0_10px_25px_-5px_rgba(0,95,160,0.1)] border border-[#eceef0] flex flex-col gap-3">
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
              <h3 className="text-[18px] font-extrabold text-[#191c1e]">
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
              📍 Lab Komputer 2 • 34 Siswa Terdaftar
            </p>
          </div>

          {/* Action Bar */}
          <div className="pt-3 border-t border-[#eceef0] flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[12px] text-[#006947] font-semibold">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>32 Hadir • 1 Izin • 1 Sakit</span>
            </div>

            <button
              type="button"
              onClick={() => onOpenAbsensiKelas('e88128be-8fc3-4973-8d69-00ef17571626', 'XII TKJ 1', 'Pemodelan Perangkat Lunak (BA)')}
              className="px-4 py-2 rounded-full bg-[#00609b] text-white text-[12px] font-bold shadow-sm hover:bg-[#004e80] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
              <span>Validasi Absen</span>
            </button>
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

                <div className="pt-2 border-t border-[#f2f4f6] flex items-center justify-between">
                  <span className="text-[11px] text-[#707882]">
                    {item.attendanceSubmitted ? '✅ Absensi Telah Divalidasi' : '⏳ Belum Diabsen'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenAbsensiKelas(item.classId, item.className, item.subject)}
                    className="text-[11px] font-bold text-[#00609b] hover:underline"
                  >
                    Buka Roll-Call →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
