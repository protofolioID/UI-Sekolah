import React, { useState, useMemo } from 'react';
import { Student, AttendanceStatus } from '../types';

interface AbsensiViewProps {
  students: Student[];
  onUpdateStatus: (id: string, status: AttendanceStatus) => void;
  onSetAllHadir: () => void;
  onSaveAndLock: () => void;
  onBack: () => void;
  onOpenAttachment: (student: Student) => void;
}

export const AbsensiView: React.FC<AbsensiViewProps> = ({
  students,
  onUpdateStatus,
  onSetAllHadir,
  onSaveAndLock,
  onBack,
  onOpenAttachment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedStudentId, setExpandedStudentId] = useState<string>('s-04'); // Kevin Pratama expanded by default like in screenshot
  const [isSettingAll, setIsSettingAll] = useState(false);

  const handleSetAllHadirClick = () => {
    setIsSettingAll(true);
    onSetAllHadir();
    setTimeout(() => {
      setIsSettingAll(false);
    }, 1200);
  };

  // Filter students based on search and status
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nis.includes(searchQuery) ||
        s.no.includes(searchQuery);
      const matchStatus =
        filterStatus === 'all' || s.status.toLowerCase() === filterStatus.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [students, searchQuery, filterStatus]);

  // Dynamic status counts
  const stats = useMemo(() => {
    let hadir = 0;
    let sakit = 0;
    let izin = 0;
    let alfa = 0;

    students.forEach((s) => {
      if (s.status === 'Hadir') hadir++;
      else if (s.status === 'Sakit') sakit++;
      else if (s.status === 'Izin') izin++;
      else if (s.status === 'Alfa') alfa++;
    });

    return { hadir, sakit, izin, alfa, total: students.length };
  }, [students]);

  return (
    <div className="flex-1 w-full flex flex-col bg-[#f7f9fb] pb-12">
      {/* Sheet Card Container */}
      <div className="bg-white rounded-b-[28px] shadow-sm flex flex-col border-b border-[#eceef0]">
        {/* Sheet Handle */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-[#e0e3e5]" />
        </div>

        {/* Sheet Header */}
        <div className="px-4 pt-1 pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#00609b]/10 flex items-center justify-center text-[#00609b] shrink-0">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  fact_check
                </span>
              </div>
              <h2 className="text-[20px] text-[#191c1e] font-bold">Absensi Kelas</h2>
            </div>
            <button
              type="button"
              onClick={onBack}
              aria-label="Tutup"
              className="w-8 h-8 rounded-full bg-[#f2f4f6] text-[#404751] flex items-center justify-center active:bg-[#e6e8ea] hover:bg-[#e6e8ea] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Class Badge & Context Meta */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] bg-[#cfe4ff] text-[#001d34] font-semibold">
              XII TKJ 1 • BA • JP 1-3
            </span>
            <div className="flex items-center gap-1.5 text-[#404751] text-[12px]">
              <span className="material-symbols-outlined text-[15px] text-[#00609b]">
                calendar_today
              </span>
              <span>Selasa, 9 Okt 2026</span>
              <span className="w-1 h-1 rounded-full bg-[#bfc7d3]" />
              <span className="text-[#006947] font-bold">08:50 WIT</span>
            </div>
          </div>
        </div>

        {/* Quick Batch Actions & Search Bar */}
        <div className="px-4 py-3 bg-[#f2f4f6] border-y border-[#eceef0] flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSetAllHadirClick}
              className="flex-1 py-2 px-3.5 rounded-full bg-[#00609b] text-white text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-all hover:bg-[#0079c2]"
            >
              <span
                className={`material-symbols-outlined text-[18px] ${
                  isSettingAll ? 'animate-spin' : ''
                }`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {isSettingAll ? 'sync' : 'bolt'}
              </span>
              <span>
                {isSettingAll ? 'Memperbarui...' : '⚡ Set Semua Hadir'}
              </span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`py-2 px-3 rounded-full bg-white text-[#404751] text-[12px] font-semibold flex items-center justify-center gap-1 border border-[#bfc7d3]/30 active:bg-[#e6e8ea] transition-colors ${
                  filterStatus !== 'all' ? 'text-[#00609b] border-[#00609b]' : ''
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">tune</span>
                <span>
                  {filterStatus === 'all'
                    ? 'Filter'
                    : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                </span>
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-[#eceef0] py-1 z-30 min-w-[130px] animate-fadeIn">
                  {['all', 'hadir', 'sakit', 'izin', 'alfa'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        setFilterStatus(st);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-[12px] hover:bg-[#f2f4f6] flex items-center justify-between ${
                        filterStatus === st ? 'font-bold text-[#00609b]' : 'text-[#191c1e]'
                      }`}
                    >
                      <span className="capitalize">{st === 'all' ? 'Semua' : st}</span>
                      {filterStatus === st && (
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-[#404751] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Cari siswa..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white text-[#191c1e] placeholder:text-[#707882] text-[12px] focus:outline-hidden focus:ring-1 focus:ring-[#00609b] shadow-xs border border-[#bfc7d3]/30"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-[#707882] hover:text-[#191c1e]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Student Attendance List */}
        <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-[#707882]">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-50">
                search_off
              </span>
              <p className="text-[14px] font-semibold">Tidak ada siswa ditemukan</p>
              <p className="text-[12px]">Coba cari dengan nama atau NIS lain</p>
            </div>
          ) : (
            filteredStudents.map((student) => {
              const isExpanded = expandedStudentId === student.id;

              // Render based on status
              const isHadir = student.status === 'Hadir';
              const isSakit = student.status === 'Sakit';
              const isIzin = student.status === 'Izin';
              const isAlfa = student.status === 'Alfa';

              return (
                <div
                  key={student.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    isAlfa
                      ? 'bg-[#f2f4f6] border-[#ba1a1a]/30 shadow-xs'
                      : 'bg-white border-[#e6e8ea] shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-full text-[12px] flex items-center justify-center shrink-0 font-bold ${
                          isAlfa
                            ? 'bg-[#ffdad6] text-[#ba1a1a]'
                            : 'bg-[#eceef0] text-[#00609b]'
                        }`}
                      >
                        {student.no}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[16px] text-[#191c1e] truncate font-bold">
                            {student.name}
                          </p>
                          {isAlfa && (
                            <span className="px-1.5 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[11px] font-semibold">
                              Alfa
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-[#404751]">
                          NIS: {student.nis}
                        </p>
                      </div>
                    </div>

                    {/* Quick Status Button */}
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedStudentId(isExpanded ? '' : student.id)
                      }
                      className={`h-7 px-3 rounded-full text-[12px] flex items-center gap-1.5 active:scale-95 transition-all shrink-0 font-semibold ${
                        isHadir
                          ? 'bg-[#00855b]/15 text-[#006947]'
                          : isSakit
                          ? 'bg-[#d1e4ff]/40 text-[#0761a2]'
                          : isIzin
                          ? 'bg-[#fef3c7] text-[#b45309]'
                          : 'bg-[#ba1a1a] text-white shadow-xs'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isHadir
                            ? 'bg-[#006947]'
                            : isSakit
                            ? 'bg-[#0761a2]'
                            : isIzin
                            ? 'bg-[#f59e0b]'
                            : 'bg-white'
                        }`}
                      />
                      <span>{student.status}</span>
                      <span className="material-symbols-outlined text-[16px]">
                        {isExpanded ? 'arrow_drop_up' : 'arrow_drop_down'}
                      </span>
                    </button>
                  </div>

                  {/* Note Row if present */}
                  {student.note && (
                    <div
                      className={`mt-2 ml-10 p-2 rounded-xl flex items-center justify-between gap-2 text-[11px] ${
                        isSakit
                          ? 'bg-[#d1e4ff]/20 border border-[#d1e4ff]/50 text-[#00497d]'
                          : isAlfa
                          ? 'text-[#ba1a1a] font-medium'
                          : 'bg-[#f2f4f6] border border-[#e6e8ea] text-[#404751]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="material-symbols-outlined text-[15px] shrink-0">
                          {isSakit
                            ? 'medical_services'
                            : isAlfa
                            ? 'warning'
                            : 'assignment'}
                        </span>
                        <span className="truncate">
                          Catatan: {student.note}
                        </span>
                      </div>

                      {student.hasAttachment && (
                        <button
                          type="button"
                          onClick={() => onOpenAttachment(student)}
                          className="text-[#0761a2] font-bold hover:underline shrink-0 flex items-center gap-0.5 ml-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            attachment
                          </span>
                          <span>Lihat</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Interactive Segmented Control Row when expanded (e.g. Kevin Pratama in mock) */}
                  {isExpanded && (
                    <div className="mt-2.5 pt-2.5 border-t border-[#eceef0] flex flex-col gap-2 animate-fadeIn">
                      <div className="p-1 bg-white rounded-xl border border-[#bfc7d3]/30 grid grid-cols-4 gap-1 shadow-inner">
                        {(['Hadir', 'Sakit', 'Izin', 'Alfa'] as AttendanceStatus[]).map(
                          (statusOption) => {
                            const isCurrent = student.status === statusOption;
                            return (
                              <button
                                key={statusOption}
                                type="button"
                                onClick={() =>
                                  onUpdateStatus(student.id, statusOption)
                                }
                                className={`py-1.5 px-1 rounded-lg text-center text-[11px] font-bold active:scale-95 transition-all flex items-center justify-center gap-1 ${
                                  isCurrent
                                    ? statusOption === 'Alfa'
                                      ? 'bg-[#ba1a1a] text-white shadow-xs'
                                      : statusOption === 'Hadir'
                                      ? 'bg-[#00855b] text-white shadow-xs'
                                      : statusOption === 'Sakit'
                                      ? 'bg-[#0761a2] text-white shadow-xs'
                                      : 'bg-[#b45309] text-white shadow-xs'
                                    : 'text-[#404751] hover:bg-[#f2f4f6]'
                                }`}
                              >
                                {isCurrent ? (
                                  <span className="material-symbols-outlined text-[14px]">
                                    check
                                  </span>
                                ) : (
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      statusOption === 'Hadir'
                                        ? 'bg-[#006947]'
                                        : statusOption === 'Sakit'
                                        ? 'bg-[#0761a2]'
                                        : statusOption === 'Izin'
                                        ? 'bg-[#f59e0b]'
                                        : 'bg-[#ba1a1a]'
                                    }`}
                                  />
                                )}
                                {statusOption}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Counter Recap Row */}
        <div className="mx-4 mb-3 px-3 py-2.5 bg-[#eceef0] rounded-xl flex items-center justify-between text-[12px] font-semibold">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#006947] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#006947]" /> {stats.hadir} Hadir
            </span>
            <span className="text-[#404751]/40">•</span>
            <span className="text-[#0761a2] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#0761a2]" /> {stats.sakit} Sakit
            </span>
            <span className="text-[#404751]/40">•</span>
            <span className="text-[#b45309] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> {stats.izin} Izin
            </span>
            <span className="text-[#404751]/40">•</span>
            <span className="text-[#ba1a1a] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#ba1a1a]" /> {stats.alfa} Alfa
            </span>
          </div>
          <span className="text-[11px] text-[#191c1e] font-bold bg-[#e0e3e5] px-2 py-0.5 rounded-full shrink-0">
            Total {stats.total} Siswa
          </span>
        </div>

        {/* Large Primary Action Button & Footer */}
        <div className="px-4 pb-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={onSaveAndLock}
            className="w-full h-12 py-3 px-4 rounded-xl bg-gradient-to-r from-[#00609b] to-[#0079c2] text-white text-[16px] flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(0,96,155,0.28)] active:scale-[0.99] hover:opacity-95 transition-all font-bold"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              save
            </span>
            <span>💾 Simpan &amp; Kunci Presensi</span>
          </button>
          <p className="text-center text-[11px] text-[#404751]/70 flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#006947]">
              verified_user
            </span>
            Data disinkronkan langsung ke SIAP SMKN 1 Sorong
          </p>
        </div>
      </div>
    </div>
  );
};
