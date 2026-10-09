import * as XLSX from 'xlsx';
import { ScheduleSlot, Student } from '../types';

/**
 * Export schedule slots to Excel (.xlsx)
 */
export function exportScheduleToExcel(schedules: ScheduleSlot[], className: string = 'XII TKJ 1') {
  const rows = schedules
    .filter((s) => !s.isBreak)
    .map((s, idx) => ({
      'No': idx + 1,
      'Hari': s.day || 'Senin',
      'Jam Pelajaran (JP)': s.jpLabel || `JP ${s.jpStart}-${s.jpEnd}`,
      'Rentang Waktu (WIT)': s.timeRange,
      'Mata Pelajaran': s.subject || '',
      'Kode Mapel': s.subjectCode || '',
      'Guru Pengampu': s.teacher || '',
      'Ruang / Lab': s.room || '',
      'Kelas / Rombel': className,
    }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 5 },  // No
    { wch: 10 }, // Hari
    { wch: 18 }, // JP
    { wch: 22 }, // Waktu
    { wch: 35 }, // Mapel
    { wch: 12 }, // Kode Mapel
    { wch: 28 }, // Guru
    { wch: 20 }, // Ruang
    { wch: 15 }, // Kelas
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Jadwal_${className.replace(/\s+/g, '_')}`);

  const fileName = `JADWAL_${className.replace(/\s+/g, '_')}_SMKN1_SORONG_2026.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

/**
 * Export attendance recap to Excel (.xlsx)
 */
export function exportAttendanceRecapToExcel(
  students: Student[],
  className: string = 'XII TKJ 1',
  period: string = 'Oktober 2026'
) {
  const rows = students.map((s, idx) => {
    const isPresent = s.status === 'Hadir';
    const isSick = s.status === 'Sakit';
    const isPermit = s.status === 'Izin';
    const isAlpha = s.status === 'Alfa';

    return {
      'No': idx + 1,
      'NIS / NISN': s.nis,
      'Nama Siswa': s.name,
      'Kelas': className,
      'Status Hari Ini': s.status,
      'Total Hadir': isPresent ? 14 : 13,
      'Total Sakit': isSick ? 1 : 0,
      'Total Izin': isPermit ? 1 : 0,
      'Total Alfa': isAlpha ? 1 : 0,
      'Persentase Kehadiran': isAlpha ? '92.8%' : '100.0%',
      'Keterangan': s.note || '-',
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet['!cols'] = [
    { wch: 5 },  // No
    { wch: 14 }, // NIS
    { wch: 30 }, // Nama
    { wch: 12 }, // Kelas
    { wch: 16 }, // Status
    { wch: 12 }, // Hadir
    { wch: 12 }, // Sakit
    { wch: 12 }, // Izin
    { wch: 12 }, // Alfa
    { wch: 20 }, // %
    { wch: 35 }, // Keterangan
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Rekap_${className.replace(/\s+/g, '_')}`);

  const fileName = `REKAP_PRESENSI_${className.replace(/\s+/g, '_')}_${period.replace(/\s+/g, '_')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

/**
 * Parse uploaded Excel file to schedule slots
 */
export async function parseExcelToSchedules(file: File): Promise<ScheduleSlot[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (!rawJson || rawJson.length === 0) {
          throw new Error('File Excel kosong atau format tidak sesuai.');
        }

        const parsedSchedules: ScheduleSlot[] = rawJson.map((row, idx) => {
          const day = row['Hari'] || row['day'] || 'Senin';
          const subject = row['Mata Pelajaran'] || row['subject'] || row['Mapel'] || 'Pelajaran';
          const teacher = row['Guru Pengampu'] || row['teacher'] || row['Guru'] || 'Guru';
          const room = row['Ruang / Lab'] || row['room'] || row['Ruang'] || 'Kelas';
          const timeRange = row['Rentang Waktu (WIT)'] || row['timeRange'] || row['Waktu'] || '07:15 - 08:45 WIT';
          const jpLabel = row['Jam Pelajaran (JP)'] || row['jpLabel'] || row['JP'] || `JP ${idx + 1}`;

          return {
            id: `sch-imported-${Date.now()}-${idx}`,
            day: (['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].includes(day) ? day : 'Senin') as any,
            subject,
            teacher,
            room,
            timeRange,
            jpLabel,
            jpStart: 1,
            jpEnd: 2,
            badgeType: 'normal',
          };
        });

        resolve(parsedSchedules);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}
