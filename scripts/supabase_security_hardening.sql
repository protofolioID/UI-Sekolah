-- ==============================================================================
-- SUPABASE POSTGRESQL SECURITY HARDENING & ROW LEVEL SECURITY (RLS) MIGRATION
-- Target Project: SMKN 1 Sorong - Student Hub & Presensi (SIAP)
-- ==============================================================================

-- 1. HARDEN TABLE: profiles (Mencegah Privilege Escalation & Kebocoran PII Siswa/Guru)
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Hanya user terautentikasi yang dapat membaca profil (Mencegah anonymous scraping)
DROP POLICY IF EXISTS "Profiles read policy" ON public.profiles;
CREATE POLICY "Profiles read policy"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Policy: User hanya boleh mengupdate profil miliknya sendiri
DROP POLICY IF EXISTS "Profiles self update" ON public.profiles;
CREATE POLICY "Profiles self update"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Trigger: Blokir eksploitasi manipulasi kolom 'role' dan 'is_sekretaris' oleh siswa/user biasa
CREATE OR REPLACE FUNCTION public.trg_prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.role IS DISTINCT FROM NEW.role OR OLD.is_sekretaris IS DISTINCT FROM NEW.is_sekretaris) THEN
    -- Hanya service_role atau admin yang sah yang boleh mengubah role
    IF current_user <> 'service_role' AND (
      SELECT role FROM public.profiles WHERE id = auth.uid()
    ) NOT IN ('admin', 'superadmin', 'operator') THEN
      RAISE EXCEPTION 'Akses Ditolak: Anda tidak memiliki wewenang mengubah peran pengguna.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_profile_roles ON public.profiles;
CREATE TRIGGER trg_protect_profile_roles
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.trg_prevent_role_escalation();


-- 2. HARDEN TABLE: absen_mapel (Mencegah Pemalsuan & Penghapusan Presensi Tanpa Login)
ALTER TABLE IF EXISTS public.absen_mapel ENABLE ROW LEVEL SECURITY;

-- Policy: Pembacaan data presensi mapel hanya untuk pengguna login
DROP POLICY IF EXISTS "absen_mapel read authenticated" ON public.absen_mapel;
CREATE POLICY "absen_mapel read authenticated"
ON public.absen_mapel
FOR SELECT
TO authenticated
USING (true);

-- Policy: Hanya guru pengampu jadwal atau admin yang boleh input/edit/hapus presensi mapel
DROP POLICY IF EXISTS "absen_mapel modify teacher or admin" ON public.absen_mapel;
CREATE POLICY "absen_mapel modify teacher or admin"
ON public.absen_mapel
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.jadwal j
    WHERE j.id = absen_mapel.jadwal_id
      AND (
        j.guru_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM public.profiles p 
          WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin', 'operator')
        )
      )
  )
)
WITH CHECK (
  diinput_oleh = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin', 'operator')
  )
);


-- 3. HARDEN TABLE: absen_harian (Mencegah Siswa Mengubah Presensi Kelas)
ALTER TABLE IF EXISTS public.absen_harian ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "absen_harian read authenticated" ON public.absen_harian;
CREATE POLICY "absen_harian read authenticated"
ON public.absen_harian
FOR SELECT
TO authenticated
USING (true);

-- Policy: Input draf oleh sekretaris kelas atau wali kelas terdaftar
DROP POLICY IF EXISTS "absen_harian write secretary or teacher" ON public.absen_harian;
CREATE POLICY "absen_harian write secretary or teacher"
ON public.absen_harian
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND (
      p.is_sekretaris = true OR
      p.role IN ('guru', 'wali_kelas', 'guru_piket', 'operator', 'admin', 'superadmin')
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND (
      p.is_sekretaris = true OR
      p.role IN ('guru', 'wali_kelas', 'guru_piket', 'operator', 'admin', 'superadmin')
    )
  )
);


-- 4. HARDEN TABLE: jadwal & kelas (Hanya Admin yang Boleh Mengubah)
ALTER TABLE IF EXISTS public.jadwal ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.kelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mapel ENABLE ROW LEVEL SECURITY;

-- Read policy: Publik / Terautentikasi dapat membaca jadwal
DROP POLICY IF EXISTS "jadwal read all" ON public.jadwal;
CREATE POLICY "jadwal read all" ON public.jadwal FOR SELECT USING (true);

DROP POLICY IF EXISTS "kelas read all" ON public.kelas;
CREATE POLICY "kelas read all" ON public.kelas FOR SELECT USING (true);

DROP POLICY IF EXISTS "mapel read all" ON public.mapel;
CREATE POLICY "mapel read all" ON public.mapel FOR SELECT USING (true);

-- Write policy: Hanya admin/operator yang boleh mengubah jadwal, kelas, dan mapel
DROP POLICY IF EXISTS "jadwal admin write" ON public.jadwal;
CREATE POLICY "jadwal admin write"
ON public.jadwal
FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin', 'operator'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin', 'operator'))
);

DROP POLICY IF EXISTS "kelas admin write" ON public.kelas;
CREATE POLICY "kelas admin write"
ON public.kelas
FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin', 'operator'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin', 'operator'))
);


-- 5. HARDEN STORAGE BUCKET: avatars (Mencegah Anonymous Mass Listing)
-- Matikan public listing pada storage objects bucket avatars
DO $$
BEGIN
  UPDATE storage.buckets SET public = false WHERE id = 'avatars';
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;
