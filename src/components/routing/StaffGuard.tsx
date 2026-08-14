import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { isStaff } from '../../utils/roles';
import { ForbiddenPage } from '../../pages/ForbiddenPage';

export function StaffGuard({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (!isStaff(user?.roles)) {
    return <ForbiddenPage />;
  }

  return children;
}
