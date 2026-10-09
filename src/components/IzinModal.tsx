import React, { useState } from 'react';

interface IzinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
}

export const IzinModal: React.FC<IzinModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [type, setType] = useState<'Sakit' | 'Izin' | 'Dispensasi'>('Sakit');
  const [reason, setReason] = useState('');
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(type, reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-[#eceef0] animate-scaleUp">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#00609b] to-[#0761a2] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px]">description</span>
            <div>
              <h3 className="text-[14px] font-bold">Pengajuan Izin / Sakit</h3>
              <p className="text-[11px] text-[#cfe4ff]">SMKN 1 Sorong - Form Digital</p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3.5 bg-[#f7f9fb]">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-[#404751]">Jenis Keterangan</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Sakit', 'Izin', 'Dispensasi'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2 rounded-xl text-[12px] font-bold transition-all border ${
                    type === t
                      ? 'bg-[#00609b] text-white border-[#00609b] shadow-xs'
                      : 'bg-white text-[#404751] border-[#eceef0] hover:bg-[#f2f4f6]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-[#404751]">Alasan / Keterangan</label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Jelaskan alasan izin atau kondisi sakit..."
              className="w-full p-2.5 bg-white rounded-xl text-[12px] text-[#191c1e] border border-[#eceef0] focus:ring-1 focus:ring-[#00609b] focus:outline-hidden resize-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-[#404751]">Lampiran Bukti (Opsional)</label>
            <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-[#bfc7d3] rounded-xl bg-white cursor-pointer hover:bg-[#f2f4f6] transition-colors">
              <span className="material-symbols-outlined text-[#00609b] text-[24px]">
                cloud_upload
              </span>
              <span className="text-[11px] text-[#404751] font-medium mt-1">
                {fileName || 'Unggah Surat Dokter / Surat Dispensasi (PDF/JPG)'}
              </span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFileName(e.target.files[0].name);
                  }
                }}
              />
            </label>
          </div>

          <div className="bg-[#cfe4ff]/40 p-2.5 rounded-xl flex items-start gap-2 text-[11px] text-[#004a79]">
            <span className="material-symbols-outlined text-[16px] text-[#00609b] shrink-0 mt-0.5">
              info
            </span>
            <span>
              Pengajuan akan langsung diteruskan ke Wali Kelas dan Operator SMKN 1 Sorong.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 rounded-full bg-[#eceef0] text-[#404751] text-[12px] font-bold hover:bg-[#e6e8ea]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="py-2.5 rounded-full bg-[#00609b] text-white text-[12px] font-bold hover:bg-[#0079c2] shadow-xs active:scale-95"
            >
              Kirim Pengajuan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
