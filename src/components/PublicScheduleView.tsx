import React, { useState } from 'react';
import { ASSETS } from '../data/mockData';
import { ScheduleSlot } from '../types';

interface PublicScheduleViewProps {
  schedules: ScheduleSlot[];
  onBackToLogin: () => void;
  onPrint: () => void;
}

export const PublicScheduleView: React.FC<PublicScheduleViewProps> = ({
  schedules,
  onBackToLogin,
  onPrint,
}) => {
  const [selectedClass, setSelectedClass] = useState('XII TKJ 1');
  const [selectedDay, setSelectedDay] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu'>('Selasa');
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);

  const days: ('Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu')[] = [
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
  ];

  const classList = [
    'XII TKJ 1',
    'XII TKJ 2',
    'XII RPL 1',
    'XII RPL 2',
    'XII DKV 1',
    'XI TKJ 1',
    'XI RPL 1',
    'X PPLG',
    'X TJKT 1',
  ];

  const currentDaySchedules = schedules.filter(
    (s) => !s.day || s.day === selectedDay
  );

  return (
    <div className="min-h-screen w-full bg-[#f7f9fb] flex flex-col font-sans pb-16">
      {/* Top Header Bar for Public View */}
      <header className="fixed top-0 w-full z-40 bg-[#00609b] text-white backdrop-blur-xl shadow-md">
        <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-lg mx-auto">
          <button
            type="button"
            onClick={onBackToLogin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-[12px] font-bold"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Masuk Akun</span>
          </button>

          <div className="flex items-center gap-2">
            <img
              src={ASSETS.logo}
              alt="Logo SMKN 1 Sorong"
              className="h-8 w-auto object-contain"
            />
            <div className="text-right">
              <h1 className="text-[14px] font-bold text-white leading-tight">
                Jadwal Publik
              </h1>
              <p className="text-[10px] text-[#cfe4ff]">SMKN 1 Sorong</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col relative w-full pt-16 max-w-lg mx-auto">
        {/* Banner */}
        <div className="bg-gradient-to-b from-[#00609b] to-[#0761a2] pt-4 pb-12 px-4 rounded-b-[28px] text-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#cfe4ff]">
              Akses Tamu / Publik
            </span>
            <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
              TA 2026/2027 Ganjil
            </span>
          </div>
          <h2 className="text-[18px] font-extrabold">
            Jadwal Pelajaran Sekolah
          </h2>
          <p className="text-[12px] text-[#cfe4ff]">
            Informasi mata pelajaran, kode pengampu, dan ruang belajar seluruh rombel.
          </p>
        </div>

        {/* Filter Card */}
        <div className="px-4 -mt-8 flex flex-col gap-3 relative z-10">
          <div className="bg-white rounded-2xl p-4 shadow-md border border-[#eceef0] flex flex-col gap-3">
            {/* Rombel Selector */}
            <div className="flex flex-col gap-1 relative">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#404751]">
                Pilih Kelas / Rombel
              </label>
              <div
                onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
                className="relative flex items-center bg-[#f2f4f6] rounded-xl px-3.5 py-2.5 cursor-pointer hover:bg-[#eceef0] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px] text-[#00609b] mr-2">
                  school
                </span>
                <span className="text-[14px] text-[#191c1e] font-extrabold flex-1 truncate">
                  {selectedClass}
                </span>
                <span className="material-symbols-outlined text-[20px] text-[#707882]">
                  expand_more
                </span>
              </div>

              {isClassDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-2xl shadow-2xl border border-[#eceef0] z-30 py-1.5 max-h-56 overflow-y-auto animate-fadeIn">
                  {classList.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setSelectedClass(c);
                        setIsClassDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-[#cfe4ff]/30 flex items-center justify-between ${
                        selectedClass === c ? 'font-bold text-[#00609b] bg-[#cfe4ff]/20' : 'text-[#191c1e]'
                      }`}
                    >
                      <span>{c}</span>
                      {selectedClass === c && (
                        <span className="material-symbols-outlined text-[18px] text-[#00609b]">
                          check
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Day Selector Chips */}
            <div className="flex flex-col gap-1.5 pt-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#404751]">
                Pilih Hari
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {days.map((day) => {
                  const isSelected = selectedDay === day;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all shrink-0 ${
                        isSelected
                          ? 'bg-[#00609b] text-white shadow-xs'
                          : 'bg-[#eceef0] text-[#404751] hover:bg-[#e6e8ea]'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Schedule List Header */}
          <div className="flex items-center justify-between px-1 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-extrabold text-[#191c1e]">
                {selectedDay} • {selectedClass}
              </span>
            </div>
            <button
              type="button"
              onClick={onPrint}
              className="text-[12px] font-bold text-[#00609b] hover:text-[#0761a2] flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Cetak / Simpan</span>
            </button>
          </div>

          {/* Schedule Slots */}
          <div className="flex flex-col gap-2.5">
            {currentDaySchedules.map((slot) => {
              if (slot.isBreak) {
                return (
                  <div
                    key={slot.id}
                    className="rounded-2xl px-4 py-2.5 bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-between shadow-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base select-none">☕</span>
                      <div>
                        <p className="text-[12px] font-bold">{slot.breakTitle}</p>
                        <p className="text-[11px] text-amber-800/80">{slot.breakSubtitle}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                      {slot.timeRange}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={slot.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-[#eceef0] flex flex-col gap-2.5 hover:border-[#00609b]/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#00609b] text-white text-[11px] font-extrabold">
                        {slot.jpLabel || `JP ${slot.jpStart}-${slot.jpEnd}`}
                      </span>
                      <span className="text-[12px] text-[#404751] font-semibold">
                        {slot.timeRange}
                      </span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-[#6ffbbe]/30 text-[#006947] text-[11px] font-bold">
                      {slot.room}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 pt-1 border-t border-[#f2f4f6]">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[15px] font-bold text-[#191c1e]">
                        {slot.subject}
                      </h3>
                      {slot.subjectCode && (
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#d1e4ff] text-[#001d36] font-extrabold">
                          Kode: {slot.subjectCode}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[#404751] text-[12px] mt-0.5">
                      <span className="material-symbols-outlined text-[16px] text-[#00609b]">
                        person
                      </span>
                      <span className="font-semibold">{slot.teacher}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Back to Login Action */}
          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full h-12 mt-2 rounded-full bg-[#00609b] text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">login</span>
            <span>Masuk dengan Akun Guru / Siswa / Admin</span>
          </button>
        </div>
      </main>
    </div>
  );
};
