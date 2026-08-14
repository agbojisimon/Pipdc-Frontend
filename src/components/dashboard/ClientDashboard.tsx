import { Heart, MessageSquare, Clock } from 'lucide-react';
import { StatCard } from './StatCard';
import { ProfileCard } from './ProfileCard';
import { PropertyList } from './PropertyList';
import { EnquiryList } from './EnquiryList';
import type { ClientDashboard as ClientDashboardData } from '../../types';

export function ClientDashboard({ data }: { data: ClientDashboardData }) {
  const { profile, totalSavedProperties, savedProperties, totalEnquiries, pendingEnquiries, recentEnquiries } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-3">My Dashboard</h1>
        <p className="mt-1 text-sm text-ink-500">Welcome back, {profile.fullName}. Here&rsquo;s a summary of your activity with PIPDC.</p>
      </div>

      <ProfileCard name={profile.fullName} email={profile.email} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Saved Properties" value={totalSavedProperties} icon={<Heart className="h-5 w-5" />} index={0} />
        <StatCard label="My Enquiries" value={totalEnquiries} icon={<MessageSquare className="h-5 w-5" />} index={1} tone="gold" />
        <StatCard label="Pending Enquiries" value={pendingEnquiries} icon={<Clock className="h-5 w-5" />} index={2} tone="dark" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PropertyList
          title="My Saved Properties"
          items={savedProperties}
          emptyMessage="You haven&rsquo;t saved any properties yet. Browse the catalogue to get started."
          viewAll={{ to: '/properties', label: 'Browse properties' }}
        />
        <EnquiryList
          title="My Recent Enquiries"
          items={recentEnquiries}
          emptyMessage="You haven&rsquo;t made any enquiries yet. Reach out to an agent to learn more."
        />
      </div>
    </div>
  );
}
