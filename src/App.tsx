import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { BerandaView } from './components/BerandaView';
import { JadwalView } from './components/JadwalView';
import { AbsensiView } from './components/AbsensiView';
import { RekapView } from './components/RekapView';
import { ProfilView } from './components/ProfilView';
import { ScheduleModal } from './components/ScheduleModal';
import { AttachmentModal } from './components/AttachmentModal';
import { QrScanModal } from './components/QrScanModal';
import { LencanaModal } from './components/LencanaModal';
import { IzinModal } from './components/IzinModal';
import { NotificationsModal } from './components/NotificationsModal';
import { PrintModal } from './components/PrintModal';
import {
  INITIAL_STUDENTS,
  INITIAL_SCHEDULES,
  NOTIFICATIONS,
} from './data/mockData';
import { Student, ScheduleSlot, AttendanceStatus, NotificationItem } from './types';

export default function App() {
  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<TabType>('beranda');
  const [isAbsensiOpen, setIsAbsensiOpen] = useState(false);

  // Core Data State
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [schedules, setSchedules] = useState<ScheduleSlot[]>(INITIAL_SCHEDULES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS);

  // Modals & Panels State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<ScheduleSlot | null>(null);
  const [selectedStudentAttachment, setSelectedStudentAttachment] = useState<Student | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isLencanaModalOpen, setIsLencanaModalOpen] = useState(false);
  const [isIzinModalOpen, setIsIzinModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Student Attendance Handlers
  const handleUpdateStudentStatus = (id: string, status: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    showToast(`Status kehadiran siswa diperbarui: ${status}`);
  };

  const handleSetAllHadir = () => {
    setStudents((prev) =>
      prev.map((s) => ({ ...s, status: 'Hadir' }))
    );
    showToast('Semua 34 siswa berhasil diset HADIR!');
  };

  const handleSaveAndLockPresensi = () => {
    showToast('💾 Presensi dikunci & disinkronkan ke SIAP SMKN 1 Sorong!');
  };

  // Schedule CRUD Handlers
  const handleOpenAddSchedule = () => {
    setEditingSlot(null);
    setIsScheduleModalOpen(true);
  };

  const handleOpenEditSchedule = (slot: ScheduleSlot) => {
    setEditingSlot(slot);
    setIsScheduleModalOpen(true);
  };

  const handleDeleteSchedule = (id: string, subject: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus slot pelajaran "${subject}"?`)) {
      setSchedules((prev) => prev.filter((s) => s.id !== id));
      showToast(`Jadwal "${subject}" berhasil dihapus.`);
    }
  };

  const handleSaveSchedule = (slotData: Partial<ScheduleSlot>) => {
    if (editingSlot) {
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === editingSlot.id
            ? { ...s, ...slotData }
            : s
        )
      );
      showToast(`Jadwal "${slotData.subject}" berhasil diperbarui!`);
    } else {
      const newSlot: ScheduleSlot = {
        id: `sch-${Date.now()}`,
        day: slotData.day || 'Selasa',
        jpStart: slotData.jpStart || 1,
        jpEnd: slotData.jpEnd || 2,
        jpLabel: slotData.jpLabel || 'JP 1 - 2',
        timeRange: slotData.timeRange || '07:15 - 08:45 WIT',
        subject: slotData.subject || 'Mapel Baru',
        teacher: slotData.teacher || 'Guru Pengampu',
        room: slotData.room || 'Lab Komputer 2',
        badgeType: 'normal',
      };
      setSchedules((prev) => [...prev, newSlot]);
      showToast(`Jadwal baru berhasil ditambahkan!`);
    }
    setIsScheduleModalOpen(false);
  };

  // Notifications
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Semua notifikasi ditandai telah dibaca.');
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Izin Submission
  const handleIzinSubmit = (type: string, reason: string) => {
    setIsIzinModalOpen(false);
    showToast(`Pengajuan ${type} berhasil dikirim ke Wali Kelas!`);
  };

  // Title for top app bar
  const getHeaderTitle = () => {
    if (isAbsensiOpen) return 'Scan Presensi';
    if (currentTab === 'jadwal') return 'Scan Presensi';
    if (currentTab === 'rekap') return 'Rekap Presensi';
    if (currentTab === 'profil') return 'Profil Siswa';
    return 'Beranda';
  };

  const isBackVisible = isAbsensiOpen || currentTab !== 'beranda';

  const handleHeaderBack = () => {
    if (isAbsensiOpen) {
      setIsAbsensiOpen(false);
    } else if (currentTab !== 'beranda') {
      setCurrentTab('beranda');
    }
  };

  return (
    <div className="bg-[#f7f9fb] min-h-screen text-[#191c1e] flex flex-col font-sans selection:bg-[#77b7fe] selection:text-[#00487a]">
      {/* Top Application Bar */}
      <Header
        title={getHeaderTitle()}
        showBack={isBackVisible}
        onBack={handleHeaderBack}
        onNotificationClick={() => setIsNotificationsOpen(true)}
        onProfileClick={() => {
          setIsAbsensiOpen(false);
          setCurrentTab('profil');
        }}
        unreadCount={unreadNotificationsCount}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col relative w-full pt-16 max-w-lg mx-auto">
        {isAbsensiOpen ? (
          // Screen 3: Absensi Kelas (Roll-Call Sheet)
          <AbsensiView
            students={students}
            onUpdateStatus={handleUpdateStudentStatus}
            onSetAllHadir={handleSetAllHadir}
            onSaveAndLock={handleSaveAndLockPresensi}
            onBack={() => setIsAbsensiOpen(false)}
            onOpenAttachment={(student) => setSelectedStudentAttachment(student)}
          />
        ) : currentTab === 'beranda' ? (
          // Screen 1: Beranda (Home)
          <BerandaView
            onNavigateToJadwal={() => setCurrentTab('jadwal')}
            onNavigateToRekap={() => setCurrentTab('rekap')}
            onNavigateToAbsensi={() => setIsAbsensiOpen(true)}
            onOpenIzinModal={() => setIsIzinModalOpen(true)}
            onOpenLencanaModal={() => setIsLencanaModalOpen(true)}
            onOpenQrScan={() => setIsQrModalOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
          />
        ) : currentTab === 'jadwal' ? (
          // Screen 2: Jadwal Pelajaran (Detail & Kelola)
          <JadwalView
            schedules={schedules}
            onOpenAddModal={handleOpenAddSchedule}
            onOpenEditModal={handleOpenEditSchedule}
            onDeleteSlot={handleDeleteSchedule}
            onPrint={() => setIsPrintModalOpen(true)}
            onOpenAbsensiKelas={(slot) => setIsAbsensiOpen(true)}
          />
        ) : currentTab === 'rekap' ? (
          // Rekapitulasi Presensi
          <RekapView
            onBackToBeranda={() => setCurrentTab('beranda')}
            onDownloadReport={() => {
              showToast('Laporan Rekap Presensi Cindy Laura diunduh (PDF)!');
            }}
          />
        ) : (
          // Profil Siswa
          <ProfilView
            onOpenLencanaModal={() => setIsLencanaModalOpen(true)}
            onNavigateToAbsensi={() => setIsAbsensiOpen(true)}
          />
        )}
      </main>

      {/* Floating Bottom Navigation Bar (Hidden when roll-call sheet is active for pure focused view) */}
      {!isAbsensiOpen && (
        <BottomNav
          activeTab={currentTab}
          onTabChange={(tab) => {
            setIsAbsensiOpen(false);
            setCurrentTab(tab);
          }}
        />
      )}

      {/* Modals & Dialogs */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        editingSlot={editingSlot}
        onClose={() => setIsScheduleModalOpen(false)}
        onSave={handleSaveSchedule}
      />

      <AttachmentModal
        student={selectedStudentAttachment}
        onClose={() => setSelectedStudentAttachment(null)}
      />

      <QrScanModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        onSuccess={(session) => {
          showToast(`Presensi Berhasil: Hadir pada ${session}`);
        }}
      />

      <LencanaModal
        isOpen={isLencanaModalOpen}
        onClose={() => setIsLencanaModalOpen(false)}
      />

      <IzinModal
        isOpen={isIzinModalOpen}
        onClose={() => setIsIzinModalOpen(false)}
        onSubmit={handleIzinSubmit}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        notifications={notifications}
        onClose={() => setIsNotificationsOpen(false)}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
      />

      <PrintModal
        isOpen={isPrintModalOpen}
        schedules={schedules}
        onClose={() => setIsPrintModalOpen(false)}
      />

      {/* Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#2d3133] text-[#eff1f3] px-4 py-2.5 rounded-full shadow-xl text-[12px] font-semibold flex items-center gap-2 animate-bounceIn border border-white/10">
          <span className="material-symbols-outlined text-[#6ffbbe] text-[18px]">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
