import React from 'react';

interface RekapViewProps {
  onBackToBeranda: () => void;
  onDownloadReport: () => void;
}

export const RekapView: React.FC<RekapViewProps> = ({
  onBackToBeranda,
  onDownloadReport,
}) => {
  const historyItems = [
    {
      date: 'Selasa, 9 Okt 2026',
      subject: 'Pemodelan Perangkat Lunak (BA)',
      time: '07:10 WIT',
      status: 'Hadir',
      statusColor: 'tertiary',
    },
    {
      date: 'Senin, 8 Okt 2026',
      subject: 'Administrasi Infrastruktur Jaringan (AIJ)',
      time: '07:08 WIT',
      status: 'Hadir',
      statusColor: 'tertiary',
    },
    {
      date: 'Jumat, 5 Okt 2026',
      subject: 'Pendidikan Agama & Budi Pekerti',
      time: '07:12 WIT',
      status: 'Hadir',
      statusColor: 'tertiary',
    },
    {
      date: 'Kamis, 4 Okt 2026',
      subject: 'Pemrograman Berorientasi Objek (PBO)',
      time: '07:05 WIT',
      status: 'Hadir',
      statusColor: 'tertiary',
    },
    {
      date: 'Rabu, 3 Okt 2026',
      subject: 'Matematika Terapan Kejuruan',
      time: '07:14 WIT',
      status: 'Hadir',
      statusColor: 'tertiary',
    },
    {
      date: 'Selasa, 2 Okt 2026',
      subject: 'Bahasa Inggris Maritim & Kejuruan',
      time: '07:09 WIT',
      status: 'Hadir',
      statusColor: 'tertiary',
    },
  ];

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
          <h2 className="text-[20px] font-bold">Laporan Disiplin Cindy Laura</h2>
          <p className="text-[12px] text-[#cfe4ff]">NISN: 0068192041 • Kelas XII TKJ 1</p>
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

          {/* 3 Metric Pills */}
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

        {/* Attendance Heatmap / Calendar Month Overview */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eceef0] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#00609b]">
                calendar_month
              </span>
              <span className="text-[14px] font-bold text-[#191c1e]">
                Oktober 2026
              </span>
            </div>
            <span className="text-[11px] text-[#00609b] font-bold">14 Hari Berjalan</span>
          </div>

          {/* Mini Calendar Matrix */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
              <span key={d} className="font-bold text-[#707882] py-1">
                {d}
              </span>
            ))}
            {/* Calendar days simulation */}
            {Array.from({ length: 31 }, (_, i) => {
              const day = i + 1;
              const isPast = day <= 9;
              const isSunday = (day + 3) % 7 === 0;
              const isToday = day === 9;
              return (
                <div
                  key={day}
                  className={`py-1.5 rounded-lg flex flex-col items-center justify-center ${
                    isToday
                      ? 'bg-[#00609b] text-white font-bold shadow-xs'
                      : isSunday
                      ? 'text-[#707882]/50 bg-transparent'
                      : isPast
                      ? 'bg-[#00855b]/15 text-[#006947] font-semibold'
                      : 'text-[#404751] bg-[#f7f9fb]'
                  }`}
                >
                  <span>{day}</span>
                  {isPast && !isSunday && !isToday && (
                    <span className="w-1 h-1 rounded-full bg-[#006947] mt-0.5" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-4 pt-2 border-t border-[#eceef0] text-[10px] text-[#404751]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#00855b]" /> Hadir (Tepat Waktu)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#00609b]" /> Hari Ini
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#707882]/40" /> Libur
            </span>
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

        {/* Download PDF CTA */}
        <button
          type="button"
          onClick={onDownloadReport}
          className="w-full h-12 rounded-full bg-[#00609b] text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-md hover:bg-[#0079c2] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          Unduh Laporan Rekap Presensi (PDF)
        </button>
      </div>
    </div>
  );
};
