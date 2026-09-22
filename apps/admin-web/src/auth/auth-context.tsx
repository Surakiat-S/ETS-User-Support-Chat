import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { loginMock } from '../services/api';
import { clearAuthSession, getStoredAdmin, saveAuthSession } from './auth-storage';
import type { AuthAdminProfile, MockLoginPayload } from '../types/auth';

interface AuthContextValue {
  admin: AuthAdminProfile | null;
  isAuthenticated: boolean;
  login: (payload: MockLoginPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AuthAdminProfile | null>(getStoredAdmin());

  async function login(payload: MockLoginPayload) {
    const response = await loginMock(payload);
    const nextAdmin: AuthAdminProfile = {
      adminId: response.admin_id,
      username: response.username,
      displayName: response.display_name,
      role: response.role,
    };

    saveAuthSession(nextAdmin);
    setAdmin(nextAdmin);
  }

  function logout() {
    clearAuthSession();
    setAdmin(null);
  }

  const value = useMemo(
    () => ({
      admin,
      isAuthenticated: Boolean(admin),
      login,
      logout,
    }),
    [admin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
