import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { isInternalPath } from '../../utils/navigation';
import { RouteLoadingState } from './RouteLoadingState';

export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { isAuthenticated, isRestoring, user } = useAuth();
  const location = useLocation();

  if (isRestoring) {
    return <RouteLoadingState label="Restoring session" />;
  }

  if (isAuthenticated) {
    const from = (location.state as { from?: string } | null)?.from;
    const landing = isInternalPath(from) ? from : user?.roles.includes('Admin') ? '/dashboard' : '/';
    return <Navigate to={landing} replace />;
  }

  return children;
}
