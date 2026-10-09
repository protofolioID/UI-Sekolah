import React, { useState } from 'react';
import { ScheduleSlot } from '../types';

interface JadwalViewProps {
  schedules: ScheduleSlot[];
  onOpenAddModal: () => void;
  onOpenEditModal: (slot: ScheduleSlot) => void;
  onDeleteSlot: (id: string, subject: string) => void;
  onPrint: () => void;
  onOpenAbsensiKelas: (slot: ScheduleSlot) => void;
}

export const JadwalView: React.FC<JadwalViewProps> = ({
  schedules,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteSlot,
  onPrint,
  onOpenAbsensiKelas,
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

  const currentDaySchedules = schedules.filter(
    (s) => !s.day || s.day === selectedDay
  );

  return (
    <div className="flex flex-col w-full pb-24">
      {/* DANA Style Atmospheric Curved Header Extension */}
      <div className="relative bg-gradient-to-b from-[#00609b] to-[#0761a2] pt-4 pb-14 px-4 rounded-b-[28px] shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-white">
            <span className="material-symbols-outlined text-[20px] text-[#6ffbbe]">
              event_available
            </span>
            <span className="text-[12px] tracking-wider uppercase opacity-90 font-bold">
              Tahun Ajaran 2026/2027
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold shadow-xs">
            Semester Ganjil
          </span>
        </div>

        {/* Quick Classroom Meta Bar */}
        <div className="flex items-center justify-between text-white">
          <div>
            <p className="text-[11px] text-[#cfe4ff] uppercase tracking-wider font-semibold">
              Jurusan &amp; Ruang
            </p>
            <p className="text-[16px] font-bold">Teknik Komputer &amp; Jaringan</p>
          </div>
          <button
            type="button"
            onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
            aria-label="Filter rombel"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/15 backdrop-blur-md hover:bg-white/25 active:scale-95 transition-all text-white"
          >
            <span className="material-symbols-outlined text-white text-[22px]">tune</span>
          </button>
        </div>
      </div>

      {/* Main Floating Island Content Area */}
      <div className="px-4 -mt-9 flex flex-col gap-3 pb-8 relative z-10">
        {/* Filter Selector Card (DANA Floating Module) */}
        <div className="bg-white rounded-2xl p-3 shadow-md border border-[#eceef0]/70">
          <div className="grid grid-cols-2 gap-2 relative">
            {/* Selector 1: Kelas */}
            <div className="flex flex-col gap-1 relative">
              <label className="text-[11px] text-[#404751] font-semibold">
                Pilih Rombel / Kelas
              </label>
              <div
                onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
                className="relative flex items-center bg-[#f2f4f6] rounded-xl px-3 py-2 cursor-pointer hover:bg-[#eceef0] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-[#00609b] mr-1.5">
                  school
                </span>
                <span className="text-[14px] text-[#191c1e] font-bold flex-1 truncate">
                  {selectedClass}
                </span>
                <span className="material-symbols-outlined text-[18px] text-[#707882]">
                  expand_more
                </span>
              </div>

              {isClassDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-xl shadow-xl border border-[#eceef0] z-30 py-1 overflow-hidden animate-fadeIn">
                  {['XII TKJ 1', 'XII TKJ 2', 'XI RPL 1', 'XI TKJ 1', 'X DKV 1'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setSelectedClass(c);
                        setIsClassDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-[12px] hover:bg-[#cfe4ff]/30 flex items-center justify-between ${
                        selectedClass === c ? 'font-bold text-[#00609b] bg-[#cfe4ff]/20' : 'text-[#191c1e]'
                      }`}
                    >
                      {c}
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

            {/* Selector 2: Hari */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-[#404751] font-semibold">
                Hari Pembelajaran
              </label>
              <div className="relative flex items-center bg-[#f2f4f6] rounded-xl px-3 py-2 cursor-pointer hover:bg-[#eceef0] transition-colors">
                <span className="material-symbols-outlined text-[18px] text-[#00609b] mr-1.5">
                  calendar_today
                </span>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value as any)}
                  className="w-full bg-transparent text-[14px] text-[#191c1e] font-bold appearance-none outline-hidden cursor-pointer"
                >
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined text-[18px] text-[#707882] pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Quick Day Strip Carousel */}
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[#eceef0] overflow-x-auto no-scrollbar">
            {days.map((day) => {
              const isSelected = selectedDay === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all shrink-0 flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#00609b] text-white font-bold shadow-xs'
                      : 'bg-[#eceef0] text-[#404751] hover:bg-[#e6e8ea]'
                  }`}
                >
                  <span>{day}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6ffbbe]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timetable Overview Header Strip */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-[16px] text-[#191c1e] font-bold">
              Jadwal Aktif Hari Ini
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#cfe4ff] text-[#001d34] text-[11px] font-bold">
              4 Sesi (9 JP)
            </span>
          </div>
          <button
            type="button"
            onClick={onPrint}
            className="text-[#00609b] hover:text-[#0761a2] text-[12px] font-bold flex items-center gap-0.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            Cetak
          </button>
        </div>

        {/* Timetable List Container (DANA elevated multi-slot card) */}
        <div className="bg-white rounded-2xl shadow-md border border-[#eceef0]/70 p-3 flex flex-col gap-2.5">
          {currentDaySchedules.map((slot) => {
            // Render Break Divider Card
            if (slot.isBreak) {
              const isAmber = slot.breakColor === 'amber';
              return (
                <div
                  key={slot.id}
                  className={`rounded-xl px-3 py-2 flex items-center justify-between shadow-xs ${
                    isAmber
                      ? 'bg-amber-50 text-amber-950 border border-amber-200/50'
                      : 'bg-emerald-50 text-emerald-950 border border-emerald-200/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        isAmber
                          ? 'bg-amber-200/80 text-amber-900'
                          : 'bg-emerald-200/80 text-emerald-900'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {slot.breakIcon || (isAmber ? 'coffee' : 'mosque')}
                      </span>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold tracking-tight">
                        {slot.breakTitle}
                      </p>
                      <p
                        className={`text-[12px] ${
                          isAmber ? 'text-amber-800/80' : 'text-emerald-800/80'
                        }`}
                      >
                        {slot.breakSubtitle}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                      isAmber
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    {slot.breakDuration}
                  </span>
                </div>
              );
            }

            // Normal Schedule Slot
            return (
              <div
                key={slot.id}
                className="relative bg-[#f7f9fb] rounded-xl p-3 flex flex-col gap-2 transition-all hover:bg-[#f2f4f6] border border-[#eceef0]/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-white text-[11px] font-bold shadow-xs ${
                        slot.jpStart === 1
                          ? 'bg-[#00609b]'
                          : slot.jpStart === 7
                          ? 'bg-[#00609b]'
                          : 'bg-[#0761a2]'
                      }`}
                    >
                      {slot.jpLabel || `JP ${slot.jpStart} - ${slot.jpEnd}`}
                    </span>
                    <span className="text-[12px] text-[#404751] font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#707882]">
                        schedule
                      </span>
                      {slot.timeRange}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="Absensi Sesi"
                      title="Buka Absensi Kelas"
                      onClick={() => onOpenAbsensiKelas(slot)}
                      className="w-8 h-8 rounded-lg bg-[#00855b]/10 flex items-center justify-center text-[#006947] hover:bg-[#00855b]/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        fact_check
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label="Edit Sesi"
                      onClick={() => onOpenEditModal(slot)}
                      className="w-8 h-8 rounded-lg bg-[#eceef0] flex items-center justify-center text-[#00609b] hover:bg-[#cfe4ff] hover:text-[#001d34] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button
                      type="button"
                      aria-label="Hapus Sesi"
                      onClick={() => onDeleteSlot(slot.id, slot.subject || '')}
                      className="w-8 h-8 rounded-lg bg-[#ffdad6]/60 flex items-center justify-center text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2 pt-0.5">
                  <div className="min-w-0">
                    <h2 className="text-[16px] text-[#191c1e] truncate font-bold">
                      {slot.subject}
                    </h2>
                    <div className="flex items-center gap-1.5 text-[#404751] mt-0.5">
                      <span className="material-symbols-outlined text-[15px] text-[#006947]">
                        person
                      </span>
                      <p className="text-[12px] truncate">{slot.teacher}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-[#00855b]/15 text-[#006947] text-[11px] shrink-0 font-bold">
                    {slot.room}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Prominent Action Trigger Button: Tambah Jadwal Baru */}
        <button
          type="button"
          onClick={onOpenAddModal}
          className="w-full h-[52px] rounded-full bg-gradient-to-r from-[#00609b] to-[#0761a2] text-white text-[14px] font-bold flex items-center justify-center gap-2 shadow-[0_8px_16px_-2px_rgba(0,134,214,0.32)] active:scale-[0.99] transition-transform hover:opacity-95"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          Tambah Jadwal Baru
        </button>

        {/* Quick Insights Info Strip */}
        <div className="bg-[#f2f4f6] rounded-xl p-3 flex items-start gap-2.5 border border-[#eceef0]">
          <span className="material-symbols-outlined text-[#00609b] text-[20px] shrink-0 mt-0.5">
            verified_user
          </span>
          <div className="text-[#404751]">
            <p className="text-[12px] font-bold text-[#191c1e]">
              Validasi Jadwal Otomatis
            </p>
            <p className="text-[12px] leading-relaxed">
              Sistem mendeteksi bentrok ruangan &amp; jam mengajar guru secara real-time di
              lingkungan SMKN 1 Sorong.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
