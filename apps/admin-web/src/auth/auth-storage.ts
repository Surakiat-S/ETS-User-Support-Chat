import type { AuthAdminProfile } from '../types/auth';

const AUTH_ADMIN_KEY = 'adminUser';

export function getStoredAdmin(): AuthAdminProfile | null {
  const raw = localStorage.getItem(AUTH_ADMIN_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthAdminProfile;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function saveAuthSession(admin: AuthAdminProfile): void {
  localStorage.setItem(AUTH_ADMIN_KEY, JSON.stringify(admin));
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_ADMIN_KEY);
}
