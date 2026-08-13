import { Link } from 'react-router-dom';
import { Building2, Users, MessageSquare, Newspaper, UserCircle, Settings, Plus, ArrowUpRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { EmptyState } from '../../components/ui/EmptyState';
import { mockProperties, mockAgents, mockEnquiries, mockBlogPosts, mockUsers } from '../../services/mockData';
import { getMockAgent } from '../../services/agentService';
import { formatPrice, formatDate, timeAgo } from '../../utils/format';

type Section = 'properties' | 'agents' | 'enquiries' | 'blog' | 'users' | 'settings';

const config: Record<Section, { title: string; description: string; cta: string }> = {
  properties: { title: 'Properties', description: 'Manage all listings on the PIPDC portal.', cta: 'Add Property' },
  agents: { title: 'Agents', description: 'Manage verified PIPDC agents.', cta: 'Add Agent' },
  enquiries: { title: 'Enquiries', description: 'Review and respond to client enquiries.', cta: 'Export' },
  blog: { title: 'Blog', description: 'Publish insights and market updates.', cta: 'New Post' },
  users: { title: 'Users', description: 'Manage user accounts and roles.', cta: 'Invite User' },
  settings: { title: 'Settings', description: 'Configure portal preferences.', cta: 'Save Changes' },
};

export function DashboardSectionPage({ section }: { section: Section }) {
  const c = config[section];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: c.title }]} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">{c.title}</h1>
          <p className="mt-1 text-sm text-ink-500">{c.description}</p>
        </div>
        <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />}>{c.cta}</Button>
      </div>

      {section === 'properties' && <PropertiesTable />}
      {section === 'agents' && <AgentsTable />}
      {section === 'enquiries' && <EnquiriesTable />}
      {section === 'blog' && <BlogTable />}
      {section === 'users' && <UsersTable />}
      {section === 'settings' && <SettingsPanel />}
    </div>
  );
}

function PropertiesTable() {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wider text-ink-400">
              <th className="px-6 py-3 font-medium">Property</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Price</th>
              <th className="px-6 py-3 font-medium">Created</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {mockProperties.map((p) => (
              <tr key={p.id} className="hover:bg-ink-50">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt="" className="h-10 w-14 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink-900">{p.title}</p>
                      <p className="truncate text-xs text-ink-400">{p.area}, {p.city}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 text-ink-600">{p.type}</td>
                <td className="px-6 py-3">
                  <Badge tone={p.status === 'For Sale' ? 'forest' : p.status === 'For Lease' ? 'gold' : 'neutral'}>{p.status}</Badge>
                </td>
                <td className="px-6 py-3 font-semibold text-ink-900">{formatPrice(p.price, p.currency)}</td>
                <td className="px-6 py-3 text-ink-500">{formatDate(p.createdAt)}</td>
                <td className="px-6 py-3 text-right">
                  <Link to={`/properties/${p.slug}`} className="font-medium text-forest-600 hover:text-forest-700">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function AgentsTable() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {mockAgents.map((a) => (
        <Card key={a.id} className="p-5">
          <div className="flex items-center gap-3">
            <img src={a.photo} alt={a.name} className="h-12 w-12 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="truncate font-semibold text-ink-900">{a.name}</p>
              <p className="truncate text-xs text-ink-500">{a.title}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-ink-500">
            <span>{a.listings} listings</span>
            <span>{a.reviews} reviews</span>
            <Badge tone="forest">{a.rating.toFixed(1)} ★</Badge>
          </div>
          <Link to={`/agents/${a.id}`} className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-ink-100 px-3 py-2 text-xs font-semibold text-ink-800 hover:bg-forest-500 hover:text-white">
            View Profile <ArrowUpRight className="h-3 w-3" />
          </Link>
        </Card>
      ))}
    </div>
  );
}

function EnquiriesTable() {
  return (
    <Card>
      <ul className="divide-y divide-ink-100">
        {mockEnquiries.map((e) => (
          <li key={e.id} className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink-900">{e.name}</p>
              <p className="text-xs text-ink-500">{e.email} · {e.phone}</p>
              <p className="mt-1 truncate text-sm text-ink-600">{e.message}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone={e.status === 'New' ? 'forest' : e.status === 'In Review' ? 'gold' : e.status === 'Responded' ? 'info' : 'neutral'}>
                {e.status}
              </Badge>
              <span className="text-xs text-ink-400">{timeAgo(e.createdAt)}</span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function BlogTable() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {mockBlogPosts.map((post) => (
        <Card key={post.id} className="flex gap-4 p-4">
          <img src={post.cover} alt="" className="h-20 w-28 rounded-xl object-cover" />
          <div className="flex-1 min-w-0">
            <Badge tone="forest">{post.category}</Badge>
            <h3 className="mt-2 truncate font-display text-base font-semibold text-ink-900">{post.title}</h3>
            <p className="mt-1 text-xs text-ink-500">By {post.author} · {formatDate(post.publishedAt)} · {post.readMinutes} min</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

function UsersTable() {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wider text-ink-400">
              <th className="px-6 py-3 font-medium">User</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {mockUsers.map((u) => (
              <tr key={u.id} className="hover:bg-ink-50">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-gradient text-xs font-semibold text-white">
                      {u.name.charAt(0)}
                    </span>
                    <div>
                      <p className="font-medium text-ink-900">{u.name}</p>
                      <p className="text-xs text-ink-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <Badge tone={u.role === 'Admin' ? 'forest' : u.role === 'Agent' ? 'gold' : 'neutral'}>{u.role}</Badge>
                </td>
                <td className="px-6 py-3">
                  <Badge tone={u.status === 'Active' ? 'success' : 'danger'}>{u.status}</Badge>
                </td>
                <td className="px-6 py-3 text-ink-500">{formatDate(u.joinedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function SettingsPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="p-6">
        <h3 className="font-display text-base font-semibold text-ink-900">Profile</h3>
        <div className="mt-4 space-y-3">
          <Field label="Display name" value="Admin User" />
          <Field label="Email" value="admin@pipdc.gov.ng" />
          <Field label="Phone" value="+234 803 555 0100" />
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="font-display text-base font-semibold text-ink-900">Preferences</h3>
        <div className="mt-4 space-y-3">
          <Field label="Default currency" value="NGN (₦)" />
          <Field label="Language" value="English" />
          <Field label="Timezone" value="WAT (UTC+1)" />
        </div>
      </Card>
      <Card className="p-6 lg:col-span-2">
        <EmptyState
          icon={<Settings className="h-5 w-5" />}
          title="More settings coming soon"
          description="Notifications, integrations and team permissions will appear here."
        />
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-ink-100 bg-ink-50 px-4 py-3">
      <span className="text-sm text-ink-500">{label}</span>
      <span className="text-sm font-semibold text-ink-900">{value}</span>
    </div>
  );
}

// silence unused
void Building2; void Users; void MessageSquare; void Newspaper; void UserCircle; void Settings;
