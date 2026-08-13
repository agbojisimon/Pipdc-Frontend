import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface CTASectionProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
  to?: string;
}

export function CTASection({
  title = 'Ready to Find Your Next Property?',
  description = 'Browse verified listings across Plateau State or speak with a PIPDC advisor today.',
  buttonLabel = 'Browse Properties',
  to = '/properties',
}: CTASectionProps) {
  return (
    <section className="section-pad">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-forest-gradient px-6 py-14 text-center text-white shadow-lift sm:px-12 lg:py-20"
        >
          <div className="absolute inset-0 bg-grid opacity-[0.08]" aria-hidden="true" />
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-400/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-forest-300/20 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-balance">{title}</h2>
            <p className="mt-4 text-base text-white/85 sm:text-lg">{description}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to={to}>
                <Button variant="gold" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  {buttonLabel}
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white" leftIcon={<Phone className="h-4 w-4" />}>
                  Talk to an Advisor
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
