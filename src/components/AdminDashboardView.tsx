import React, { useState, useRef } from 'react';
import {
  exportScheduleToExcel,
  exportAttendanceRecapToExcel,
  parseExcelToSchedules,
  exportStudentsToExcel,
  parseExcelToStudents,
} from '../utils/excelHelper';
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
  onImportStudents?: (newStudents: Student[]) => void;
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
  onImportStudents,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'hari_ini' | 'bulan_ini'>('hari_ini');
  const [activeTab, setActiveTab] = useState<'operasional' | 'superadmin'>('operasional');
  const [toastFeedback, setToastFeedback] = useState<string | null>(null);

  const scheduleFileInputRef = useRef<HTMLInputElement>(null);
  const studentFileInputRef = useRef<HTMLInputElement>(null);

  const isSuperadmin = roleTitle.toLowerCase().includes('super') || roleTitle.toLowerCase().includes('kepala');

  const showFeedback = (msg: string) => {
    setToastFeedback(msg);
    setTimeout(() => setToastFeedback(null), 3000);
  };

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

  const auditLogs = [
    { id: 'log-1', time: '08:50 WIT', user: 'Budi Santoso, S.Kom', action: 'Kunci Presensi JP 1-3 (XII TKJ 1 - 32 Hadir)' },
    { id: 'log-2', time: '08:15 WIT', user: 'Tata Usaha SMKN 1', action: 'Update Jadwal Rombel XII RPL 2' },
    { id: 'log-3', time: '07:15 WIT', user: 'Sistem SIAP Server', action: 'Sinkronisasi Otomatis PostgreSQL Supabase (1.000 Jadwal Aktif)' },
    { id: 'log-4', time: 'Kemarin', user: 'Superadmin IT', action: 'Backup Rutin Database & Snapshot Rombel' },
  ];

  // ─── EXCEL ACTIONS ───
  const handleExportScheduleExcel = () => {
    exportScheduleToExcel(schedules, 'XII_TKJ_1');
    showFeedback('Jadwal rombel berhasil diekspor ke format Excel (.xlsx)!');
  };

  const handleExportStudentExcel = () => {
    exportStudentsToExcel(students, 'XII_TKJ_1');
    showFeedback('Data roster siswa berhasil diekspor ke Excel (.xlsx)!');
  };

  const handleExportRecapExcel = () => {
    exportAttendanceRecapToExcel(students, 'XII_TKJ_1', 'Oktober 2026');
    showFeedback('Rekap presensi sekolah berhasil diekspor ke Excel (.xlsx)!');
  };

  const handleImportScheduleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = await parseExcelToSchedules(file);
      if (onImportSchedules && parsed.length > 0) {
        onImportSchedules(parsed);
        showFeedback(`${parsed.length} slot jadwal berhasil diimpor dari Excel!`);
      }
    } catch (err: any) {
      alert(`Gagal impor file jadwal: ${err?.message || 'Format tidak valid'}`);
    }
  };

  const handleImportStudentFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = await parseExcelToStudents(file);
      if (onImportStudents && parsed.length > 0) {
        onImportStudents(parsed);
        showFeedback(`${parsed.length} data siswa berhasil diimpor dari Excel!`);
      }
    } catch (err: any) {
      alert(`Gagal impor file siswa: ${err?.message || 'Format tidak valid'}`);
    }
  };

  const handleResetPasswordBulk = () => {
    if (window.confirm('Reset semua kata sandi guru dan siswa yang bermasalah ke standar default "Demo@2026"?')) {
      showFeedback('Kredensial berhasil disetel ulang ke default: Demo@2026!');
    }
  };

  return (
    <div className="flex flex-col w-full relative pb-28">
      {/* Hidden file inputs for Excel imports */}
      <input
        type="file"
        ref={scheduleFileInputRef}
        onChange={handleImportScheduleFile}
        accept=".xlsx,.xls,.csv"
        className="hidden"
      />
      <input
        type="file"
        ref={studentFileInputRef}
        onChange={handleImportStudentFile}
        accept=".xlsx,.xls,.csv"
        className="hidden"
      />

      {/* Header Banner */}
      <div
        className={`pb-14 pt-4 px-4 rounded-b-[32px] relative overflow-hidden shadow-sm text-white ${
          isSuperadmin
            ? 'bg-gradient-to-b from-[#3b0764] via-[#581c87] to-[#00609b]'
            : 'bg-gradient-to-b from-[#00609b] via-[#0079c2] to-[#0761a2]'
        }`}
      >
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-10 bottom-0 w-36 h-36 rounded-full bg-[#6ffbbe]/15 blur-xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-full bg-white text-[#00609b] flex items-center justify-center font-extrabold text-[20px] shadow-sm ring-2 ring-white/30 shrink-0">
              {isSuperadmin ? '👑' : '🛠️'}
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[16px] text-white font-bold truncate">
                  {isSuperadmin ? 'Superadmin SIAP' : 'Administrator SIAP'}
                </span>
                <span className="text-base select-none">{isSuperadmin ? '✨' : '⚡'}</span>
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
        <div className="relative z-10 mt-3 flex items-center justify-between bg-black/20 backdrop-blur-md rounded-xl py-1.5 px-3">
          <div className="flex items-center gap-1.5 text-white">
            <span className="material-symbols-outlined text-[16px] text-[#6ffbbe]">
              dns
            </span>
            <span className="text-[11px] font-bold tracking-wide">
              {isSuperadmin ? 'Root Control Panel • Supabase DB Connected' : 'Operator Portal • Realtime Sync'}
            </span>
          </div>
          <span className="text-[10px] bg-[#6ffbbe] text-[#003823] px-2.5 py-0.5 rounded-full font-extrabold">
            {isSuperadmin ? 'ROOT OK' : 'ONLINE'}
          </span>
        </div>
      </div>

      {/* Content Stream */}
      <div className="px-4 -mt-8 flex flex-col gap-4 relative z-20">
        {/* Superadmin Mode Switcher Pills (If Superadmin) */}
        {isSuperadmin && (
          <div className="bg-white p-1 rounded-2xl shadow-sm border border-[#eceef0] flex gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('operasional')}
              className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all ${
                activeTab === 'operasional'
                  ? 'bg-[#00609b] text-white shadow-xs'
                  : 'text-[#404751] hover:bg-[#f2f4f6]'
              }`}
            >
              📊 Ringkasan &amp; Operasional
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('superadmin')}
              className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all ${
                activeTab === 'superadmin'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-[#404751] hover:bg-[#f2f4f6]'
              }`}
            >
              👑 Kontrol Root &amp; Kebijakan
            </button>
          </div>
        )}

        {/* ─── TAB 1: OPERASIONAL & TOOLKIT ─── */}
        {activeTab === 'operasional' ? (
          <>
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

            {/* PUSAT IMPORT & EXPORT EXCEL (POINT 9 & FEATURE #5) */}
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#eceef0] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-[#191c1e] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#00609b] text-[18px]">
                    file_present
                  </span>
                  <span>Pusat Import &amp; Export Data (.xlsx)</span>
                </h3>
                <span className="text-[10px] font-bold bg-[#6ffbbe]/30 text-[#006947] px-2 py-0.5 rounded-full">
                  Toolkit Operator
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* 1. JADWAL PELAJARAN */}
                <div className="p-3 bg-[#f7f9fb] rounded-2xl border border-[#eceef0] flex flex-col justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#cfe4ff] text-[#00609b] flex items-center justify-center text-[14px]">
                      📅
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-[#191c1e] truncate">Jadwal Pelajaran</p>
                      <p className="text-[9px] text-[#707882]">Slot JP per Rombel</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 pt-1 border-t border-[#eceef0]">
                    <button
                      type="button"
                      onClick={handleExportScheduleExcel}
                      className="flex-1 py-1 px-2 rounded-lg bg-white border border-[#cfe4ff] hover:bg-[#cfe4ff]/30 text-[10px] font-bold text-[#00609b] flex items-center justify-center gap-1 active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[13px]">download</span>
                      <span>Ekspor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => scheduleFileInputRef.current?.click()}
                      className="flex-1 py-1 px-2 rounded-lg bg-[#00609b] hover:bg-[#0079c2] text-[10px] font-bold text-white flex items-center justify-center gap-1 active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[13px]">upload</span>
                      <span>Impor</span>
                    </button>
                  </div>
                </div>

                {/* 2. DATA SISWA & ROMBEL */}
                <div className="p-3 bg-[#f7f9fb] rounded-2xl border border-[#eceef0] flex flex-col justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#d1e4ff] text-[#0761a2] flex items-center justify-center text-[14px]">
                      🎓
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-[#191c1e] truncate">Data Siswa / Roster</p>
                      <p className="text-[9px] text-[#707882]">Nama, NISN, Rombel</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 pt-1 border-t border-[#eceef0]">
                    <button
                      type="button"
                      onClick={handleExportStudentExcel}
                      className="flex-1 py-1 px-2 rounded-lg bg-white border border-[#d1e4ff] hover:bg-[#d1e4ff]/30 text-[10px] font-bold text-[#0761a2] flex items-center justify-center gap-1 active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[13px]">download</span>
                      <span>Ekspor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => studentFileInputRef.current?.click()}
                      className="flex-1 py-1 px-2 rounded-lg bg-[#0761a2] hover:bg-[#00487a] text-[10px] font-bold text-white flex items-center justify-center gap-1 active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[13px]">upload</span>
                      <span>Impor</span>
                    </button>
                  </div>
                </div>

                {/* 3. REKAP BULANAN */}
                <div className="p-3 bg-[#f7f9fb] rounded-2xl border border-[#eceef0] flex flex-col justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#6ffbbe]/30 text-[#006947] flex items-center justify-center text-[14px]">
                      📊
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-[#191c1e] truncate">Rekapitulasi Presensi</p>
                      <p className="text-[9px] text-[#707882]">Laporan Sekolah .xlsx</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 pt-1 border-t border-[#eceef0]">
                    <button
                      type="button"
                      onClick={handleExportRecapExcel}
                      className="w-full py-1 px-2 rounded-lg bg-[#006947] hover:bg-[#005236] text-[10px] font-bold text-white flex items-center justify-center gap-1 active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[13px]">download</span>
                      <span>Ekspor Rekap Bulanan</span>
                    </button>
                  </div>
                </div>
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
                  Cetak Jadwal
                </span>
              </button>

              <button
                type="button"
                onClick={onOpenAbsensiKelas}
                className="flex flex-col items-center gap-1.5 group active:scale-95 transition-transform cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#6ffbbe]/30 flex items-center justify-center shadow-xs group-hover:bg-[#6ffbbe]/50 transition-colors">
                  <span className="material-symbols-outlined text-[#006947] text-[26px]">
                    checklist
                  </span>
                </div>
                <span className="text-[11px] text-[#191c1e] font-semibold text-center leading-tight">
                  Validasi Absen
                </span>
              </button>

              <button
                type="button"
                onClick={handleExportRecapExcel}
                className="flex flex-col items-center gap-1.5 group active:scale-95 transition-transform cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#9acbff]/30 flex items-center justify-center shadow-xs group-hover:bg-[#9acbff]/50 transition-colors">
                  <span className="material-symbols-outlined text-[#00609b] text-[26px]">
                    query_stats
                  </span>
                </div>
                <span className="text-[11px] text-[#191c1e] font-semibold text-center leading-tight">
                  Rekap Sekolah
                </span>
              </button>
            </div>

            {/* Rombel Summary Table */}
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#eceef0] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-bold text-[#191c1e]">
                  Status Validasi Rombel Hari Ini
                </h3>
                <span className="text-[11px] text-[#00609b] font-bold">36 Kelas</span>
              </div>

              <div className="divide-y divide-[#eceef0]">
                {classSummaries.map((cls) => (
                  <div key={cls.id} className="py-2.5 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-[#191c1e]">{cls.name}</span>
                      <span className="text-[11px] text-[#404751]">
                        {cls.hadir} Hadir • {cls.sakit} Sakit • {cls.izin} Izin • {cls.alfa} Alfa
                      </span>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        cls.status === 'Tervalidasi'
                          ? 'bg-[#00855b]/10 text-[#006947]'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {cls.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* ─── TAB 2: ADVANCED SUPERADMIN CONTROL SUITE (POINT 6) ─── */
          <div className="flex flex-col gap-4">
            {/* Global School Policy Config */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-purple-200 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#eceef0]">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    ⚙️
                  </span>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#191c1e]">
                      Konfigurasi Kebijakan Sekolah (Root)
                    </h3>
                    <p className="text-[11px] text-[#707882]">Parameter JP dan toleransi presensi</p>
                  </div>
                </div>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-extrabold px-2.5 py-0.5 rounded-full">
                  Level 0 Only
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-[12px]">
                <div className="p-3 bg-[#f7f9fb] rounded-2xl border border-[#eceef0]">
                  <p className="text-[10px] text-[#707882] uppercase font-bold">Durasi 1 JP</p>
                  <p className="text-[15px] font-extrabold text-[#191c1e] mt-0.5">45 Menit</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">Standar Kurikulum Merdeka</p>
                </div>

                <div className="p-3 bg-[#f7f9fb] rounded-2xl border border-[#eceef0]">
                  <p className="text-[10px] text-[#707882] uppercase font-bold">Jam Masuk Resmi</p>
                  <p className="text-[15px] font-extrabold text-[#191c1e] mt-0.5">07:15 WIT</p>
                  <p className="text-[10px] text-[#00609b] font-semibold">Toleransi 15 Menit</p>
                </div>

                <div className="p-3 bg-[#f7f9fb] rounded-2xl border border-[#eceef0]">
                  <p className="text-[10px] text-[#707882] uppercase font-bold">Total JP / Hari</p>
                  <p className="text-[15px] font-extrabold text-[#191c1e] mt-0.5">9 JP (Selesai 15:00)</p>
                  <p className="text-[10px] text-[#707882]">2 Sesi Istirahat</p>
                </div>

                <div className="p-3 bg-[#f7f9fb] rounded-2xl border border-[#eceef0]">
                  <p className="text-[10px] text-[#707882] uppercase font-bold">Database Cloud</p>
                  <p className="text-[15px] font-extrabold text-emerald-600 mt-0.5">Supabase Active</p>
                  <p className="text-[10px] text-[#707882]">1.000 Slot Terkoneksi</p>
                </div>
              </div>
            </div>

            {/* Mass Account & Credentials Manager */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#eceef0] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    👥
                  </span>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#191c1e]">
                      Manajemen Akun Guru &amp; Siswa
                    </h3>
                    <p className="text-[11px] text-[#707882]">Otoritas reset kredensial massal</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-amber-950">Reset Sandi Massal Default</p>
                  <p className="text-[11px] text-amber-800">
                    Setel ulang sandi semua user yang lupa ke default <code className="font-bold">Demo@2026</code>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetPasswordBulk}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold shrink-0 shadow-xs active:scale-95 transition-all"
                >
                  Reset Default
                </button>
              </div>
            </div>

            {/* Live Security & Audit Logs */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#eceef0] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                    🛡️
                  </span>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#191c1e]">
                      Audit Log Keamanan &amp; Aktivitas
                    </h3>
                    <p className="text-[11px] text-[#707882]">Pencatatan real-time perubahan sistem</p>
                  </div>
                </div>
                <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">
                  Live Feed
                </span>
              </div>

              <div className="divide-y divide-[#f2f4f6]">
                {auditLogs.map((log) => (
                  <div key={log.id} className="py-2.5 flex items-start justify-between gap-2">
                    <div className="flex flex-col min-w-0">
                      <p className="text-[12px] font-bold text-[#191c1e]">{log.action}</p>
                      <p className="text-[10px] text-[#707882]">Oleh: {log.user}</p>
                    </div>
                    <span className="text-[10px] bg-[#f2f4f6] text-[#404751] font-semibold px-2 py-0.5 rounded-md shrink-0">
                      {log.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating feedback toast */}
      {toastFeedback && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1e293b] text-white px-4 py-2 rounded-full shadow-2xl text-[12px] font-semibold flex items-center gap-2 border border-white/20 animate-fadeIn">
          <span className="material-symbols-outlined text-[16px] text-[#6ffbbe]">check_circle</span>
          <span>{toastFeedback}</span>
        </div>
      )}
    </div>
  );
};
