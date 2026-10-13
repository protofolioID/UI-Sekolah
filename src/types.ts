export type AttendanceStatus = 'Hadir' | 'Sakit' | 'Izin' | 'Alfa';

export interface Student {
  id: string;
  no: string;
  name: string;
  nis: string;
  status: AttendanceStatus;
  note?: string;
  hasAttachment?: boolean;
  attachmentTitle?: string;
  attachmentType?: 'medical' | 'dispensation';
}

export interface ScheduleSlot {
  id: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  isBreak?: boolean;
  breakTitle?: string;
  breakSubtitle?: string;
  breakDuration?: string;
  breakIcon?: string;
  breakColor?: 'amber' | 'emerald';
  jpStart?: number;
  jpEnd?: number;
  jpLabel?: string;
  timeRange: string;
  subject?: string;
  subjectCode?: string;
  teacher?: string;
  room?: string;
  badgeType?: 'live' | 'upcoming' | 'normal' | 'break';
  statusPresensi?: 'Hadir' | 'Belum' | 'Menunggu';
  recordedTime?: string;
  classTarget?: string; // e.g. 'XII TKJ 1'
  teacherNip?: string;  // e.g. '196812291993031011'
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'attendance' | 'schedule' | 'broadcast';
  targetAudience?: 'semua' | 'guru' | 'siswa';
}
