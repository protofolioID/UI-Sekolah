import { ScheduleDay, SubjectSchedule } from '../../types/attendance';

export const SCHEDULE_DAYS: ScheduleDay[] = [
  { id: 'senin', name: 'Senin' },
  { id: 'selasa', name: 'Selasa' },
  { id: 'rabu', name: 'Rabu' },
  { id: 'kamis', name: 'Kamis' },
  { id: 'jumat', name: 'Jumat' },
  { id: 'sabtu', name: 'Sabtu' },
];

export const SCHEDULES_BY_DAY: Record<string, SubjectSchedule[]> = {
  senin: [
    {
      id: 'senin-1',
      subject: 'Materi Kejuruan RPL',
      time: '08.15 - 11.50',
      teacher: 'Budi Hartono, S.Kom.',
      type: 'productive'
    },
    {
      id: 'senin-2',
      subject: 'Basis Data',
      time: '11.50 - 13.25',
      teacher: 'Dewi Lestari, S.Pd.',
      type: 'productive'
    },
    {
      id: 'senin-3',
      subject: 'Pemrograman Web',
      time: '13.25 - 14.45',
      teacher: 'Iwan Setiawan, S.Kom.',
      type: 'productive'
    },
  ],
  selasa: [
    {
      id: 'selasa-1',
      subject: 'PPKn',
      time: '08.15 - 09.35',
      teacher: 'Siti Nurhaliza, M.Pd.',
      type: 'general'
    },
    {
      id: 'selasa-2',
      subject: 'Pemrograman Berorientasi Objek',
      time: '09.35 - 12.30',
      teacher: 'Budi Hartono, S.Kom.',
      type: 'productive'
    },
    {
      id: 'selasa-3',
      subject: 'Basis Data Lanjut',
      time: '12.45 - 14.45',
      teacher: 'Dewi Lestari, S.Pd.',
      type: 'productive'
    },
  ],
  rabu: [
    {
      id: 'rabu-1',
      subject: 'Bahasa Indonesia',
      time: '08.15 - 10.15',
      teacher: 'Siti Nurhaliza, M.Pd.',
      type: 'general'
    },
    {
      id: 'rabu-2',
      subject: 'Bahasa Inggris',
      time: '10.30 - 12.30',
      teacher: 'Dewi Lestari, S.Pd.',
      type: 'general'
    },
    {
      id: 'rabu-3',
      subject: 'Matematika Terapan',
      time: '12.45 - 14.45',
      teacher: 'Budi Hartono, S.Kom.',
      type: 'general'
    },
  ],
  kamis: [
    {
      id: 'kamis-1',
      subject: 'Pemrograman Perangkat Bergerak',
      time: '08.15 - 12.30',
      teacher: 'Budi Hartono, S.Kom.',
      type: 'productive'
    },
    {
      id: 'kamis-2',
      subject: 'Matematika Terapan',
      time: '12.45 - 14.45',
      teacher: 'Iwan Setiawan, S.Kom.',
      type: 'general'
    },
  ],
  jumat: [
    {
      id: 'jumat-1',
      subject: 'Kejuruan Komputer & Jaringan',
      time: '08.15 - 09.15',
      teacher: 'Iwan Setiawan, S.Kom.',
      type: 'productive'
    },
    {
      id: 'jumat-2',
      subject: 'Bahasa Indonesia',
      time: '09.15 - 11.00',
      teacher: 'Siti Nurhaliza, M.Pd.',
      type: 'general'
    },
  ],
  sabtu: [
    {
      id: 'sabtu-1',
      subject: 'Bahasa Inggris Kejuruan',
      time: '08.15 - 10.15',
      teacher: 'Dewi Lestari, S.Pd.',
      type: 'general'
    },
    {
      id: 'sabtu-2',
      subject: 'Proyek Kreatif & Kewirausahaan',
      time: '10.30 - 11.50',
      teacher: 'Budi Hartono, S.Kom.',
      type: 'productive'
    },
    {
      id: 'sabtu-3',
      subject: 'Pengembangan Produk Perangkat Lunak',
      time: '12.05 - 13.25',
      teacher: 'Budi Hartono, S.Kom.',
      type: 'productive'
    },
  ],
};
