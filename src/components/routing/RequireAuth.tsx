import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { RouteLoadingState } from './RouteLoadingState';

export function RequireAuth({ children }: { children?: ReactNode }) {
  const { isAuthenticated, isRestoring } = useAuth();
  const location = useLocation();

  if (isRestoring) {
    return <RouteLoadingState label="Restoring session" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return children ?? <Outlet />;
}
