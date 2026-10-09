import React, { useState, useRef } from 'react';
import { ASSETS } from '../data/mockData';
import { exportScheduleToExcel, exportAttendanceRecapToExcel, parseExcelToSchedules } from '../utils/excelHelper';
import { ScheduleSlot, Student } from '../types';

interface AdminDashboardViewProps {
  onOpenScheduleManager: () => void;
  onOpenPrintModal: () => void;
  onOpenAbsensiKelas: () => void;
  onOpenNotifications: () => void;
  roleTitle?: string;
  schedules?: ScheduleSlot[];
  students?: Student[];
  onImportSchedules?: (newSchedules: ScheduleSlot[]) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onOpenScheduleManager,
  onOpenPrintModal,
  onOpenAbsensiKelas,
  onOpenNotifications,
  roleTitle = 'Tata Usaha / Operator',
  schedules = [],
  students = [],
  onImportSchedules,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'hari_ini' | 'bulan_ini'>('hari_ini');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = {
    totalStudents: 1240,
    totalClasses: 36,
    attendanceRate: 96.8,
    presentToday: 1200,
    sickToday: 18,
    permitToday: 12,
    unexcusedToday: 10,
    totalTeachers: 78,
  };

  const classSummaries = [
    { id: '1', name: 'XII TKJ 1', hadir: 32, sakit: 1, izin: 1, alfa: 0, status: 'Tervalidasi' },
    { id: '2', name: 'XII RPL 1', hadir: 34, sakit: 2, izin: 0, alfa: 0, status: 'Tervalidasi' },
    { id: '3', name: 'XII DKV 1', hadir: 31, sakit: 1, izin: 2, alfa: 1, status: 'Menunggu Validasi' },
    { id: '4', name: 'XI TKJ 1', hadir: 35, sakit: 0, izin: 1, alfa: 0, status: 'Tervalidasi' },
    { id: '5', name: 'X PPLG', hadir: 36, sakit: 0, izin: 0, alfa: 0, status: 'Tervalidasi' },
  ];

  const handleExportScheduleExcel = () => {
    exportScheduleToExcel(schedules, 'XII_TKJ_1');
  };

  const handleExportRecapExcel = () => {
    exportAttendanceRecapToExcel(students, 'XII_TKJ_1', 'Oktober 2026');
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = await parseExcelToSchedules(file);
      if (onImportSchedules && parsed.length > 0) {
        onImportSchedules(parsed);
      }
    } catch (err: any) {
      alert(`Gagal import Excel: ${err?.message || 'Format tidak valid'}`);
    }
  };

  return (
    <div className="flex flex-col w-full relative pb-28">
      {/* Hidden file input for Excel upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFile}
        accept=".xlsx,.xls,.csv"
        className="hidden"
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-b from-[#00609b] via-[#0079c2] to-[#0761a2] pb-14 pt-4 px-4 rounded-b-[32px] relative overflow-hidden shadow-sm">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-[#77b7fe]/20 blur-2xl pointer-events-none" />
        <div className="absolute -left-10 bottom-0 w-36 h-36 rounded-full bg-[#6ffbbe]/15 blur-xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-full bg-white text-[#00609b] flex items-center justify-center font-extrabold text-[18px] shadow-sm ring-2 ring-white/30 shrink-0">
              🛠️
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[16px] text-white font-bold truncate">
                  Administrator SIAP
                </span>
                <span className="text-base select-none">⚡</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#cfe4ff] font-semibold uppercase tracking-wider">
                  {roleTitle}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#cfe4ff]/60" />
                <span className="text-[11px] text-white/80">SMKN 1 Sorong</span>
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

        {/* Live System Indicator */}
        <div className="relative z-10 mt-3 flex items-center justify-between bg-black/15 backdrop-blur-md rounded-xl py-1.5 px-3">
          <div className="flex items-center gap-1.5 text-white">
            <span className="material-symbols-outlined text-[16px] text-[#6ffbbe]">
              hub
            </span>
            <span className="text-[11px] font-bold tracking-wide">
              Server SIAP Realtime • Supabase DB Connected
            </span>
          </div>
          <span className="text-[11px] bg-[#6ffbbe] text-[#003823] px-2 py-0.5 rounded-full font-extrabold">
            Online
          </span>
        </div>
      </div>

      {/* Content Stream */}
      <div className="px-4 -mt-8 flex flex-col gap-4 relative z-20">
        {/* KPI Summary Card */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_10px_25px_-5px_rgba(0,95,160,0.1)] border border-[#eceef0] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006947] animate-pulse" />
              <span className="text-[12px] uppercase tracking-wider text-[#404751] font-bold">
                REKAPITULASI PRESENSI HARI INI
              </span>
            </div>
            <div className="flex bg-[#f2f4f6] p-0.5 rounded-lg text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setSelectedPeriod('hari_ini')}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  selectedPeriod === 'hari_ini' ? 'bg-[#00609b] text-white shadow-xs' : 'text-[#404751]'
                }`}
              >
                Hari Ini
              </button>
              <button
                type="button"
                onClick={() => setSelectedPeriod('bulan_ini')}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  selectedPeriod === 'bulan_ini' ? 'bg-[#00609b] text-white shadow-xs' : 'text-[#404751]'
                }`}
              >
                Bulan Ini
              </button>
            </div>
          </div>

          {/* KPI Numbers Grid */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-[#00855b]/10 p-2.5 rounded-2xl flex flex-col items-center">
              <span className="text-[18px] font-extrabold text-[#006947]">
                {stats.presentToday}
              </span>
              <span className="text-[10px] font-bold uppercase text-[#006947]">
                Hadir
              </span>
            </div>

            <div className="bg-purple-50 p-2.5 rounded-2xl flex flex-col items-center">
              <span className="text-[18px] font-extrabold text-purple-700">
                {stats.sickToday}
              </span>
              <span className="text-[10px] font-bold uppercase text-purple-700">
                Sakit
              </span>
            </div>

            <div className="bg-sky-50 p-2.5 rounded-2xl flex flex-col items-center">
              <span className="text-[18px] font-extrabold text-sky-700">
                {stats.permitToday}
              </span>
              <span className="text-[10px] font-bold uppercase text-sky-700">
                Izin
              </span>
            </div>

            <div className="bg-rose-50 p-2.5 rounded-2xl flex flex-col items-center">
              <span className="text-[18px] font-extrabold text-rose-700">
                {stats.unexcusedToday}
              </span>
              <span className="text-[10px] font-bold uppercase text-rose-700">
                Alfa
              </span>
            </div>
          </div>

          {/* Percentage Bar */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-[#eceef0]">
            <div className="flex items-center justify-between text-[12px] font-bold">
              <span className="text-[#191c1e]">Tingkat Kehadiran Sekolah</span>
              <span className="text-[#00609b]">{stats.attendanceRate}%</span>
            </div>
            <div className="w-full bg-[#f2f4f6] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#00609b] to-[#00855b] h-full rounded-full"
                style={{ width: `${stats.attendanceRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Excel & Management Tools (Feature #1) */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#eceef0] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-[#191c1e] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#00609b] text-[18px]">
                table_chart
              </span>
              <span>Kelola &amp; Ekspor Excel (.xlsx)</span>
            </h3>
            <span className="text-[10px] font-bold bg-[#6ffbbe]/30 text-[#006947] px-2 py-0.5 rounded-full">
              Operator Toolkit
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handleExportScheduleExcel}
              className="p-3 bg-[#f2f4f6] hover:bg-[#cfe4ff]/50 rounded-2xl border border-[#eceef0] flex flex-col items-center gap-1 text-center active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#00609b] text-[22px]">
                file_download
              </span>
              <span className="text-[11px] font-bold text-[#191c1e]">Ekspor Jadwal</span>
              <span className="text-[9px] text-[#707882]">Format .xlsx</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-[#f2f4f6] hover:bg-[#cfe4ff]/50 rounded-2xl border border-[#eceef0] flex flex-col items-center gap-1 text-center active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#0761a2] text-[22px]">
                upload_file
              </span>
              <span className="text-[11px] font-bold text-[#191c1e]">Impor Jadwal</span>
              <span className="text-[9px] text-[#707882]">Upload Excel</span>
            </button>

            <button
              type="button"
              onClick={handleExportRecapExcel}
              className="p-3 bg-[#f2f4f6] hover:bg-[#6ffbbe]/30 rounded-2xl border border-[#eceef0] flex flex-col items-center gap-1 text-center active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#006947] text-[22px]">
                bar_chart
              </span>
              <span className="text-[11px] font-bold text-[#191c1e]">Ekspor Rekap</span>
              <span className="text-[9px] text-[#707882]">Presensi Bulanan</span>
            </button>
          </div>
        </div>

        {/* Quick Admin Actions Grid */}
        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={onOpenScheduleManager}
            className="flex flex-col items-center gap-1.5 group active:scale-95 transition-transform cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#cfe4ff]/60 flex items-center justify-center shadow-xs group-hover:bg-[#cfe4ff] transition-colors">
              <span className="material-symbols-outlined text-[#00609b] text-[26px]">
                edit_calendar
              </span>
            </div>
            <span className="text-[11px] text-[#191c1e] font-semibold text-center leading-tight">
              Tambah Slot
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenPrintModal}
            className="flex flex-col items-center gap-1.5 group active:scale-95 transition-transform cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#d1e4ff]/60 flex items-center justify-center shadow-xs group-hover:bg-[#d1e4ff] transition-colors">
              <span className="material-symbols-outlined text-[#0761a2] text-[26px]">
                print
              </span>
            </div>
            <span className="text-[11px] text-[#191c1e] font-semibold text-center leading-tight">
              Cetak Rekap
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenAbsensiKelas}
            className="flex flex-col items-center gap-1.5 group active:scale-95 transition-transform cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#6ffbbe]/30 flex items-center justify-center shadow-xs group-hover:bg-[#6ffbbe]/50 transition-colors">
              <span className="material-symbols-outlined text-[#006947] text-[26px]">
                checklist_rtl
              </span>
            </div>
            <span className="text-[11px] text-[#191c1e] font-semibold text-center leading-tight">
              Review Absen
            </span>
          </button>

          <button
            type="button"
            onClick={handleExportRecapExcel}
            className="flex flex-col items-center gap-1.5 group active:scale-95 transition-transform cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center shadow-xs group-hover:bg-purple-200 transition-colors">
              <span className="material-symbols-outlined text-purple-700 text-[26px]">
                ios_share
              </span>
            </div>
            <span className="text-[11px] text-[#191c1e] font-semibold text-center leading-tight">
              Export Excel
            </span>
          </button>
        </div>

        {/* Realtime Class Roll-Call Status */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-[#191c1e]">
              Status Presensi Per Rombel
            </h3>
            <span className="text-[11px] text-[#00609b] font-bold">
              36 Kelas Terdaftar
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {classSummaries.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl p-3.5 border border-[#eceef0] shadow-xs flex items-center justify-between"
              >
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-[#191c1e]">
                      {c.name}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        c.status === 'Tervalidasi'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#707882] mt-0.5">
                    Hadir: <strong className="text-[#006947]">{c.hadir}</strong> • S: {c.sakit} • I: {c.izin} • A: {c.alfa}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onOpenAbsensiKelas}
                  className="px-3 py-1.5 rounded-full bg-[#f2f4f6] hover:bg-[#cfe4ff] text-[#00609b] text-[11px] font-bold transition-colors cursor-pointer"
                >
                  Detail →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
