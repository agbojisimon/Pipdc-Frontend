import { useMemo, useState } from 'react';
import { Search, Star, BadgeCheck } from 'lucide-react';
import { mockAgents } from '../services/mockData';
import { AgentCard } from '../components/agent/AgentCard';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Input } from '../components/ui/Input';

export function AgentsPage() {
  const [query, setQuery] = useState('');
  const [specialization, setSpecialization] = useState<string>('All');

  const specializations = useMemo(() => {
    const set = new Set<string>();
    mockAgents.forEach((a) => a.specializations.forEach((s) => set.add(s)));
    return ['All', ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    return mockAgents.filter((a) => {
      const matchesQuery =
        !query ||
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.title.toLowerCase().includes(query.toLowerCase());
      const matchesSpec = specialization === 'All' || a.specializations.includes(specialization);
      return matchesQuery && matchesSpec;
    });
  }, [query, specialization]);

  return (
    <div className="bg-ink-50 pb-20">
      <div className="container-x pt-28 pb-8 lg:pt-36">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Agents' }]} />
        <SectionHeading
          align="left"
          eyebrow="Our People"
          title="Meet PIPDC's verified agents"
          description="A team of vetted, accountable professionals ready to guide your next move."
        />

        <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
          <Input
            placeholder="Search agents by name or specialty"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            aria-label="Search agents"
          />
          <div className="flex flex-wrap gap-2">
            {specializations.map((s) => (
              <button
                key={s}
                onClick={() => setSpecialization(s)}
                className={
                  'rounded-xl border px-3 py-2 text-xs font-medium transition-colors ' +
                  (s === specialization
                    ? 'border-forest-500 bg-forest-500 text-white'
                    : 'border-ink-200 bg-white text-ink-700 hover:border-forest-500 hover:text-forest-600')
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-x">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((a, idx) => (
            <AgentCard key={a.id} agent={a} index={idx} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-12 text-center text-ink-500">
            No agents match your search.
          </div>
        )}
      </div>

      {/* Trust strip */}
      <div className="container-x mt-16">
        <div className="grid gap-4 rounded-2xl border border-ink-100 bg-white p-6 shadow-soft sm:grid-cols-3">
          {[
            { icon: BadgeCheck, label: 'Vetted & verified', value: 'Every agent is background-checked by PIPDC.' },
            { icon: Star, label: 'Top-rated service', value: 'Average client rating of 4.8/5 across the team.' },
            { icon: BadgeCheck, label: 'Accountable', value: 'Agents are bound by PIPDC\u2019s code of conduct.' },

          ].map((s) => (
            <div key={s.label} className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-50 text-forest-600">
                <s.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-sm font-semibold text-ink-900">{s.label}</p>
                <p className="mt-1 text-xs text-ink-500">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
