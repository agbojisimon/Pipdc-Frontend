import { createContext, useContext, useEffect, useCallback, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { tokenStore } from '../services/api';
import type { AuthResponse, AuthUser } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isRestoring: boolean;
  signIn: (auth: AuthResponse) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_KEY = 'pipdc_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? (JSON.parse(stored) as AuthUser) : null;
    } catch {
      return null;
    }
  });
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restore() {
      const stored = localStorage.getItem(USER_KEY);
      if (!tokenStore.hasSession() || !stored) {
        if (!tokenStore.hasSession()) tokenStore.clear();
        if (!cancelled) setIsRestoring(false);
        return;
      }

      try {
        const me = await authService.me();
        if (!cancelled) {
          setUser(me);
          localStorage.setItem(USER_KEY, JSON.stringify(me));
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          localStorage.removeItem(USER_KEY);
        }
      } finally {
        if (!cancelled) setIsRestoring(false);
      }
    }

    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (auth: AuthResponse) => {
    tokenStore.setAccess(auth.accessToken);
    tokenStore.setRefresh(auth.refreshToken);
    try {
      const me = await authService.me();
      setUser(me);
      localStorage.setItem(USER_KEY, JSON.stringify(me));
    } catch (err) {
      tokenStore.clear();
      localStorage.removeItem(USER_KEY);
      setUser(null);
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    const refreshToken = tokenStore.getRefresh();
    if (refreshToken) await authService.revoke(refreshToken);
    tokenStore.clear();
    localStorage.removeItem(USER_KEY);
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), isRestoring, signIn, signOut, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
