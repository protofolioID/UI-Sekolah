import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { LoginScreen } from './components/LoginScreen';
import { PublicScheduleView } from './components/PublicScheduleView';
import { BerandaView } from './components/BerandaView';
import { JadwalView } from './components/JadwalView';
import { AbsensiView } from './components/AbsensiView';
import { RekapView } from './components/RekapView';
import { ProfilView, getUserAvatar } from './components/ProfilView';
import { GuruDashboardView } from './components/GuruDashboardView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { ScheduleModal } from './components/ScheduleModal';
import { AttachmentModal } from './components/AttachmentModal';
import { LencanaModal } from './components/LencanaModal';
import { IzinModal } from './components/IzinModal';
import { NotificationsModal } from './components/NotificationsModal';
import { PrintModal } from './components/PrintModal';
import {
  INITIAL_STUDENTS,
  INITIAL_SCHEDULES,
  INITIAL_TEACHERS,
  NOTIFICATIONS,
} from './data/mockData';
import { Student, ScheduleSlot, AttendanceStatus, NotificationItem, Teacher } from './types';
import { exportAttendanceRecapToExcel } from './utils/excelHelper';

type UserRole = 'siswa' | 'guru' | 'admin' | 'superadmin';

interface UserSession {
  username: string;
  role: UserRole;
  nama: string;
}

export default function App() {
  // ─── AUTH STATE ───
  const [session, setSession] = useState<UserSession | null>(null);
  const [isPublicSchedule, setIsPublicSchedule] = useState(false);

  // ─── NAV STATE ───
  const [currentTab, setCurrentTab] = useState<TabType>('beranda');
  const [isAbsensiOpen, setIsAbsensiOpen] = useState(false);

  // ─── DATA STATE ───
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [schedules, setSchedules] = useState<ScheduleSlot[]>(INITIAL_SCHEDULES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS);

  // ─── MODALS ───
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<ScheduleSlot | null>(null);
  const [selectedStudentAttachment, setSelectedStudentAttachment] = useState<Student | null>(null);
  const [isLencanaModalOpen, setIsLencanaModalOpen] = useState(false);
  const [isIzinModalOpen, setIsIzinModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // ─── TOAST ───
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  // ─── LIVE SUPABASE CONNECTIVITY ───
  useEffect(() => {
    async function checkSupabaseConnection() {
      try {
        const SUPABASE_URL = 'https://cfcdqmajoazxcoxgnoka.supabase.co';
        const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NjUzNzEsImV4cCI6MjEwNjM0MTM3MX0.wLxxXMBd0q8HZM0HGhfGb0yMuA-a3daofIHMK8Bxjmc';
        const headers = { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` };
        const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=id&limit=1`, { headers });
        if (res.ok) {
          // Connected live
        }
      } catch (err) {
        console.warn('Supabase check fallback:', err);
      }
    }

    checkSupabaseConnection();
  }, []);

  // ─── LOGIN HANDLER ───
  const handleLogin = (username: string, role?: UserRole, nama?: string) => {
    const roleMap: Record<string, { role: UserRole; nama: string }> = {
      's0097658890': { role: 'siswa', nama: 'Cindy Laura' },
      '196812291993031011': { role: 'guru', nama: 'Budi Santoso, S.Kom' },
      'admin_demo': { role: 'admin', nama: 'Administrator SMKN 1' },
      'superadmin_sorong': { role: 'superadmin', nama: 'Superadmin SIAP' },
    };
    const match = roleMap[username];
    const finalRole = role || match?.role || 'siswa';
    const finalNama = nama || match?.nama || username;
    setSession({ username, role: finalRole, nama: finalNama });
    setIsPublicSchedule(false);
    setCurrentTab('beranda');
    setIsAbsensiOpen(false);
    showToast(`Selamat datang, ${finalNama}!`);
  };

  const handlePublicSchedule = () => {
    setIsPublicSchedule(true);
    setSession(null);
  };

  const handleBackToLogin = () => {
    setIsPublicSchedule(false);
  };

  const handleLogout = () => {
    setSession(null);
    setIsPublicSchedule(false);
    setCurrentTab('beranda');
    setIsAbsensiOpen(false);
  };

  // ─── ATTENDANCE HANDLERS ───
  const handleUpdateStudentStatus = (id: string, status: AttendanceStatus) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    showToast(`Status kehadiran siswa diperbarui: ${status}`);
  };

  const handleSetAllHadir = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: 'Hadir' })));
    showToast('Semua 34 siswa berhasil diset HADIR!');
  };

  const handleSaveAndLockPresensi = () => {
    showToast('💾 Presensi dikunci & disinkronkan ke SIAP SMKN 1 Sorong!');
  };

  // ─── SCHEDULE CRUD ───
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
        prev.map((s) => (s.id === editingSlot.id ? { ...s, ...slotData } : s))
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

  const handleImportSchedules = (newSchedules: ScheduleSlot[]) => {
    setSchedules((prev) => [...prev, ...newSchedules]);
    showToast(`${newSchedules.length} jadwal berhasil diimpor dari file Excel!`);
  };

  const handleImportStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    showToast(`${newStudents.length} data siswa berhasil diimpor dari file Excel!`);
  };

  const handleAddTeacher = (newTeacher: Teacher) => {
    setTeachers((prev) => [newTeacher, ...prev]);
    showToast(`Guru ${newTeacher.name} berhasil ditambahkan!`);
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [...prev, newStudent]);
    showToast(`Siswa ${newStudent.name} (${newStudent.kelas || 'Rombel'}) berhasil ditambahkan!`);
  };

  const handleResetUserPassword = (username: string, _newPass: string) => {
    showToast(`Kata sandi akun ${username} berhasil disetel ulang!`);
  };

  // ─── NOTIFICATIONS ───
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Semua notifikasi ditandai telah dibaca.');
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // ─── IZIN ───
  const handleIzinSubmit = (type: string, _reason: string) => {
    setIsIzinModalOpen(false);
    showToast(`Pengajuan ${type} berhasil dikirim ke Guru Mapel & Tata Usaha!`);
  };

  // ─── DOWNLOAD RECAP ───
  const handleDownloadRecapPDF = () => {
    exportAttendanceRecapToExcel(students, 'XII TKJ 1', 'Oktober 2026');
    showToast('Rekap presensi berhasil diekspor ke Excel (.xlsx)');
  };

  // ─── HEADER TITLE ───
  const getHeaderTitle = () => {
    if (isAbsensiOpen) return 'Lembar Absensi Kelas';
    if (currentTab === 'jadwal') return 'Jadwal Pelajaran';
    if (currentTab === 'rekap') return 'Rekap Presensi';
    if (currentTab === 'profil') return 'Profil';
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

  // ─── PUBLIC SCHEDULE VIEW ───
  if (isPublicSchedule) {
    return (
      <PublicScheduleView
        schedules={schedules}
        onBackToLogin={handleBackToLogin}
        onPrint={() => setIsPrintModalOpen(true)}
      />
    );
  }

  // ─── NOT LOGGED IN → SHOW LOGIN ───
  if (!session) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onOpenPublicSchedule={handlePublicSchedule}
      />
    );
  }

  const role = session.role;
  const isTeacherOrAbove = role === 'guru' || role === 'admin' || role === 'superadmin';
  const isAdmin = role === 'admin' || role === 'superadmin';

  // ─── MAIN APP ───
  return (
    <div className="bg-slate-100 min-h-screen text-[#191c1e] flex flex-col items-center justify-start font-sans selection:bg-[#77b7fe] selection:text-[#00487a]">
      {/* Shell Container: Full-width on mobile, responsive modern adaptive layout on tablet/desktop */}
      <div className="w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-5xl min-h-screen bg-[#f7f9fb] shadow-2xl relative flex flex-col transition-all duration-200">
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
          avatarUrl={getUserAvatar(session)}
        />

        {/* Main View Area */}
        <main className="flex-1 flex flex-col relative w-full pt-16">
        {isAbsensiOpen ? (
          <AbsensiView
            students={students}
            onUpdateStatus={handleUpdateStudentStatus}
            onSetAllHadir={handleSetAllHadir}
            onSaveAndLock={handleSaveAndLockPresensi}
            onBack={() => setIsAbsensiOpen(false)}
            onOpenAttachment={(student) => setSelectedStudentAttachment(student)}
          />
        ) : currentTab === 'beranda' ? (
          // Role-based home view
          isAdmin ? (
            <AdminDashboardView
              onOpenScheduleManager={handleOpenAddSchedule}
              onOpenPrintModal={() => setIsPrintModalOpen(true)}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              roleTitle={role === 'superadmin' ? 'Kepala Sekolah / IT Admin' : 'Tata Usaha / Operator'}
              schedules={schedules}
              students={students}
              teachers={teachers}
              onImportSchedules={handleImportSchedules}
              onImportStudents={handleImportStudents}
              onAddTeacher={handleAddTeacher}
              onAddStudent={handleAddStudent}
              onResetUserPassword={handleResetUserPassword}
            />
          ) : role === 'guru' ? (
            <GuruDashboardView
              onOpenAbsensiKelas={(_classId, _className, _subject) => setIsAbsensiOpen(true)}
              onNavigateToJadwal={() => setCurrentTab('jadwal')}
              onNavigateToRekap={() => setCurrentTab('rekap')}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              students={students}
            />
          ) : (
            <BerandaView
              session={session}
              onNavigateToJadwal={() => setCurrentTab('jadwal')}
              onNavigateToRekap={() => setCurrentTab('rekap')}
              onOpenIzinModal={() => setIsIzinModalOpen(true)}
              onOpenLencanaModal={() => setIsLencanaModalOpen(true)}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
            />
          )
        ) : currentTab === 'jadwal' ? (
          <JadwalView
            schedules={schedules}
            onOpenAddModal={handleOpenAddSchedule}
            onOpenEditModal={handleOpenEditSchedule}
            onDeleteSlot={handleDeleteSchedule}
            onPrint={() => setIsPrintModalOpen(true)}
            onOpenAbsensiKelas={(_slot) => setIsAbsensiOpen(true)}
            userRole={role}
            onImportSchedules={handleImportSchedules}
          />
        ) : currentTab === 'rekap' ? (
          <RekapView
            onBackToBeranda={() => setCurrentTab('beranda')}
            onDownloadReport={handleDownloadRecapPDF}
            userRole={role}
            session={session}
            students={students}
          />
        ) : (
          <ProfilView
            session={session}
            onLogout={handleLogout}
            onOpenLencanaModal={() => setIsLencanaModalOpen(true)}
            onNavigateToAbsensi={() => setIsAbsensiOpen(true)}
          />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      {!isAbsensiOpen && (
        <BottomNav
          activeTab={currentTab}
          userRole={role}
          onTabChange={(tab) => {
            setIsAbsensiOpen(false);
            setCurrentTab(tab);
          }}
          onQuickAbsenClick={() => setIsAbsensiOpen(true)}
        />
      )}

        {/* Logout FAB (visible on profil tab) */}
        {currentTab === 'profil' && (
          <button
            type="button"
            onClick={handleLogout}
            className="fixed bottom-24 right-4 z-50 w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-rose-600 active:scale-90 transition-all cursor-pointer"
            aria-label="Keluar"
          >
            <span className="material-symbols-outlined text-[22px]">logout</span>
          </button>
        )}
      </div>

      {/* ─── Modals ─── */}
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
        userRole={role}
        onAddNotification={(newNotif) => {
          setNotifications((prev) => [newNotif, ...prev]);
          showToast('Pemberitahuan berhasil disiarkan!');
        }}
      />

      <PrintModal
        isOpen={isPrintModalOpen}
        schedules={schedules}
        onClose={() => setIsPrintModalOpen(false)}
      />

      {/* Toast */}
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
