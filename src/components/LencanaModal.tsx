import React from 'react';

interface LencanaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LencanaModal: React.FC<LencanaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const badges = [
    {
      title: 'Lencana Teladan Sorong',
      desc: 'Hadir tepat waktu sebelum 07:15 WIT selama 20 hari berturut-turut.',
      progress: '14/20 Hari',
      percentage: 70,
      icon: 'military_tech',
      active: true,
      color: 'primary',
    },
    {
      title: 'Konsistensi Rajin JP 1–9',
      desc: 'Tidak pernah meninggalkan jam pelajaran kejuruan.',
      progress: 'Selesai 100%',
      percentage: 100,
      icon: 'verified',
      active: true,
      color: 'emerald',
    },
    {
      title: 'Jagoan Bengkel RPL',
      desc: 'Menuntaskan seluruh praktikum pemrograman tepat waktu.',
      progress: '8/10 Modul',
      percentage: 80,
      icon: 'code',
      active: true,
      color: 'blue',
    },
    {
      title: 'Duta Disiplin SMKN 1',
      desc: 'Pertahankan 0 Alfa dan &lt; 2 Izin sepanjang satu semester penuh.',
      progress: 'Terkunci',
      percentage: 35,
      icon: 'lock',
      active: false,
      color: 'gray',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-[#eceef0] animate-scaleUp">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#00609b] to-[#0761a2] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              emoji_events
            </span>
            <div>
              <h3 className="text-[14px] font-bold">Lencana &amp; Streak Disiplin</h3>
              <p className="text-[11px] text-[#cfe4ff]">Apresiasi Prestasi Cindy Laura</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 bg-[#f7f9fb] max-h-[70vh] overflow-y-auto">
          {/* Active Streak Highlight */}
          <div className="bg-gradient-to-r from-[#cfe4ff] to-[#d1e4ff] p-3.5 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xl">🔥</span>
              <span className="text-[12px] font-extrabold text-[#001d34]">
                14 HARI DISIPLIN STREAK
              </span>
              <span className="text-[11px] bg-white px-2 py-0.5 rounded-full font-bold text-[#00609b]">
                Level 3
              </span>
            </div>
            <p className="text-[11px] text-[#004a79]">
              Cindy berada di peringkat 3 siswa terdisiplin se-SMKN 1 Sorong bulan ini!
            </p>
          </div>

          <div className="space-y-2.5">
            {badges.map((b, idx) => (
              <div
                key={idx}
                className="bg-white p-3 rounded-2xl border border-[#eceef0] shadow-xs flex flex-col gap-2"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      b.active ? 'bg-[#cfe4ff] text-[#00609b]' : 'bg-[#e0e3e5] text-[#707882]'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: b.active ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {b.icon}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold text-[#191c1e] truncate">{b.title}</p>
                    <p className="text-[10px] text-[#404751] line-clamp-1">{b.desc}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] font-semibold text-[#404751]">
                    <span>Progres</span>
                    <span className="font-bold text-[#00609b]">{b.progress}</span>
                  </div>
                  <div className="w-full bg-[#f2f4f6] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#00609b] h-full rounded-full transition-all"
                      style={{ width: `${b.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-[#eceef0] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-[#00609b] text-white text-[12px] font-bold hover:bg-[#0079c2] transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
