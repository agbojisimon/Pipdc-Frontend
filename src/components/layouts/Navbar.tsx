import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Building2, MessagesSquare } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useScrollLock } from '../../hooks/useScrollLock';
import { cn } from '../../utils/cn';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Properties', to: '/properties' },
  { label: 'Agents', to: '/agents' },
  { label: 'Insights', to: '/blog' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, isRestoring, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useScrollLock(open);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'glass shadow-soft' : 'bg-transparent lg:bg-white/45 lg:backdrop-blur-md',
      )}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-20">
        <Logo variant={scrolled ? 'default' : 'default'} />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                  isActive ? 'text-forest-600' : 'text-ink-700 hover:text-forest-600',
                )
              }
            >
              {({ isActive }) => (
                <span className="relative">
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute -bottom-1.5 left-0 right-0 mx-auto h-0.5 w-6 rounded-full bg-forest-500"
                    />
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {isRestoring ? (
            <div className="h-10 w-28 animate-pulse rounded-xl bg-ink-100" />
          ) : isAuthenticated ? (
            <>
              <Link to="/dashboard/messages">
                <Button variant="outline" size="lg" leftIcon={<MessagesSquare className="h-4 w-4" />}>
                  Messages
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" leftIcon={<Building2 className="h-4 w-4" />}>
                  Dashboard
                </Button>
              </Link>
              <Button variant="primary" size="lg" onClick={signOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="lg">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="gold" size="lg">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-ink-200 bg-white/70 text-ink-800 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass mx-4 mb-4 rounded-2xl border border-white/40 p-3 shadow-soft lg:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive ? 'bg-forest-50 text-forest-700' : 'text-ink-700 hover:bg-ink-100',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-ink-100 pt-3">
                {isRestoring ? (
                  <div className="h-11 animate-pulse rounded-xl bg-ink-100" />
                ) : isAuthenticated ? (
                  <>
                    <Link to="/dashboard/messages" className="inline-flex">
                      <Button variant="outline" size="lg" className="w-full" leftIcon={<MessagesSquare className="h-4 w-4" />}>
                        Messages
                      </Button>
                    </Link>
                    <Link to="/dashboard" className="inline-flex">
                      <Button variant="outline" size="lg" className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="primary" size="lg" className="w-full" onClick={signOut}>
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="inline-flex">
                      <Button variant="outline" size="lg" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" className="inline-flex">
                      <Button variant="gold" size="lg" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
