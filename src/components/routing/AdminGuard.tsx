import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { isAdmin } from '../../utils/roles';
import { ForbiddenPage } from '../../pages/ForbiddenPage';

export function AdminGuard({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (!isAdmin(user?.roles)) {
    return <ForbiddenPage />;
  }

  return children;
}
