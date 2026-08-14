import { Building2, Users, MessageSquare, Newspaper, UserCircle, Settings, Heart } from 'lucide-react';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { useAuth } from '../../contexts/AuthContext';
import { primaryRole } from '../../utils/roles';
import { PropertiesSection } from '../../components/dashboard/sections/PropertiesSection';
import { AgentsSection } from '../../components/dashboard/sections/AgentsSection';
import { EnquiriesSection } from '../../components/dashboard/sections/EnquiriesSection';
import { MyEnquiriesSection } from '../../components/dashboard/sections/MyEnquiriesSection';
import { BlogSection } from '../../components/dashboard/sections/BlogSection';
import { UsersSection } from '../../components/dashboard/sections/UsersSection';
import { SettingsSection } from '../../components/dashboard/sections/SettingsSection';
import { SavedSection } from '../../components/dashboard/sections/SavedSection';

export type DashboardSection = 'properties' | 'agents' | 'enquiries' | 'blog' | 'users' | 'settings' | 'saved' | 'my-enquiries';

const config: Record<DashboardSection, { title: string; description: string }> = {
  properties: { title: 'Properties', description: 'Manage all listings on the PIPDC portal.' },
  agents: { title: 'Agents', description: 'Manage verified PIPDC agents.' },
  enquiries: { title: 'Enquiries', description: 'Review and respond to client enquiries.' },
  blog: { title: 'Blog', description: 'Publish insights and market updates.' },
  users: { title: 'Users', description: 'Manage user accounts and roles.' },
  settings: { title: 'Settings', description: 'Manage your profile and account.' },
  saved: { title: 'Saved Properties', description: 'Properties you have saved for later.' },
  'my-enquiries': { title: 'My Enquiries', description: 'Enquiries you have submitted to agents.' },
};

const agentDescriptions: Partial<Record<DashboardSection, string>> = {
  properties: 'Manage your listings on the PIPDC portal.',
  enquiries: 'Review and respond to enquiries on your properties.',
};

const sectionIcons: Record<DashboardSection, React.ReactNode> = {
  properties: <Building2 className="h-5 w-5" />,
  agents: <Users className="h-5 w-5" />,
  enquiries: <MessageSquare className="h-5 w-5" />,
  blog: <Newspaper className="h-5 w-5" />,
  users: <UserCircle className="h-5 w-5" />,
  settings: <Settings className="h-5 w-5" />,
  saved: <Heart className="h-5 w-5" />,
  'my-enquiries': <MessageSquare className="h-5 w-5" />,
};

export function DashboardSectionPage({ section }: { section: DashboardSection }) {
  const c = config[section];
  const { user } = useAuth();
  const role = primaryRole(user?.roles);

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: c.title }]} />
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-50 text-forest-600">{sectionIcons[section]}</span>
        <div>
          <h1 className="heading-3">{c.title}</h1>
          <p className="mt-1 text-sm text-ink-500">{role === 'Agent' ? (agentDescriptions[section] ?? c.description) : c.description}</p>
        </div>
      </div>

      {section === 'properties' && <PropertiesSection />}
      {section === 'agents' && <AgentsSection />}
      {section === 'enquiries' && <EnquiriesSection title={role === 'Agent' ? 'My Enquiries' : 'All Enquiries'} />}
      {section === 'my-enquiries' && <MyEnquiriesSection />}
      {section === 'blog' && <BlogSection />}
      {section === 'users' && <UsersSection />}
      {section === 'settings' && <SettingsSection />}
      {section === 'saved' && <SavedSection />}
    </div>
  );
}
