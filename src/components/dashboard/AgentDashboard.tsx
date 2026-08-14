import { Link } from 'react-router-dom';
import { Building2, MessageSquare, Clock, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { StatCard } from './StatCard';
import { ProfileCard } from './ProfileCard';
import { PropertyList } from './PropertyList';
import { EnquiryList } from './EnquiryList';
import type { AgentDashboard as AgentDashboardData } from '../../types';

export function AgentDashboard({ data }: { data: AgentDashboardData }) {
  const { agent, totalProperties, recentProperties, totalEnquiries, pendingEnquiries, recentEnquiries } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="heading-3">My Dashboard</h1>
          <p className="mt-1 text-sm text-ink-500">Welcome back, {agent.fullName}. Here&rsquo;s what&rsquo;s happening with your listings.</p>
        </div>
        <Link to="/dashboard/properties?new=1">
          <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />}>
            Add Property
          </Button>
        </Link>
      </div>

      <ProfileCard
        name={agent.fullName}
        email={agent.email}
        avatarUrl={agent.photo}
        subtitle={agent.title}
        verified={agent.verified}
        details={[
          { label: 'Agency', value: agent.agency },
          { label: 'Phone', value: agent.phone },
          { label: 'License', value: agent.licenseNumber },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="My Properties" value={totalProperties} icon={<Building2 className="h-5 w-5" />} index={0} />
        <StatCard label="My Enquiries" value={totalEnquiries} icon={<MessageSquare className="h-5 w-5" />} index={1} tone="gold" />
        <StatCard label="Pending Enquiries" value={pendingEnquiries} icon={<Clock className="h-5 w-5" />} index={2} tone="dark" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PropertyList
          title="Recent Properties"
          items={recentProperties}
          emptyMessage="You haven&rsquo;t listed any properties yet."
          showAgent={false}
          viewAll={{ to: '/dashboard/properties', label: 'View all' }}
        />
        <EnquiryList
          title="Recent Enquiries"
          items={recentEnquiries}
          emptyMessage="No enquiries on your properties yet."
          viewAll={{ to: '/dashboard/enquiries', label: 'View all' }}
        />
      </div>
    </div>
  );
}
