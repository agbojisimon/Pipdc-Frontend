import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldX, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/brand/Logo';

export function ForbiddenPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-ink-50">
      <div className="absolute inset-0 bg-grid opacity-[0.04]" aria-hidden="true" />
      <header className="relative px-6 py-8">
        <Logo />
      </header>
      <main className="relative flex flex-1 items-center justify-center px-6">
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-50 text-gold-500"
          >
            <ShieldX className="h-8 w-8" />
          </motion.span>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-6 font-display text-[96px] font-bold leading-none text-forest-500 sm:text-[120px]"
          >
            403
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-2 font-display text-2xl font-bold text-ink-900 sm:text-3xl"
          >
            Access denied
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mx-auto mt-3 max-w-md text-sm text-ink-500"
          >
            You do not have permission to view this page. This area is restricted to PIPDC administrators.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link to="/dashboard">
              <Button variant="primary" size="lg" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back to dashboard
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg">Back home</Button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
