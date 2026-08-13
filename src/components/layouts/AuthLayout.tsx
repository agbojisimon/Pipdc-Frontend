import { Outlet, Link } from 'react-router-dom';
import { Logo } from '../brand/Logo';
import { ShieldCheck } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-forest-gradient lg:block">
        <div className="absolute inset-0 bg-grid opacity-[0.08]" aria-hidden="true" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Logo variant="light" />
          <div className="max-w-md">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-gold-400" /> Government Verified
            </span>
            <h2 className="mt-6 font-display text-4xl font-bold leading-tight">
              The trusted home of Plateau State property.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              Sign in to manage listings, track enquiries and connect with verified buyers, sellers and investors
              across the Plateau.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { value: '1.2K+', label: 'Verified Listings' },
                { value: '320+', label: 'Trusted Agents' },
                { value: '15K+', label: 'Happy Clients' },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-display text-2xl font-bold text-gold-400">{s.value}</p>
                  <p className="mt-1 text-xs text-white/70">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-white/60">&copy; {new Date().getFullYear()} PIPDC. All rights reserved.</p>
        </div>
      </div>
      <div className="flex flex-col bg-white">
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Logo />
          <Link to="/" className="text-sm font-medium text-ink-600 hover:text-forest-600">
            Back to site
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
