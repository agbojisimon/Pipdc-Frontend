import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { RouteLoadingState } from './RouteLoadingState';

export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { isAuthenticated, isRestoring, user } = useAuth();

  if (isRestoring) {
    return <RouteLoadingState label="Restoring session" />;
  }

  if (isAuthenticated) {
    const landing = user?.roles.includes('Admin') ? '/dashboard' : '/';
    return <Navigate to={landing} replace />;
  }

  return children;
}
