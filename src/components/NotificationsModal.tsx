import React from 'react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  notifications,
  onClose,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-[#eceef0] animate-slideDown">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#00609b] to-[#0761a2] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <div>
              <h3 className="text-[14px] font-bold">Pemberitahuan</h3>
              <p className="text-[11px] text-[#cfe4ff]">Update Presensi &amp; Akademik</p>
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

        {/* List */}
        <div className="p-3 space-y-2 max-h-[60vh] overflow-y-auto bg-[#f7f9fb]">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-2xl border transition-all flex flex-col gap-1 ${
                item.read
                  ? 'bg-white border-[#eceef0]'
                  : 'bg-[#cfe4ff]/25 border-[#00609b]/30 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#191c1e] flex items-center gap-1.5">
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-[#00609b]" />
                  )}
                  {item.title}
                </span>
                <span className="text-[10px] text-[#707882]">{item.time}</span>
              </div>
              <p className="text-[11px] text-[#404751] leading-relaxed">
                {item.message}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-[#eceef0] flex items-center justify-between">
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="text-[11px] text-[#00609b] font-bold hover:underline"
          >
            Tandai Semua Dibaca
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-full bg-[#00609b] text-white text-[11px] font-bold hover:bg-[#0079c2]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
