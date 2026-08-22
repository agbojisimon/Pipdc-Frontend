import { useAuth } from '../../../contexts/AuthContext';
import { primaryRole } from '../../../utils/roles';
import { AdminEnquiriesSection } from './AdminEnquiriesSection';
import { AgentEnquiriesSection } from './AgentEnquiriesSection';

export function EnquiriesSection({ title }: { title: string }) {
  const { user } = useAuth();
  const role = primaryRole(user?.roles);

  if (role === 'Admin') return <AdminEnquiriesSection title={title} />;
  return <AgentEnquiriesSection title={title} />;
}
