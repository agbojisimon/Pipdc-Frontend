import { motion } from 'framer-motion';
import { useCountUp } from '../../hooks/useCountUp';

const stats = [
  { value: 1200, suffix: '+', label: 'Verified Listings' },
  { value: 320, suffix: '+', label: 'Trusted Agents' },
  { value: 15000, suffix: '+', label: 'Happy Clients' },
  { value: 25, suffix: '', label: 'Years of Service' },
];

export function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-16 text-white">
      <div className="absolute inset-0 bg-grid opacity-[0.05]" aria-hidden="true" />
      <div className="container-x relative">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, idx) => (
            <StatCard key={s.label} {...s} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, suffix, label, index }: { value: number; suffix: string; label: string; index: number }) {
  const count = useCountUp(value, 1800, true);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm"
    >
      <p className="font-display text-4xl font-bold text-gold-400">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="mt-2 text-sm text-white/70">{label}</p>
    </motion.div>
  );
}
