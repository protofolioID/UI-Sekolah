import { Student, ScheduleSlot, NotificationItem } from '../types';

export const ASSETS = {
  logo: 'https://lh3.googleusercontent.com/aida/AEtjO1UivPLLj_9-mYW02x9oVlh4qRdUFlTYUvGlS0yoWAu0my8xI8Y5UKqd87-rjuCbquyBA1U5zcUl9IYmlKBXwZ_DfAkDv2o3kop0ABr5Zdqe6KYnqMxIVOAkEMKsADhT_ZulvB3vg_9PtTEg6EeLVO4Dn1OWPuBtXMfKqaVgLYLOiHtB6bbZtL1wksdcbXA7ue4Q86AyqXmOTyiUxYld4_HMXP1LeY6V1fFBllBA9BA13oLzz2Z5xzG8b_BN',
  cindyPortrait: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjRCT7CPeU6CjU6IGe6UWfKjtEEVEhplTtpkLyg6Hys7R954nb5oxziyb3e7RxF13CqGna3Ku7Z9IRxrafUpAGpOXNkf9is1uhG5MZIZto0mocMsb7fHx7JE-eDGAb-_z_MuVPDTkGS-k-eqrp5En4vsmdz_gRoXZP-KHdQrUQxz2hYivRAY46SLkik924Gy_whTOJmDvu8RxlWLSVSqZcEcfEn23dNgJl01mqVFlcghO6sfQ6gkNc5w',
  teacherAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRXFpe0TMglcX8_mzixDo3RjDjUad5MLv-obtiX0bfwlxFxdc3LQYCf3w7hixO2yWXkLwtKJ6n_msgtv9KImLXi3cy91BDXn_UcOLvt1QilelClqQcdW2eHbtHBfDlnSiqIjWHI02MLa5BAvuQDKzsSfmoGM3IM87YpqEKKyWllGxRvNuPYydB2wXIVm4lMRTvE1je7gtyopzBjRpkx0bmGDbCAiJDcrfeEWerQDb-QDQRtKNlLPJG2w',
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's-01',
    no: '01',
    name: 'Ahmad Dani',
    nis: '20240101',
    status: 'Hadir',
  },
  {
    id: 's-02',
    no: '02',
    name: 'Cindy Laura',
    nis: '20240102',
    status: 'Hadir',
  },
  {
    id: 's-03',
    no: '03',
    name: 'Doni Tata',
    nis: '20240103',
    status: 'Sakit',
    note: 'Demam tinggi (Surat dokter terlampir)',
    hasAttachment: true,
    attachmentTitle: 'Surat Keterangan Dokter - RSUD Sele Be Solu Sorong',
    attachmentType: 'medical',
  },
  {
    id: 's-04',
    no: '04',
    name: 'Kevin Pratama',
    nis: '20240104',
    status: 'Alfa',
    note: 'Tanpa keterangan orang tua/wali',
  },
  {
    id: 's-05',
    no: '05',
    name: 'Muhammad Farhan',
    nis: '20240105',
    status: 'Hadir',
  },
  {
    id: 's-06',
    no: '06',
    name: 'Nurul Aini',
    nis: '20240106',
    status: 'Izin',
    note: 'Dispensasi LKS Tingkat Kota Sorong',
    hasAttachment: true,
    attachmentTitle: 'Surat Dispensasi Lomba Kompetensi Siswa (LKS) SMK Kota Sorong',
    attachmentType: 'dispensation',
  },
  {
    id: 's-07',
    no: '07',
    name: 'Rizky Ramadhan',
    nis: '20240107',
    status: 'Hadir',
  },
  // Additional students to complete the 34 total students of XII TKJ 1:
  ...Array.from({ length: 27 }, (_, i) => {
    const num = i + 8;
    const strNum = num < 10 ? `0${num}` : `${num}`;
    const names = [
      'Anisa Rahmawati', 'Bagus Prasetyo', 'Citra Dewi', 'Dimas Anggara', 'Eka Saputra',
      'Fadhil Hidayat', 'Gita Permata', 'Hafizh Alamsyah', 'Indah Kusuma', 'Joko Susilo',
      'Karin Oktavia', 'Lukman Hakim', 'Maya Sandrina', 'Nabil Makarim', 'Olivia Putri',
      'Panji Gumilang', 'Qori Amelia', 'Rendi Pratama', 'Siti Zulaikha', 'Taufik Hidayat',
      'Umar Faruq', 'Vivi Alviana', 'Wahyudi Santoso', 'Xaverius Wanggai', 'Yolanda Tabuni',
      'Zackly Rumaseb', 'Zulfa Nadira'
    ];
    return {
      id: `s-${strNum}`,
      no: strNum,
      name: names[i] || `Siswa TKJ ${strNum}`,
      nis: `202401${strNum}`,
      status: 'Hadir' as const,
    };
  }),
];

export const INITIAL_SCHEDULES: ScheduleSlot[] = [
  {
    id: 'sch-1',
    day: 'Selasa',
    jpStart: 1,
    jpEnd: 3,
    jpLabel: 'JP 1 - 3',
    timeRange: '07:15 - 09:30 WIT',
    subject: 'Pemodelan Perangkat Lunak (BA)',
    subjectCode: 'BA',
    teacher: 'Budi Santoso, S.Kom',
    room: 'Lab Komputer 2',
    badgeType: 'live',
    statusPresensi: 'Hadir',
    recordedTime: '07:10 WIT',
  },
  {
    id: 'break-1',
    day: 'Selasa',
    isBreak: true,
    breakTitle: 'ISTIRAHAT PAGI',
    breakSubtitle: 'Regang otot & santap kudapan',
    breakDuration: '09:30 - 09:50 WIT (20m)',
    breakIcon: 'coffee',
    breakColor: 'amber',
    timeRange: '09:30 - 09:50 WIT',
  },
  {
    id: 'sch-2',
    day: 'Selasa',
    jpStart: 4,
    jpEnd: 5,
    jpLabel: 'JP 4 - 5',
    timeRange: '09:50 - 11:20 WIT',
    subject: 'Pemrograman Web & Bergerak (TS)',
    subjectCode: 'TS',
    teacher: 'Ratna Dewi, M.Pd',
    room: 'Bengkel RPL',
    badgeType: 'upcoming',
    statusPresensi: 'Menunggu',
  },
  {
    id: 'sch-3',
    day: 'Selasa',
    jpStart: 6,
    jpEnd: 6,
    jpLabel: 'JP 6',
    timeRange: '11:20 - 12:05 WIT',
    subject: 'Bimbingan Konseling (BK)',
    subjectCode: 'BK',
    teacher: 'Ahmad Dani, S.Pd',
    room: 'Ruang Kelas TKJ 1',
    badgeType: 'normal',
  },
  {
    id: 'break-2',
    day: 'Selasa',
    isBreak: true,
    breakTitle: 'ISTIRAHAT SIANG & SHOLAT',
    breakSubtitle: 'Dzuhur berjamaah & makan siang',
    breakDuration: '12:05 - 12:45 WIT (40m)',
    breakIcon: 'mosque',
    breakColor: 'emerald',
    timeRange: '12:05 - 12:45 WIT',
  },
  {
    id: 'sch-4',
    day: 'Selasa',
    jpStart: 7,
    jpEnd: 9,
    jpLabel: 'JP 7 - 9',
    timeRange: '12:45 - 15:00 WIT',
    subject: 'Administrasi Sistem Jaringan (AX)',
    subjectCode: 'AX',
    teacher: 'Endang Supriadi, M.Kom',
    room: 'Lab Jaringan TKJ',
    badgeType: 'normal',
  },
];

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Presensi JP 1-3 Berhasil Dicatat',
    message: 'Kehadiranmu pada sesi Pemodelan PL (BA) tercatat pukul 07:10 WIT. Pertahankan disiplin!',
    time: '07:11 WIT',
    read: false,
    type: 'attendance',
  },
  {
    id: 'n-2',
    title: 'Disiplin Streak 14 Hari',
    message: 'Selamat! Cindy telah mencapai 14 hari berturut-turut hadir tepat waktu.',
    time: 'Kemarin',
    read: true,
    type: 'broadcast',
  },
  {
    id: 'n-3',
    title: 'Pengumuman LKS Kota Sorong',
    message: 'Teman sekelasmu Nurul Aini mewakili sekolah dalam LKS Bidang Web Technologies.',
    time: '2 hari lalu',
    read: true,
    type: 'schedule',
  },
];

export const JP_TIMES: Record<number, string> = {
  1: '07:15',
  2: '08:00',
  3: '08:45',
  4: '09:50',
  5: '10:35',
  6: '11:20',
  7: '12:45',
  8: '13:30',
  9: '14:15',
  10: '15:00',
};
