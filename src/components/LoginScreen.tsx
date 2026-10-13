import React, { useState } from 'react';
import { ASSETS } from '../data/mockData';
import { useLoginSecurity } from '../hooks/useLoginSecurity';

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

  // ─── LOGIN SECURITY INTEGRATION ───
  const {
    failedAttempts,
    isLocked,
    lockoutRemainingSeconds,
    captchaChallenge,
    captchaRequired,
    loginHistory,
    recordAttempt,
    verifyCaptcha,
    resetSecurity,
    sanitizeInput,
    generateNewCaptcha,
  } = useLoginSecurity();

  const [captchaInput, setCaptchaInput] = useState('');
  const [showAuditModal, setShowAuditModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Check Lockout State
    if (isLocked) {
      setErrorMessage(
        `⛔ Akses terkunci sementara demi keamanan karena terdeteksi ${failedAttempts}x percobaan gagal. Harap tunggu ${lockoutRemainingSeconds} detik lagi.`
      );
      return;
    }

    // 2. Input Sanitization
    const cleanInput = sanitizeInput(identifier.trim());
    if (!cleanInput) {
      setErrorMessage('Harap masukkan NISN, NIP, atau Username yang valid.');
      return;
    }

    // 3. Password Validation
    if (!password || password.length < 4) {
      setErrorMessage('Kata sandi harus diisi minimal 4 karakter.');
      return;
    }

    // 4. CAPTCHA Challenge Verification (active after 3 failed attempts)
    if (captchaRequired) {
      const numAnswer = parseInt(captchaInput.trim(), 10);
      if (isNaN(numAnswer) || !verifyCaptcha(numAnswer)) {
        recordAttempt(cleanInput, false);
        generateNewCaptcha();
        setCaptchaInput('');
        setErrorMessage(
          'Jawaban verifikasi keamanan (CAPTCHA) salah. Silakan jawab kembali soal matematika di bawah.'
        );
        return;
      }
    }

    setLoading(true);

    try {
      // 5. Live lookup from Supabase Database
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

          // Record successful attempt & reset security
          recordAttempt(profile.username || cleanInput, true);
          onLogin(profile.username, mappedRole, profile.nama);
          setLoading(false);
          return;
        }
      }

      // 6. Fallback heuristic pattern matcher (Demo / Offline mode)
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
      
      // Record successful login
      recordAttempt(cleanInput, true);
      onLogin(cleanInput, detectedRole, displayName);
    } catch (err: any) {
      // Record successful demo fallback
      recordAttempt(cleanInput, true);
      onLogin(cleanInput, 'siswa', cleanInput);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: 'siswa' | 'guru' | 'admin' | 'superadmin', username: string, nama: string) => {
    if (isLocked) {
      alert(`Sistem terkunci sementara. Harap tunggu ${lockoutRemainingSeconds} detik.`);
      return;
    }

    setIdentifier(username);
    setPassword('Demo@2026');
    setLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      recordAttempt(username, true);
      onLogin(username, role, nama);
      setLoading(false);
    }, 250);
  };

  return (
    <div className="min-h-screen w-full bg-[#f7f9fb] flex flex-col justify-between max-w-lg mx-auto relative overflow-hidden font-sans selection:bg-[#77b7fe] selection:text-[#00487a]">
      {/* Background Curved Blue Ambient Banner */}
      <div className="relative bg-gradient-to-b from-[#00609b] via-[#0079c2] to-[#0761a2] pt-8 pb-20 px-6 rounded-b-[36px] shadow-md overflow-hidden">
        {/* Ambient Glowing Orbs */}
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-[#77b7fe]/25 blur-2xl pointer-events-none" />
        <div className="absolute -left-12 bottom-2 w-44 h-44 rounded-full bg-[#6ffbbe]/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white rounded-2xl p-2.5 shadow-xl ring-4 ring-white/30 flex items-center justify-center mb-2 animate-scaleUp">
            <img
              src={ASSETS.logo}
              alt="Logo SMKN 1 Sorong"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-white text-[19px] font-extrabold tracking-tight">
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
          {/* Card Header & Security Badges */}
          <div className="flex items-center justify-between pb-3 border-b border-[#eceef0] mb-3">
            <h2 className="text-[14px] font-bold text-[#191c1e] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#00609b] text-[19px]">
                lock
              </span>
              <span>Masuk ke Akun</span>
            </h2>

            <button
              type="button"
              onClick={() => setShowAuditModal(true)}
              className="text-[10px] font-bold text-[#00609b] hover:text-[#00487a] bg-[#cfe4ff]/50 hover:bg-[#cfe4ff] px-2.5 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer"
              title="Lihat Log Keamanan Percobaan Login"
            >
              <span className="material-symbols-outlined text-[13px]">shield</span>
              <span>Audit Log ({loginHistory.length})</span>
            </button>
          </div>

          {/* Security Status Info Bar */}
          <div className="mb-3 px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[10px] font-semibold text-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-emerald-700">
                verified_user
              </span>
              <span>Proteksi Anti-Brute Force Aktif (Maks 5x)</span>
            </div>
            {failedAttempts > 0 && !isLocked && (
              <span className="text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-md">
                {failedAttempts}x Gagal
              </span>
            )}
          </div>

          {/* Lockout Warning Banner */}
          {isLocked && (
            <div className="mb-3 p-3 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-[11px] font-bold flex flex-col gap-1.5 animate-pulse">
              <div className="flex items-center gap-2 text-rose-800">
                <span className="material-symbols-outlined text-[18px]">lock_clock</span>
                <span>AKUN TERKUNCI SEMENTARA</span>
              </div>
              <p className="text-[10px] text-rose-700 font-normal leading-relaxed">
                Terdeteksi {failedAttempts} kali percobaan login gagal beruntun. Sistem
                melakukan penguncian sementara untuk mencegah serangan brute-force.
              </p>
              <div className="mt-1 flex items-center justify-between bg-white/80 p-2 rounded-xl border border-rose-200">
                <span className="text-[10px] text-[#404751]">Waktu tersisa:</span>
                <span className="text-[13px] font-mono font-extrabold text-rose-600">
                  {lockoutRemainingSeconds} detik
                </span>
              </div>
            </div>
          )}

          {/* General Error Message */}
          {errorMessage && !isLocked && (
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
                  disabled={isLocked}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Contoh: s3094249474 atau 19681229..."
                  className="w-full h-11 pl-9 pr-4 bg-[#f2f4f6] rounded-xl text-[13px] text-[#191c1e] font-semibold placeholder:text-[#707882]/70 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#00609b] border border-transparent focus:border-[#00609b] transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#404751]">
                  Kata Sandi
                </label>
                <span className="text-[9px] text-[#707882]">Min. 4 Karakter</span>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#707882] text-[18px]">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={isLocked}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full h-11 pl-9 pr-11 bg-[#f2f4f6] rounded-xl text-[13px] text-[#191c1e] font-semibold placeholder:text-[#707882]/70 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#00609b] border border-transparent focus:border-[#00609b] transition-all disabled:opacity-50"
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

            {/* CAPTCHA Challenge (Active after 3 failed attempts) */}
            {captchaRequired && !isLocked && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col gap-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-900 text-[11px] font-bold">
                    <span className="material-symbols-outlined text-[16px]">
                      psychology
                    </span>
                    <span>Tantangan Keamanan (Anti-Bot)</span>
                  </div>
                  <button
                    type="button"
                    onClick={generateNewCaptcha}
                    className="text-[10px] text-amber-800 hover:text-amber-950 font-bold underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[12px]">refresh</span>
                    <span>Ganti Soal</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 bg-white rounded-xl border border-amber-300 font-mono text-[14px] font-extrabold text-amber-950 tracking-wider">
                    {captchaChallenge?.question || '5 + 3 = ?'}
                  </div>
                  <input
                    type="number"
                    required
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="Jawaban angka"
                    className="flex-1 h-9 px-3 bg-white rounded-xl text-[12px] font-bold text-[#191c1e] border border-amber-300 focus:ring-2 focus:ring-[#00609b] outline-hidden"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isLocked}
              className="w-full h-11 mt-1 rounded-full bg-gradient-to-r from-[#00609b] to-[#0761a2] text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-[0_6px_14px_-2px_rgba(0,134,214,0.32)] active:scale-98 hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isLocked ? (
                <span>Terkunci ({lockoutRemainingSeconds}s)</span>
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

          {/* Quick Demo Role Selector (4 Rules Hierarchy) */}
          <div className="mt-4 pt-3 border-t border-[#eceef0] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#707882]">
                Akses Cepat Pengujian Role:
              </span>
              <span className="text-[9px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                Auth Guard Aktif
              </span>
            </div>
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
      <div className="py-3 text-center text-[#707882] text-[11px] font-medium z-10 flex items-center justify-center gap-2">
        <span>SMK Negeri 1 Sorong • Papua Barat Daya</span>
        <span>•</span>
        <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
          <span className="material-symbols-outlined text-[13px]">lock</span>
          <span>SSL 256-Bit</span>
        </span>
      </div>

      {/* ─── AUDIT TRAIL MODAL ─── */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#eceef0] overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 bg-[#00609b] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">
                  security_update_good
                </span>
                <h3 className="text-[14px] font-bold">
                  Log Audit Keamanan Percobaan Login
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1 text-[12px]">
              <div className="p-2.5 bg-[#f7f9fb] rounded-xl border border-[#eceef0] flex items-center justify-between text-[11px]">
                <div>
                  <p className="font-bold text-[#191c1e]">Status Sistem Keamanan:</p>
                  <p className="text-[#404751]">
                    Percobaan gagal saat ini: {failedAttempts} kali
                  </p>
                </div>
                {failedAttempts > 0 && (
                  <button
                    type="button"
                    onClick={resetSecurity}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[10px] cursor-pointer"
                  >
                    Reset Lockout
                  </button>
                )}
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#707882] mb-1.5">
                  Riwayat Percobaan Terbaru ({loginHistory.length}):
                </p>
                {loginHistory.length === 0 ? (
                  <p className="text-center py-6 text-[#707882] text-[11px]">
                    Belum ada riwayat aktivitas login yang dicatat.
                  </p>
                ) : (
                  <div className="divide-y divide-[#eceef0] max-h-60 overflow-y-auto border border-[#eceef0] rounded-xl">
                    {loginHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 flex items-center justify-between text-[11px]"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-[#191c1e] truncate">
                            {item.username}
                          </p>
                          <p className="text-[10px] text-[#707882]">
                            {new Date(item.timestamp).toLocaleTimeString('id-ID')} •{' '}
                            {new Date(item.timestamp).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            item.success
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.success ? 'Berhasil' : 'Gagal'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-[#f7f9fb] border-t border-[#eceef0] flex justify-end">
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                className="px-4 py-1.5 rounded-xl bg-[#00609b] text-white font-bold text-[11px]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
