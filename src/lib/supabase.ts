export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async () => ({ data: null, error: new Error('Mock mode') }),
    signOut: async () => ({}),
    getUser: async () => ({ data: { user: null } }),
    updateUser: async () => ({ data: null, error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({ single: async () => ({ data: null }), order: () => ({ limit: async () => ({ data: [] }) }) }),
      single: async () => ({ data: null }),
      order: () => ({ data: [] }),
      limit: async () => ({ data: [] }),
    }),
    insert: () => ({ select: () => ({ single: async () => ({ data: null }) }) }),
    update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null }) }) }) }),
    delete: () => ({ eq: async () => ({ error: null }) }),
    upsert: () => ({ select: async () => ({ data: null }) }),
  }),
};

// ─── TIPE DATA (match existing DB) ──────────────────────────────────────

export type AttendanceStatus = 'Hadir' | 'Izin' | 'Sakit' | 'Alfa' | 'Terlambat';
export type AttendanceStatusDB = 'Hadir' | 'Izin' | 'Sakit' | 'Alfa' | 'Terlambat';
export type Role = 'siswa' | 'guru' | 'admin';
export type HariEnum = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';

export interface Profile {
  id: string;
  username: string;
  nama: string;
  role: Role;
  is_sekretaris?: boolean;
  kelas_id: string | null;
  must_change_password: boolean;
  phone?: string;
  avatar_url?: string;
  created_at?: string;
  kelas?: { id: string; nama: string } | null;
}

export interface Kelas {
  id: string;
  nama: string;
  wali_kelas_id: string | null;
  created_at?: string;
}

export interface Mapel {
  id: string;
  nama: string;
  created_at?: string;
}

export interface Jadwal {
  id: string;
  kelas_id: string;
  mapel_id: string;
  guru_id: string;
  hari: HariEnum;
  jam_mulai: string;
  jam_selesai: string;
  created_at?: string;
  kelas?: { id: string; nama: string };
  mapel?: { id: string; nama: string };
  guru?: { id: string; nama: string };
}

export interface AbsenHarian {
  id: string;
  tanggal: string;
  siswa_id: string;
  kelas_id: string;
  status: AttendanceStatusDB;
  keterangan: string | null;
  diinput_oleh: string | null;
  divalidasi_oleh: string | null;
  status_validasi: 'draft' | 'tervalidasi';
  created_at?: string;
}

export interface AbsenMapel {
  id: string;
  tanggal: string;
  jadwal_id: string;
  siswa_id: string;
  status: AttendanceStatusDB;
  diinput_oleh: string | null;
  created_at?: string;
}

export type AttendanceStatusUI = 'Hadir' | 'Sakit' | 'Izin' | 'Alfa';
export interface Student {
  id: string;
  no: string;
  name: string;
  nis: string;
  status: AttendanceStatusUI;
  note?: string;
  hasAttachment?: boolean;
  attachmentTitle?: string;
  attachmentType?: 'medical' | 'dispensation';
}

export interface ScheduleSlot {
  id: string;
  day: HariEnum;
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
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'attendance' | 'schedule' | 'broadcast';
}

export function dbToUIStatus(status: AttendanceStatusDB): AttendanceStatusUI {
  const map: Record<string, AttendanceStatusUI> = {
    'Hadir': 'Hadir',
    'Izin': 'Izin',
    'Sakit': 'Sakit',
    'Alfa': 'Alfa',
    'Terlambat': 'Hadir'
  };
  return map[status] || 'Alfa';
}

export function uiToDBStatus(status: AttendanceStatusUI): AttendanceStatusDB {
  const map: Record<string, AttendanceStatusDB> = {
    'Hadir': 'Hadir',
    'Izin': 'Izin',
    'Sakit': 'Sakit',
    'Alfa': 'Alfa'
  };
  return map[status] || 'Alfa';
}
