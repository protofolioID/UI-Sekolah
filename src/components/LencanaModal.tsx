import React, { useState } from 'react';

interface LencanaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LencanaModal: React.FC<LencanaModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'lencana' | 'leaderboard'>('lencana');
  const [hideMyName, setHideMyName] = useState(false);

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
      desc: 'Pertahankan 0 Alfa dan kurang dari 2 Izin sepanjang satu semester penuh.',
      progress: 'Terkunci',
      percentage: 35,
      icon: 'lock',
      active: false,
      color: 'gray',
    },
  ];

  const leaderboardStudents = [
    { rank: 1, name: 'Andhika Ivander (Nat)', kelas: 'XII DKV 1', streak: 28, medal: '🥇' },
    { rank: 2, name: 'Ahmad Fauzi', kelas: 'XII TKJ 1', streak: 26, medal: '🥈' },
    { rank: 3, name: hideMyName ? 'Siswa Anonim (XII TKJ 1)' : 'Cindy Laura (Kamu)', kelas: 'XII TKJ 1', streak: 14, medal: '🥉', isCurrentUser: true },
    { rank: 4, name: 'Rizky Pratama', kelas: 'XI RPL 1', streak: 14, medal: '4' },
    { rank: 5, name: 'Dian Permatasari', kelas: 'XII RPL 2', streak: 12, medal: '5' },
    { rank: 6, name: 'Fikri Haikal', kelas: 'X PPLG', streak: 11, medal: '6' },
    { rank: 7, name: 'Maria Imelda', kelas: 'XI TKJ 2', streak: 10, medal: '7' },
    { rank: 8, name: 'Bagas Wicaksono', kelas: 'XII TKJ 2', streak: 9, medal: '8' },
    { rank: 9, name: 'Nabila Syakieb', kelas: 'XI DKV 1', streak: 9, medal: '9' },
    { rank: 10, name: 'Yosias Mayor', kelas: 'XII TKJ 1', streak: 8, medal: '10' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-[#eceef0] animate-scaleUp">
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
              <h3 className="text-[15px] font-bold">Lencana &amp; Peringkat Disiplin</h3>
              <p className="text-[11px] text-[#cfe4ff]">SMKN 1 Sorong • Gamifikasi Kehadiran</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#eceef0] bg-white px-4 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('lencana')}
            className={`flex-1 py-2 text-[12px] font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'lencana'
                ? 'border-[#00609b] text-[#00609b]'
                : 'border-transparent text-[#707882] hover:text-[#191c1e]'
            }`}
          >
            🎖️ Lencana Saya
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-2 text-[12px] font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'border-[#00609b] text-[#00609b]'
                : 'border-transparent text-[#707882] hover:text-[#191c1e]'
            }`}
          >
            🏆 Top 10 Leaderboard
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 bg-[#f7f9fb] max-h-[65vh] overflow-y-auto">
          {activeTab === 'lencana' ? (
            <>
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
                  Kamu berada di peringkat 3 siswa terdisiplin se-SMKN 1 Sorong bulan ini!
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
            </>
          ) : (
            <>
              {/* Privacy Toggle Card */}
              <div className="bg-white p-3 rounded-2xl border border-[#eceef0] flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00609b] text-[20px]">
                    visibility_off
                  </span>
                  <div>
                    <p className="text-[11px] font-bold text-[#191c1e]">Mode Privasi Anonim</p>
                    <p className="text-[10px] text-[#707882]">Samarkan namamu di papan peringkat</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setHideMyName(!hideMyName)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    hideMyName ? 'bg-[#00609b]' : 'bg-[#e0e3e5]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform shadow-xs absolute top-1 ${
                      hideMyName ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Leaderboard List */}
              <div className="space-y-1.5">
                {leaderboardStudents.map((item) => (
                  <div
                    key={item.rank}
                    className={`p-2.5 rounded-2xl border flex items-center justify-between transition-all ${
                      item.isCurrentUser
                        ? 'bg-[#cfe4ff]/30 border-[#00609b] ring-1 ring-[#00609b]/30'
                        : 'bg-white border-[#eceef0]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-[#f2f4f6] font-extrabold text-[12px] flex items-center justify-center shrink-0">
                        {item.medal}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-[12px] font-bold truncate ${item.isCurrentUser ? 'text-[#00609b]' : 'text-[#191c1e]'}`}>
                          {item.name}
                        </p>
                        <p className="text-[10px] text-[#707882]">{item.kelas}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <span className="text-[12px]">🔥</span>
                      <span className="text-[11px] font-extrabold text-amber-900">
                        {item.streak} Hari
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-[#eceef0] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-[#00609b] text-white text-[12px] font-bold hover:bg-[#0079c2] transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
