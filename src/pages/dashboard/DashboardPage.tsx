import { AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { PageLoader } from '../../components/ui/Spinner';
import { AdminDashboard } from '../../components/dashboard/AdminDashboard';
import { AgentDashboard } from '../../components/dashboard/AgentDashboard';
import { ClientDashboard } from '../../components/dashboard/ClientDashboard';
import { useDashboard } from '../../hooks/queries';
import { useAuth } from '../../contexts/AuthContext';
import { primaryRole, type Role } from '../../utils/roles';
import type {
  AdminDashboard as AdminDashboardData,
  AgentDashboard as AgentDashboardData,
  ClientDashboard as ClientDashboardData,
  DashboardData,
} from '../../types';

function isAdminDashboard(data: DashboardData | undefined): data is AdminDashboardData {
  return Boolean(data && 'totalUsers' in data);
}

function isAgentDashboard(data: DashboardData | undefined): data is AgentDashboardData {
  return Boolean(data && 'agent' in data);
}

function isClientDashboard(data: DashboardData | undefined): data is ClientDashboardData {
  return Boolean(data && 'profile' in data);
}

const expectedComponent: Record<Role, string> = {
  Admin: 'AdminDashboard',
  Agent: 'AgentDashboard',
  Client: 'ClientDashboard',
};

export function DashboardPage() {
  const { user } = useAuth();
  const role = primaryRole(user?.roles);
  const dashboardQuery = useDashboard();
  const data = dashboardQuery.data;

  if (import.meta.env.DEV) {
    console.log('[PIPDC Dashboard] === dispatch trace ===');
    console.log('[PIPDC Dashboard] authenticated user:', user);
    console.log('[PIPDC Dashboard] roles:', user?.roles);
    console.log('[PIPDC Dashboard] resolved primary role:', role);
    console.log('[PIPDC Dashboard] expected dashboard:', expectedComponent[role]);
    console.log('[PIPDC Dashboard] query status:', dashboardQuery.status, 'fetchStatus:', dashboardQuery.fetchStatus);
    console.log('[PIPDC Dashboard] dashboard response:', data);
    console.log('[PIPDC Dashboard] response keys:', data ? Object.keys(data) : null);
  }

  if (dashboardQuery.isError) {
    return (
      <div className="space-y-6">
        <h1 className="heading-3">Dashboard</h1>
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-16 text-center">
          <AlertTriangle className="h-8 w-8 text-gold-500" />
          <h3 className="font-display text-lg font-semibold text-ink-900">Unable to load dashboard data</h3>
          <p className="max-w-md text-sm text-ink-500">Make sure the backend is running, then try again.</p>
          <Button variant="outline" size="md" onClick={() => dashboardQuery.refetch()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return <PageLoader label="Loading dashboard" />;
  }

  if (role === 'Admin' && isAdminDashboard(data)) return <AdminDashboard data={data} />;
  if (role === 'Agent' && isAgentDashboard(data)) return <AgentDashboard data={data} />;
  if (role === 'Client' && isClientDashboard(data)) return <ClientDashboard data={data} />;

  return (
    <div className="space-y-6">
      <h1 className="heading-3">Dashboard</h1>
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gold-300 bg-gold-50 px-6 py-16 text-center">
        <AlertTriangle className="h-8 w-8 text-gold-600" />
        <h3 className="font-display text-lg font-semibold text-ink-900">Dashboard data does not match your role</h3>
        <p className="max-w-md text-sm text-ink-600">
          Your account resolves to {role}, but the dashboard response does not match the expected {expectedComponent[role]} shape.
          Check the browser console for the response keys, then try again.
        </p>
        <Button variant="outline" size="md" onClick={() => dashboardQuery.refetch()}>
          Try again
        </Button>
      </div>
    </div>
  );
}
