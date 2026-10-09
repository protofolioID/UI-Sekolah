import React, { useState } from 'react';
import { ASSETS } from '../data/mockData';

interface QrScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (sessionName: string) => void;
}

export const QrScanModal: React.FC<QrScanModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [scanState, setScanState] = useState<'scanning' | 'success'>('scanning');
  const [activeMode, setActiveMode] = useState<'camera' | 'my-qr'>('camera');

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setScanState('success');
    setTimeout(() => {
      onSuccess('JP 4-5: Pemrograman Web & Bergerak (TS)');
      onClose();
      setScanState('scanning');
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-[#eceef0] animate-scaleUp">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#00609b] to-[#0761a2] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px]">qr_code_scanner</span>
            <div>
              <h3 className="text-[14px] font-bold">Presensi Cerdas SMKN 1</h3>
              <p className="text-[11px] text-[#cfe4ff]">Sesi JP 4–5 • Lab Web Dev</p>
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

        {/* Tab switch: Scan QR vs QR Saya */}
        <div className="flex border-b border-[#eceef0] bg-[#f2f4f6] p-1.5 gap-1">
          <button
            type="button"
            onClick={() => setActiveMode('camera')}
            className={`flex-1 py-1.5 rounded-xl text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeMode === 'camera'
                ? 'bg-white text-[#00609b] shadow-xs'
                : 'text-[#404751] hover:text-[#191c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">photo_camera</span>
            Scan QR Guru
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('my-qr')}
            className={`flex-1 py-1.5 rounded-xl text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeMode === 'my-qr'
                ? 'bg-white text-[#00609b] shadow-xs'
                : 'text-[#404751] hover:text-[#191c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
            Kartu Pelajar Saya
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col items-center gap-4 bg-[#f7f9fb]">
          {/* WiFi Geofence Indicator */}
          <div className="w-full bg-[#00855b]/10 border border-[#00855b]/20 px-3 py-2 rounded-xl flex items-center justify-between text-[11px] text-[#006947]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">wifi</span>
              <span className="font-semibold">WiFi SMKN1_SORONG_LAB</span>
            </div>
            <span className="bg-white px-2 py-0.5 rounded-md font-bold shadow-xs">
              Radius 15m (Aman)
            </span>
          </div>

          {activeMode === 'camera' ? (
            scanState === 'scanning' ? (
              <div className="w-64 h-64 bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-inner">
                {/* Simulated Camera Feed & Viewfinder Frame */}
                <div className="absolute inset-4 border-2 border-dashed border-[#6ffbbe]/70 rounded-xl pointer-events-none flex items-center justify-center" />
                <div className="w-48 h-48 border-2 border-white/60 rounded-lg relative pointer-events-none">
                  {/* Corner accents */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-[#6ffbbe]" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-[#6ffbbe]" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-[#6ffbbe]" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-[#6ffbbe]" />

                  {/* Animated laser scan line */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#6ffbbe] to-transparent shadow-[0_0_8px_#6ffbbe] animate-pulse" />
                </div>

                <div className="absolute bottom-2 text-[10px] text-white/80 bg-black/40 px-2 py-0.5 rounded-full">
                  Arahkan kamera ke QR Guru di Smartboard
                </div>
              </div>
            ) : (
              <div className="w-64 h-64 bg-emerald-50 rounded-2xl flex flex-col items-center justify-center gap-3 p-4 border border-emerald-200">
                <div className="w-16 h-16 rounded-full bg-[#00855b] text-white flex items-center justify-center animate-bounce shadow-md">
                  <span className="material-symbols-outlined text-4xl">check</span>
                </div>
                <div className="text-center">
                  <h4 className="text-[16px] font-bold text-[#006947]">Presensi Berhasil!</h4>
                  <p className="text-[12px] text-[#404751] mt-0.5">
                    Cindy Laura tercatat TEPAT WAKTU
                  </p>
                  <p className="text-[11px] text-[#707882] mt-1 font-mono">
                    Token: PRES-0910-TKJ-8812
                  </p>
                </div>
              </div>
            )
          ) : (
            // Student Identity QR Mode
            <div className="w-64 bg-white p-4 rounded-2xl border border-[#eceef0] shadow-sm flex flex-col items-center gap-2 text-center">
              <img
                src={ASSETS.cindyPortrait}
                alt="Cindy Laura"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#00609b]"
              />
              <div>
                <p className="text-[13px] font-bold text-[#191c1e]">Cindy Laura</p>
                <p className="text-[11px] text-[#404751]">NISN: 0068192041 • XII TKJ 1</p>
              </div>
              <div className="p-2 bg-slate-900 rounded-xl my-1">
                {/* SVG QR Code Simulation */}
                <svg className="w-28 h-28 text-white" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" />
                  <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" />
                  <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" />
                  <rect x="40" y="10" width="10" height="20" />
                  <rect x="10" y="40" width="20" height="10" />
                  <rect x="40" y="40" width="20" height="20" />
                  <rect x="70" y="50" width="20" height="10" />
                  <rect x="50" y="70" width="30" height="10" />
                  <rect x="40" y="85" width="10" height="15" />
                  <rect x="80" y="80" width="20" height="20" />
                </svg>
              </div>
              <p className="text-[10px] text-[#707882]">
                Tunjukkan ke Guru jika Scanner Smartboard offline
              </p>
            </div>
          )}

          {activeMode === 'camera' && scanState === 'scanning' && (
            <button
              type="button"
              onClick={handleSimulateScan}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#00609b] to-[#0761a2] text-white text-[13px] font-bold shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">touch_app</span>
              Simulasikan Tap Presensi QR
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
