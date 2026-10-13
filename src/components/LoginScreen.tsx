import React, { useState } from 'react';
import { ASSETS } from '../data/mockData';

interface LoginScreenProps {
  onLogin: (username: string, role?: 'siswa' | 'guru' | 'admin' | 'superadmin', nama?: string) => void;
  onOpenPublicSchedule: () => void;
}

const SUPABASE_URL = 'https://cfcdqmajoazxcoxgnoka.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NjUzNzEsImV4cCI6MjEwNjM0MTM3MX0.wLxxXMBd0q8HZM0HGhfGb0yMuA-a3daofIHMK8Bxjmc';

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onOpenPublicSchedule,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const cleanInput = identifier.trim();
    if (!cleanInput) {
      setErrorMessage('Harap masukkan NISN, NIP, atau Username.');
      setLoading(false);
      return;
    }

    try {
      // 1. Live lookup from Supabase Database
      const filterUrl = `${SUPABASE_URL}/rest/v1/profiles?or=(username.eq.${cleanInput},username.eq.s${cleanInput},nama.ilike.*${cleanInput}*)&select=id,username,nama,role,kelas_id&limit=1`;
      const response = await fetch(filterUrl, {
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
        },
      });

      if (response.ok) {
        const results = await response.json();
        if (results && results.length > 0) {
          const profile = results[0];
          let mappedRole: 'siswa' | 'guru' | 'admin' | 'superadmin' = 'siswa';
          if (profile.role === 'superadmin' || cleanInput.includes('super') || cleanInput === 'kepsek') {
            mappedRole = 'superadmin';
          } else if (profile.role === 'admin' || profile.role === 'operator') {
            mappedRole = 'admin';
          } else if (profile.role === 'guru') {
            mappedRole = 'guru';
          } else {
            mappedRole = 'siswa';
          }

          onLogin(profile.username, mappedRole, profile.nama);
          setLoading(false);
          return;
        }
      }

      // 2. Fallback heuristic pattern matcher if network / unregistered
      let detectedRole: 'siswa' | 'guru' | 'admin' | 'superadmin' = 'siswa';
      const lower = cleanInput.toLowerCase();

      if (lower.includes('super') || lower === 'kepsek' || lower === 'admin_utama') {
        detectedRole = 'superadmin';
      } else if (lower.includes('admin') || lower === 'tu' || lower.includes('operator')) {
        detectedRole = 'admin';
      } else if (/^\d{18}$/.test(cleanInput) || lower.includes('guru') || lower.includes('budi') || lower.includes('yayuk')) {
        detectedRole = 'guru';
      } else {
        detectedRole = 'siswa';
      }

      const displayName = cleanInput.charAt(0).toUpperCase() + cleanInput.slice(1);
      onLogin(cleanInput, detectedRole, displayName);
    } catch (err: any) {
      // Fallback
      onLogin(cleanInput, 'siswa', cleanInput);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: 'siswa' | 'guru' | 'admin' | 'superadmin', username: string, nama: string) => {
    setIdentifier(username);
    setPassword('Demo@2026');
    setLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      onLogin(username, role, nama);
      setLoading(false);
    }, 250);
  };

  return (
    <div className="min-h-screen w-full bg-[#f7f9fb] flex flex-col justify-between max-w-lg mx-auto relative overflow-hidden font-sans selection:bg-[#77b7fe] selection:text-[#00487a]">
      {/* Background Curved Blue Ambient Banner */}
      <div className="relative bg-gradient-to-b from-[#00609b] via-[#0079c2] to-[#0761a2] pt-10 pb-20 px-6 rounded-b-[36px] shadow-md overflow-hidden">
        {/* Ambient Glowing Orbs */}
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-[#77b7fe]/25 blur-2xl pointer-events-none" />
        <div className="absolute -left-12 bottom-2 w-44 h-44 rounded-full bg-[#6ffbbe]/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white rounded-2xl p-2.5 shadow-xl ring-4 ring-white/30 flex items-center justify-center mb-2.5 animate-scaleUp">
            <img
              src={ASSETS.logo}
              alt="Logo SMKN 1 Sorong"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-white text-[20px] font-extrabold tracking-tight">
            SMKN 1 SORONG
          </h1>
          <p className="text-[#cfe4ff] text-[11px] font-semibold tracking-wider uppercase mt-0.5">
            Sistem Informasi Absensi &amp; Pelajaran (SIAP)
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-[#6ffbbe] text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6ffbbe] animate-pulse" />
            Tahun Ajaran 2026/2027 • Semester Ganjil
          </div>
        </div>
      </div>

      {/* Floating Login Card */}
      <div className="px-5 -mt-12 flex flex-col gap-3 relative z-20 flex-1">
        <div className="bg-white rounded-3xl p-5 shadow-[0_12px_30px_-5px_rgba(0,95,160,0.12),0_4px_12px_rgba(0,0,0,0.04)] border border-[#eceef0]">
          <div className="flex items-center justify-between pb-3 border-b border-[#eceef0] mb-3">
            <h2 className="text-[15px] font-bold text-[#191c1e] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#00609b] text-[20px]">
                lock_open
              </span>
              Masuk ke Akun
            </h2>
          </div>

          {errorMessage && (
            <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Input NISN / Username */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#404751]">
                NISN / NIP / Username
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#707882] text-[18px]">
                  badge
                </span>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Contoh: s3094249474 atau 19681229..."
                  className="w-full h-11 pl-9 pr-4 bg-[#f2f4f6] rounded-xl text-[13px] text-[#191c1e] font-semibold placeholder:text-[#707882]/70 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#00609b] border border-transparent focus:border-[#00609b] transition-all"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#404751]">
                Kata Sandi
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#707882] text-[18px]">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full h-11 pl-9 pr-11 bg-[#f2f4f6] rounded-xl text-[13px] text-[#191c1e] font-semibold placeholder:text-[#707882]/70 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#00609b] border border-transparent focus:border-[#00609b] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[#707882] hover:text-[#191c1e] transition-colors p-1"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-1 rounded-full bg-gradient-to-r from-[#00609b] to-[#0761a2] text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-[0_6px_14px_-2px_rgba(0,134,214,0.32)] active:scale-98 hover:opacity-95 transition-all disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Masuk Sistem</span>
                  <span className="material-symbols-outlined text-[17px]">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Role Selector (Exact 4 Rules Hierarchy) */}
          <div className="mt-4 pt-3 border-t border-[#eceef0] flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#707882] text-center">
              Pilih Akses Cepat (4 Role Hierarki SMKN 1 Sorong):
            </span>
            <div className="grid grid-cols-2 gap-2">
              {/* Role 3: Siswa */}
              <button
                type="button"
                onClick={() => handleQuickLogin('siswa', 's0097658890', 'Cindy Laura')}
                className="p-2.5 rounded-xl bg-[#cfe4ff]/40 hover:bg-[#cfe4ff]/80 border border-[#00609b]/20 flex items-center gap-2 text-left active:scale-95 transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#00609b] text-white flex items-center justify-center text-[12px] font-bold shrink-0">
                  🎓
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-[#001d34] truncate">3. Siswa</p>
                  <p className="text-[10px] text-[#004a79] truncate">Cindy Laura (TKJ)</p>
                </div>
              </button>

              {/* Role 2: Guru */}
              <button
                type="button"
                onClick={() => handleQuickLogin('guru', '196812291993031011', 'Budi Santoso, S.Kom')}
                className="p-2.5 rounded-xl bg-[#d1e4ff]/40 hover:bg-[#d1e4ff]/80 border border-[#0761a2]/20 flex items-center gap-2 text-left active:scale-95 transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#0761a2] text-white flex items-center justify-center text-[12px] font-bold shrink-0">
                  👨‍🏫
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-[#001d36] truncate">2. Guru Mapel</p>
                  <p className="text-[10px] text-[#00497d] truncate">Budi Santoso, S.Kom</p>
                </div>
              </button>

              {/* Role 1: Admin */}
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'admin_demo', 'Tata Usaha SMKN 1')}
                className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center gap-2 text-left active:scale-95 transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center text-[12px] font-bold shrink-0">
                  🛠️
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-amber-950 truncate">1. Admin TU</p>
                  <p className="text-[10px] text-amber-800 truncate">Operator Sekolah</p>
                </div>
              </button>

              {/* Role 0: Superadmin */}
              <button
                type="button"
                onClick={() => handleQuickLogin('superadmin', 'superadmin_sorong', 'Kepala Sekolah / IT Admin')}
                className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 flex items-center gap-2 text-left active:scale-95 transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-[12px] font-bold shrink-0">
                  👑
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-purple-950 truncate">0. Superadmin</p>
                  <p className="text-[10px] text-purple-800 truncate">Kepala Sekolah / IT</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Public Guest Mode Shortcut */}
        <button
          type="button"
          onClick={onOpenPublicSchedule}
          className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-[#f2f4f6] text-[#00609b] text-[12px] font-bold flex items-center justify-center gap-2 border border-[#cfe4ff] shadow-xs active:scale-98 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">
            calendar_today
          </span>
          <span>Lihat Jadwal Pelajaran Publik Tanpa Login</span>
        </button>
      </div>

      {/* Footer Branding */}
      <div className="py-3 text-center text-[#707882] text-[11px] font-medium z-10">
        SMK Negeri 1 Sorong • Papua Barat Daya
      </div>
    </div>
  );
};
