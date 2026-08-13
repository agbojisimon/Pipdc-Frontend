import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star, BadgeCheck, Phone, Mail, MapPin, Languages, Briefcase, ArrowLeft, Building2,
} from 'lucide-react';
import { mockAgents, mockProperties } from '../services/mockData';
import { useFavourites } from '../hooks/useFavourites';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PropertyCard } from '../components/property/PropertyCard';
import { EmptyState } from '../components/ui/EmptyState';
import { getMockAgent } from '../services/agentService';

export function AgentProfilePage() {
  const { id } = useParams();
  const agent = useMemo(() => (id ? getMockAgent(id) : undefined), [id]);
  const { isFavourite, toggle } = useFavourites();

  if (!agent) {
    return (
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center pt-28 text-center">
        <h1 className="heading-3">Agent not found</h1>
        <Link to="/agents" className="mt-6">
          <Button variant="primary" leftIcon={<ArrowLeft className="h-4 w-4" />}>Back to agents</Button>
        </Link>
      </div>
    );
  }

  const listings = mockProperties.filter((p) => p.agentId === agent.id);

  return (
    <div className="bg-ink-50 pb-20 pt-28 lg:pt-36">
      <div className="container-x">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Agents', to: '/agents' }, { label: agent.name }]} />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft"
        >
          <div className="relative h-32 bg-forest-gradient sm:h-40">
            <div className="absolute inset-0 bg-grid opacity-[0.08]" />
          </div>
          <div className="px-6 pb-6 sm:px-8">
            <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <img
                  src={agent.photo}
                  alt={agent.name}
                  className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-soft sm:h-28 sm:w-28"
                />
                <div className="pb-2">
                  <div className="flex items-center gap-2">
                    <h1 className="font-display text-2xl font-bold text-ink-900">{agent.name}</h1>
                    {agent.verified && <BadgeCheck className="h-5 w-5 text-forest-500" />}
                  </div>
                  <p className="text-sm text-ink-500">{agent.title}</p>
                  <div className="mt-1 flex items-center gap-1 text-sm text-ink-600">
                    <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
                    <span className="font-semibold">{agent.rating.toFixed(1)}</span>
                    <span className="text-ink-400">· {agent.reviews} reviews · {agent.listings} listings</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <a href={`tel:${agent.phone}`}>
                  <Button variant="primary" size="md" leftIcon={<Phone className="h-4 w-4" />}>Call</Button>
                </a>
                <a href={`mailto:${agent.email}`}>
                  <Button variant="outline" size="md" leftIcon={<Mail className="h-4 w-4" />}>Email</Button>
                </a>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <h2 className="font-display text-lg font-semibold text-ink-900">About {agent.name.split(' ')[0]}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{agent.bio}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Experience" value={`${agent.experienceYears} years`} />
                  <InfoRow icon={<MapPin className="h-4 w-4" />} label="Based in" value="Jos, Plateau State" />
                  <InfoRow icon={<Languages className="h-4 w-4" />} label="Languages" value={agent.languages.join(', ')} />
                  <InfoRow icon={<Building2 className="h-4 w-4" />} label="Agency" value={agent.agency} />
                </div>

                <div className="mt-6">
                  <h3 className="font-display text-sm font-semibold text-ink-900">Specializations</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {agent.specializations.map((s) => (
                      <Badge key={s} tone="forest">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <aside className="rounded-2xl border border-ink-100 bg-ink-50 p-5">
                <h3 className="font-display text-sm font-semibold text-ink-900">Contact details</h3>
                <ul className="mt-3 space-y-3 text-sm">
                  <li className="flex items-center gap-2 text-ink-700">
                    <Phone className="h-4 w-4 text-forest-500" /> {agent.phone}
                  </li>
                  <li className="flex items-center gap-2 text-ink-700">
                    <Mail className="h-4 w-4 text-forest-500" /> {agent.email}
                  </li>
                </ul>
                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  <Mini value={agent.listings} label="Listings" />
                  <Mini value={agent.reviews} label="Reviews" />
                  <Mini value={agent.rating.toFixed(1)} label="Rating" />
                </div>
              </aside>
            </div>
          </div>
        </motion.div>

        <section className="mt-12">
          <h2 className="heading-3">Active listings by {agent.name.split(' ')[0]}</h2>
          {listings.length === 0 ? (
            <div className="mt-6">
              <EmptyState title="No active listings" description="This agent currently has no live properties." />
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((p, idx) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  index={idx}
                  agentName={getMockAgent(p.agentId)?.name}
                  isFavourite={isFavourite(p.id)}
                  onToggleFavourite={toggle}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-ink-100 bg-ink-50 p-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-forest-600 shadow-soft">{icon}</span>
      <div>
        <p className="text-xs text-ink-400">{label}</p>
        <p className="text-sm font-semibold text-ink-800">{value}</p>
      </div>
    </div>
  );
}

function Mini({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-xl bg-white p-3 shadow-soft">
      <p className="font-display text-lg font-bold text-forest-600">{value}</p>
      <p className="text-[11px] text-ink-500">{label}</p>
    </div>
  );
}
