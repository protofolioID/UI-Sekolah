import React, { useState, useRef } from 'react';
import { ScheduleSlot } from '../types';
import { exportScheduleToExcel, parseExcelToSchedules } from '../utils/excelHelper';
import { TEACHER_SCHEDULES } from '../data/mockData';

interface JadwalViewProps {
  schedules: ScheduleSlot[];
  teacherSchedules?: ScheduleSlot[];
  onOpenAddModal: () => void;
  onOpenEditModal: (slot: ScheduleSlot) => void;
  onDeleteSlot: (id: string, subject: string) => void;
  onPrint: () => void;
  onOpenAbsensiKelas: (slot: ScheduleSlot) => void;
  userRole?: 'siswa' | 'guru' | 'admin' | 'superadmin';
  onImportSchedules?: (newSchedules: ScheduleSlot[]) => void;
}

export const JadwalView: React.FC<JadwalViewProps> = ({
  schedules,
  teacherSchedules = TEACHER_SCHEDULES,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteSlot,
  onPrint,
  onOpenAbsensiKelas,
  userRole = 'siswa',
  onImportSchedules,
}) => {
  const [selectedClass, setSelectedClass] = useState('XII TKJ 1');
  const [selectedDay, setSelectedDay] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu'>('Selasa');
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const days: ('Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu')[] = [
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
  ];

  const isAdminOrSuper = userRole === 'admin' || userRole === 'superadmin';
  const isGuru = userRole === 'guru';

  // Schedule filtering:
  // - GURU: Shows teacher's own teaching schedule
  // - SISWA/ADMIN: Shows class timetable filtered to selectedClass and selectedDay
  const activePool = isGuru ? teacherSchedules : schedules;
  const currentDaySchedules = activePool.filter((s) => {
    if (s.day !== selectedDay) return false;
    if (isGuru) return true;
    if (s.isBreak) return true;
    if (!s.classTarget) return true;
    return s.classTarget === selectedClass;
  });

  const handleExportExcel = () => {
    exportScheduleToExcel(activePool, isGuru ? 'Agenda_Guru' : selectedClass);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await parseExcelToSchedules(file);
      if (onImportSchedules && imported.length > 0) {
        onImportSchedules(imported);
      }
    } catch (err: any) {
      alert(`Gagal membaca file Excel: ${err?.message || 'Format tidak valid'}`);
    }
  };

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Hidden file input for Excel Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx,.xls,.csv"
        className="hidden"
      />

      {/* Atmospheric Curved Header */}
      <div className="relative bg-gradient-to-b from-[#00609b] to-[#0761a2] pt-4 pb-14 px-4 rounded-b-[28px] shadow-sm text-white">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-[#6ffbbe]">
              event_available
            </span>
            <span className="text-[12px] tracking-wider uppercase opacity-90 font-bold">
              {isGuru ? 'Agenda Mengajar Guru' : 'Jadwal Pelajaran Rombel'}
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold shadow-xs">
            Semester Ganjil 2026/2027
          </span>
        </div>

        {/* Quick Classroom / Teacher Meta Bar */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-[#cfe4ff] uppercase tracking-wider font-semibold">
              {isGuru ? 'Guru Pengampu' : 'Kompetensi Keahlian'}
            </p>
            <p className="text-[17px] font-extrabold leading-tight">
              {isGuru ? 'Budi Santoso, S.Kom' : 'Teknik Komputer & Jaringan (TKJ)'}
            </p>
            {isGuru && (
              <p className="text-[11px] text-white/80">NIP: 196812291993031011 • SMKN 1 Sorong</p>
            )}
          </div>

          {!isGuru && (
            <button
              type="button"
              onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
              aria-label="Filter rombel"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/15 backdrop-blur-md hover:bg-white/25 active:scale-95 transition-all text-white"
            >
              <span className="material-symbols-outlined text-white text-[22px]">tune</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Floating Island Content Area */}
      <div className="px-4 -mt-9 flex flex-col gap-3 pb-8 relative z-10">
        {/* Filter Selector Card */}
        <div className="bg-white rounded-2xl p-3 shadow-md border border-[#eceef0]/70">
          <div className={`grid ${isGuru ? 'grid-cols-1' : 'grid-cols-2'} gap-2 relative`}>
            {/* Selector 1: Kelas (Hanya untuk Siswa/Admin) */}
            {!isGuru && (
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
            )}

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
              {isGuru ? `Agenda Mengajar ${selectedDay}` : `Jadwal ${selectedDay}`}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#cfe4ff] text-[#001d34] text-[11px] font-bold">
              {currentDaySchedules.filter((s) => !s.isBreak).length} Sesi
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Operator/Admin Excel Export & Import */}
            {isAdminOrSuper && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Import Jadwal dari File Excel"
                  className="text-[#00609b] bg-[#cfe4ff]/50 hover:bg-[#cfe4ff] px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">upload_file</span>
                  <span>Import</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportExcel}
                  title="Export Jadwal ke Excel (.xlsx)"
                  className="text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">file_download</span>
                  <span>Excel</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onPrint}
              className="text-[#00609b] hover:text-[#0761a2] text-[12px] font-bold flex items-center gap-0.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Cetak</span>
            </button>
          </div>
        </div>

        {/* Timetable List Container */}
        <div className="bg-white rounded-2xl shadow-md border border-[#eceef0]/70 p-3 grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {currentDaySchedules.length === 0 ? (
            <div className="col-span-full py-8 text-center text-[#707882] text-[13px]">
              Tidak ada agenda pembelajaran pada hari {selectedDay}.
            </div>
          ) : (
            currentDaySchedules.map((slot) => {
              // Render Break Divider Card
              if (slot.isBreak) {
                const isAmber = slot.breakColor === 'amber';
                return (
                  <div
                    key={slot.id}
                    className={`col-span-full rounded-xl px-3 py-2 flex items-center justify-between shadow-xs ${
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
                          className={`text-[11px] ${
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
                  className="relative bg-[#f7f9fb] rounded-2xl p-3.5 flex flex-col gap-2 transition-all hover:bg-[#f2f4f6] border border-[#eceef0]/60 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-white text-[11px] font-bold shadow-xs ${
                          slot.badgeType === 'live'
                            ? 'bg-emerald-600 animate-pulse'
                            : slot.jpStart === 1
                            ? 'bg-[#00609b]'
                            : 'bg-[#0761a2]'
                        }`}
                      >
                        {slot.jpLabel || `JP ${slot.jpStart} - ${slot.jpEnd}`}
                      </span>
                      <span className="text-[12px] text-[#404751] font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#707882]">
                          schedule
                        </span>
                        {slot.timeRange}
                      </span>
                    </div>

                    {/* Class Target Badge (Khusus Agenda Guru) */}
                    {isGuru && slot.classTarget && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#00609b]/15 text-[#00609b] text-[11px] font-extrabold">
                        {slot.classTarget}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-[14px] font-bold text-[#191c1e] leading-snug">
                      {slot.subject}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-[#404751]">
                      <span>{isGuru ? `Rombel: ${slot.classTarget || 'XII TKJ 1'}` : `Pengampu: ${slot.teacher}`}</span>
                      <span className="font-medium text-[#707882]">📍 {slot.room}</span>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-2 border-t border-[#eceef0] flex items-center justify-between">
                    {isGuru ? (
                      <button
                        type="button"
                        onClick={() => onOpenAbsensiKelas(slot)}
                        className="w-full py-1.5 rounded-xl bg-[#00609b] hover:bg-[#0079c2] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-98 transition-all"
                      >
                        <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                        <span>Isi Absen Kelas Ini</span>
                      </button>
                    ) : isAdminOrSuper ? (
                      <div className="w-full flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onOpenEditModal(slot)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-[#c3c7cf] text-[#404751] hover:text-[#00609b] text-[11px] font-bold flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">edit</span>
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteSlot(slot.id, slot.subject || 'Mapel')}
                          className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-bold flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-[#707882] italic">
                        Presensi dicatat guru pengampu
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
