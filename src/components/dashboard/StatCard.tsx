import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: ReactNode;
  trend?: number;
  index?: number;
  tone?: 'forest' | 'gold' | 'dark' | 'info';
}

const tones = {
  forest: 'bg-forest-gradient text-white',
  gold: 'bg-gold-gradient text-ink-900',
  dark: 'bg-ink-900 text-white',
  info: 'bg-blue-50 text-blue-700',
};

export function StatCard({ label, value, prefix, suffix, icon, trend, index = 0, tone = 'forest' }: StatCardProps) {
  const positive = (trend ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-5 shadow-soft"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-ink-400">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-ink-900">
            {prefix}{value.toLocaleString()}{suffix}
          </p>
        </div>
        <span className={cn('flex h-11 w-11 items-center justify-center rounded-xl shadow-soft', tones[tone])}>
          {icon}
        </span>
      </div>
      {trend != null && (
        <div className="mt-4 flex items-center gap-1.5 text-xs">
          <span className={cn('inline-flex items-center gap-1 rounded-lg px-2 py-0.5 font-semibold', positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700')}>
            {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {Math.abs(trend)}%
          </span>
          <span className="text-ink-400">vs last month</span>
        </div>
      )}
    </motion.div>
  );
}
