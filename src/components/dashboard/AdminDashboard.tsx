import { Link } from 'react-router-dom';
import { Building2, Users, MessageSquare, UserCircle, Layers, FileText, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { StatCard } from './StatCard';
import { PropertyList } from './PropertyList';
import { EnquiryList } from './EnquiryList';
import type { AdminDashboard as AdminDashboardData } from '../../types';

export function AdminDashboard({ data }: { data: AdminDashboardData }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="heading-3">Dashboard</h1>
          <p className="mt-1 text-sm text-ink-500">Welcome back. Here&rsquo;s what&rsquo;s happening at PIPDC today.</p>
        </div>
        <Link to="/dashboard/properties?new=1">
          <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />}>
            Add Property
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Properties" value={data.totalProperties} icon={<Building2 className="h-5 w-5" />} index={0} />
        <StatCard label="Total Agents" value={data.totalAgents} icon={<Users className="h-5 w-5" />} index={1} tone="gold" />
        <StatCard label="Total Enquiries" value={data.totalEnquiries} icon={<MessageSquare className="h-5 w-5" />} index={2} tone="dark" />
        <StatCard label="Total Users" value={data.totalUsers} icon={<UserCircle className="h-5 w-5" />} index={3} tone="info" />
        <StatCard label="Development Projects" value={data.totalDevelopmentProjects} icon={<Layers className="h-5 w-5" />} index={4} tone="forest" />
        <StatCard label="Blog Posts" value={data.totalBlogPosts} icon={<FileText className="h-5 w-5" />} index={5} tone="gold" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PropertyList
          title="Recent Properties"
          items={data.recentProperties}
          emptyMessage="No properties yet. Listings will appear here once added."
          viewAll={{ to: '/dashboard/properties', label: 'View all' }}
        />
        <EnquiryList
          title="Recent Enquiries"
          items={data.recentEnquiries}
          emptyMessage="No enquiries yet."
          showUnread
          viewAll={{ to: '/dashboard/enquiries', label: 'View all' }}
        />
      </div>
    </div>
  );
}
