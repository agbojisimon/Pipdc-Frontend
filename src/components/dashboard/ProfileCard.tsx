import { BadgeCheck, Phone } from 'lucide-react';
import { Card } from '../ui/Card';

interface ProfileDetail {
  label: string;
  value: string | null;
}

interface ProfileCardProps {
  name: string;
  email: string;
  avatarUrl?: string | null;
  subtitle?: string | null;
  verified?: boolean;
  details?: ProfileDetail[];
}

export function ProfileCard({ name, email, avatarUrl, subtitle, verified, details }: ProfileCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-4 p-5">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="h-14 w-14 rounded-2xl object-cover" />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-gradient text-lg font-semibold text-white">
            {name.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-display text-lg font-semibold text-ink-900">{name}</p>
            {verified && (
              <BadgeCheck className="h-4 w-4 shrink-0 text-forest-500" aria-label="Verified" />
            )}
          </div>
          {subtitle && <p className="truncate text-sm text-ink-500">{subtitle}</p>}
          <p className="truncate text-xs text-ink-400">{email}</p>
        </div>
      </div>
      {details && details.length > 0 && (
        <div className="grid gap-3 border-t border-ink-100 bg-ink-50/60 px-5 py-4 sm:grid-cols-2">
          {details.map((d) => (
            <div key={d.label}>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">{d.label}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-ink-800">
                {d.label === 'Phone' && <Phone className="h-3.5 w-3.5 text-ink-400" />}
                {d.value || '—'}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
