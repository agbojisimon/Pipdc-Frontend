import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/brand/Logo';

export function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-ink-50">
      <div className="absolute inset-0 bg-grid opacity-[0.04]" aria-hidden="true" />
      <header className="relative px-6 py-8">
        <Logo />
      </header>
      <main className="relative flex flex-1 items-center justify-center px-6">
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-[120px] font-bold leading-none text-forest-500 sm:text-[180px]"
          >
            404
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-2 font-display text-2xl font-bold text-ink-900 sm:text-3xl"
          >
            This page has moved or never existed
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mx-auto mt-3 max-w-md text-sm text-ink-500"
          >
            The page you were looking for may have been removed, renamed, or is temporarily unavailable.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link to="/">
              <Button variant="primary" size="lg" leftIcon={<Home className="h-4 w-4" />}>Back home</Button>
            </Link>
            <Link to="/properties">
              <Button variant="outline" size="lg" leftIcon={<Search className="h-4 w-4" />}>Browse properties</Button>
            </Link>
          </motion.div>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-forest-600 hover:text-forest-700">
            <ArrowLeft className="h-4 w-4" /> Contact support
          </Link>
        </div>
      </main>
    </div>
  );
}
