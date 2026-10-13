export type AttendanceStatus = 'Hadir' | 'Sakit' | 'Izin' | 'Alfa';

export interface Student {
  id: string;
  no: string;
  name: string;
  nis: string;
  status: AttendanceStatus;
  kelas?: string; // e.g. 'XII TKJ 1' or 'XII DKV 1'
  note?: string;
  hasAttachment?: boolean;
  attachmentTitle?: string;
  attachmentType?: 'medical' | 'dispensation';
}

export interface Teacher {
  id: string;
  nip: string;
  name: string;
  subject: string;
  room?: string;
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

// ─── Export Kehadiran Types ───
export type ExportPeriod = 'mingguan' | 'bulanan' | '3bulan' | 'semester' | 'kelas';
export type ExportBasis = 'harian' | 'guru';

export interface ExportConfig {
  period: ExportPeriod;
  basis: ExportBasis;
  kelas: string;
  guruId?: string;
  guruName?: string;
  startDate?: string;
  endDate?: string;
  semester?: 'ganjil' | 'genap';
  tahunAjaran?: string;
}

// ─── Login Security Types ───
export interface LoginAttempt {
  timestamp: string;
  username: string;
  success: boolean;
  userAgent?: string;
}

export interface SecurityConfig {
  maxAttempts: number;
  lockoutDurations: Record<number, number>; // attempts -> seconds
  captchaThreshold: number;
}

