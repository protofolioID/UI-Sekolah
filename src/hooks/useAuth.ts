import { useState, useEffect } from 'react';
import { supabase, type Profile } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mockRole, setMockRole] = useState<Profile['role']>('siswa');

  useEffect(() => {
    // Immediately mock login with siswa role
    mockLogin(mockRole);
  }, []);

  // Mock login for immediate demo
  async function mockLogin(role: Profile['role'] = 'siswa') {
    setMockRole(role);
    let mockUser: Profile;
    switch (role) {
      case 'siswa':
        mockUser = {
          id: '6316dc04-ac40-4ccb-9ed6-a2071d9ee32c',
          username: 's0097658890',
          nama: 'Cindy Laura',
          role: 'siswa',
          kelas_id: 'e88128be-8fc3-4973-8d69-00ef17571626', // XII TKJ 1
          must_change_password: false,
          kelas: { id: 'e88128be-8fc3-4973-8d69-00ef17571626', nama: 'XII TKJ 1' }
        };
        break;
      case 'guru':
        mockUser = {
          id: '5ec27fd6-cfe1-4ca6-856f-5f68c8e2c725',
          username: '196812291993031011',
          nama: 'Budi Santoso, S.Kom',
          role: 'guru',
          kelas_id: null,
          must_change_password: false
        };
        break;
      case 'admin':
        mockUser = {
          id: '1a98895b-65d5-4a30-b5e1-d695c5abb54f',
          username: 'admin_demo',
          nama: 'Administrator SMKN 1',
          role: 'admin',
          kelas_id: null,
          must_change_password: false
        };
        break;
      default:
        mockUser = {
          id: '',
          username: 'demo',
          nama: 'Demo User',
          role: 'siswa',
          kelas_id: null,
          must_change_password: false
        };
    }
    setUser(mockUser);
    setLoading(false);
    return { user: mockUser };
  }

  async function logout() {
    setUser(null);
    setLoading(false);
  }

  return { user, loading, logout, mockLogin, currentRole: mockRole };
}