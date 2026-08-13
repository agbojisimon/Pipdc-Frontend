import { motion } from 'framer-motion';
import {
  Building2, Users, MessageSquare, UserCircle, ArrowUpRight, Plus, Search, Filter,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '../../components/dashboard/StatCard';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useCountUp } from '../../hooks/useCountUp';
import { mockDashboardStats, mockActivity, mockProperties, mockEnquiries } from '../../services/mockData';
import { getMockAgent } from '../../services/agentService';
import { formatPrice, timeAgo } from '../../utils/format';
import { cn } from '../../utils/cn';

const chartBars = [42, 58, 35, 70, 48, 82, 65, 90, 55, 78, 88, 95];

export function DashboardPage() {
  const stats = mockDashboardStats;
  const c1 = useCountUp(stats.totalProperties, 1400, true);
  const c2 = useCountUp(stats.totalAgents, 1400, true);
  const c3 = useCountUp(stats.totalEnquiries, 1400, true);
  const c4 = useCountUp(stats.totalUsers, 1400, true);

  const recentProperties = mockProperties.slice(0, 5);
  const recentEnquiries = mockEnquiries.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Dashboard</h1>
          <p className="mt-1 text-sm text-ink-500">Welcome back. Here&rsquo;s what&rsquo;s happening at PIPDC today.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="md" leftIcon={<Filter className="h-4 w-4" />}>Filter</Button>
          <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />}>Add Property</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Properties" value={c1} icon={<Building2 className="h-5 w-5" />} trend={12} index={0} tone="forest" />
        <StatCard label="Total Agents" value={c2} icon={<Users className="h-5 w-5" />} trend={4} index={1} tone="gold" />
        <StatCard label="Total Enquiries" value={c3} icon={<MessageSquare className="h-5 w-5" />} trend={-2} index={2} tone="dark" />
        <StatCard label="Total Users" value={c4} icon={<UserCircle className="h-5 w-5" />} trend={8} index={3} tone="info" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart placeholder */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
            <div>
              <h2 className="font-display text-base font-semibold text-ink-900">Enquiries Overview</h2>
              <p className="text-xs text-ink-500">Last 12 months</p>
            </div>
            <Badge tone="forest">+18% YoY</Badge>
          </div>
          <div className="p-6">
            <div className="flex h-56 items-end gap-2">
              {chartBars.map((h, i) => (
                <div key={i} className="group flex flex-1 flex-col items-center gap-2">
                  <div className="relative w-full overflow-hidden rounded-t-lg bg-ink-100" style={{ height: '100%' }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.8, delay: i * 0.04, ease: 'easeOut' }}
                      className={cn(
                        'absolute bottom-0 w-full rounded-t-lg bg-forest-gradient',
                        i === chartBars.length - 1 && 'bg-gold-gradient',
                      )}
                    />
                  </div>
                  <span className="text-[10px] text-ink-400">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recent activity */}
        <Card>
          <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
            <h2 className="font-display text-base font-semibold text-ink-900">Recent Activity</h2>
            <Link to="/dashboard/enquiries" className="text-xs font-medium text-forest-600 hover:text-forest-700">View all</Link>
          </div>
          <ul className="divide-y divide-ink-100">
            {mockActivity.map((a) => (
              <li key={a.id} className="flex items-start gap-3 px-6 py-4">
                <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-forest-50 text-xs font-semibold text-forest-700">
                  {a.actor.charAt(0)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-800">{a.message}</p>
                  <p className="text-xs text-ink-400">{a.actor} · {timeAgo(a.timestamp)}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Recent properties table */}
      <Card>
        <div className="flex flex-col gap-3 border-b border-ink-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-ink-900">Recent Properties</h2>
            <p className="text-xs text-ink-500">Latest listings added to the portal</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                placeholder="Search…"
                className="h-9 w-56 rounded-lg border border-ink-200 bg-ink-50 pl-9 pr-3 text-sm focus:border-forest-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/30"
              />
            </div>
            <Link to="/dashboard/properties">
              <Button variant="ghost" size="md" rightIcon={<ArrowUpRight className="h-4 w-4" />}>View all</Button>
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wider text-ink-400">
                <th className="px-6 py-3 font-medium">Property</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Agent</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {recentProperties.map((p) => {
                const agent = getMockAgent(p.agentId);
                return (
                  <tr key={p.id} className="transition-colors hover:bg-ink-50">
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
                      <Badge tone={p.status === 'For Sale' ? 'forest' : p.status === 'For Lease' ? 'gold' : 'neutral'}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-ink-600">{agent?.name ?? '—'}</td>
                    <td className="px-6 py-3 font-semibold text-ink-900">{formatPrice(p.price, p.currency)}</td>
                    <td className="px-6 py-3 text-right">
                      <Link to={`/properties/${p.slug}`} className="font-medium text-forest-600 hover:text-forest-700">View</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent enquiries */}
      <Card>
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <h2 className="font-display text-base font-semibold text-ink-900">Recent Enquiries</h2>
          <Link to="/dashboard/enquiries" className="text-xs font-medium text-forest-600 hover:text-forest-700">View all</Link>
        </div>
        <ul className="divide-y divide-ink-100">
          {recentEnquiries.map((e) => (
            <li key={e.id} className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-ink-900">{e.name}</p>
                <p className="text-xs text-ink-500">{e.email} · {e.phone}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="hidden max-w-xs truncate text-sm text-ink-500 md:block">{e.message}</p>
                <Badge
                  tone={e.status === 'New' ? 'forest' : e.status === 'In Review' ? 'gold' : e.status === 'Responded' ? 'info' : 'neutral'}
                >
                  {e.status}
                </Badge>
                <span className="text-xs text-ink-400">{timeAgo(e.createdAt)}</span>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
