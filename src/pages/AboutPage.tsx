import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Eye, Heart, ShieldCheck, Users, Landmark, Award, ArrowRight } from 'lucide-react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CTASection } from './home/CTASection';

const values = [
  { icon: ShieldCheck, title: 'Integrity', description: 'We hold every transaction to the highest standard of transparency.' },
  { icon: Users, title: 'Service', description: 'Citizens and investors come first, always.' },
  { icon: Award, title: 'Excellence', description: 'We pursue quality in every listing, agent and interaction.' },
  { icon: Heart, title: 'Community', description: 'We build wealth that stays on the Plateau.' },
];

const timeline = [
  { year: '2001', title: 'PIPDC established', description: 'Founded by the Plateau State Government to formalise property investment.' },
  { year: '2009', title: 'Verified listings programme', description: 'Introduced mandatory documentation checks for every listing.' },
  { year: '2017', title: 'Digital property portal', description: 'Launched the first online portal for Plateau State property.' },
  { year: '2026', title: 'Next-generation platform', description: 'A modern, mobile-first experience for buyers, sellers and agents.' },
];

export function AboutPage() {
  return (
    <div className="bg-white">
      <div className="container-x pt-28 pb-10 lg:pt-36">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />
        <SectionHeading
          align="left"
          eyebrow="About PIPDC"
          title="The official property company of Plateau State"
          description="We exist to make property transactions on the Plateau safe, transparent and rewarding for every citizen and investor."
        />
      </div>

      {/* Hero band */}
      <section className="relative overflow-hidden">
        <div className="container-x">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-forest-gradient px-6 py-14 text-white shadow-lift sm:px-12 lg:py-20"
          >
            <div className="absolute inset-0 bg-grid opacity-[0.08]" />
            <div className="relative grid gap-8 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                  <Landmark className="h-4 w-4 text-gold-400" /> Government Backed
                </span>
                <h2 className="mt-5 font-display text-3xl font-bold sm:text-4xl text-balance">
                  Building a property market that works for every Plateau citizen.
                </h2>
                <p className="mt-4 max-w-xl text-white/85">
                  PIPDC is the property investment and development company of Plateau State. We verify listings,
                  license agents and provide the infrastructure for secure property transactions across the state.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/contact">
                    <Button variant="gold" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>Get in touch</Button>
                  </Link>
                  <Link to="/properties">
                    <Button variant="outline" size="lg" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">Browse properties</Button>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '1.2K+', label: 'Verified Listings' },
                  { value: '320+', label: 'Trusted Agents' },
                  { value: '15K+', label: 'Happy Clients' },
                  { value: '25', label: 'Years of Service' },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
                    <p className="font-display text-3xl font-bold text-gold-400">{s.value}</p>
                    <p className="mt-1 text-xs text-white/70">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="section-pad">
        <div className="container-x grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-ink-100 bg-white p-8 shadow-soft"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-50 text-forest-600">
              <Target className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-display text-xl font-semibold text-ink-900">Our Mission</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              To create a transparent, secure and efficient property market in Plateau State — one where every
              transaction is documented, every agent is accountable and every citizen can participate with confidence.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-ink-100 bg-white p-8 shadow-soft"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50 text-gold-700">
              <Eye className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-display text-xl font-semibold text-ink-900">Our Vision</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              To be the most trusted property institution in Northern Nigeria — a reference point for verified
              listings, professional agents and secure, government-backed transactions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad bg-ink-50">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our Values"
            title="What we stand for"
            description="The principles that guide every decision at PIPDC."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, idx) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="rounded-2xl border border-ink-100 bg-white p-6 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-gradient text-white shadow-soft">
                  <v.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-base font-semibold text-ink-900">{v.title}</h3>
                <p className="mt-2 text-sm text-ink-500">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-pad">
        <div className="container-x">
          <SectionHeading eyebrow="Our Journey" title="Two decades of trusted service" />
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {timeline.map((t, idx) => (
              <motion.li
                key={t.year}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="relative rounded-2xl border border-ink-100 bg-white p-6 shadow-soft"
              >
                <Badge tone="gold">{t.year}</Badge>
                <h3 className="mt-3 font-display text-base font-semibold text-ink-900">{t.title}</h3>
                <p className="mt-2 text-sm text-ink-500">{t.description}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <CTASection
        title="Partner with PIPDC"
        description="Whether you are buying, selling, leasing or investing, our team is ready to help."
        buttonLabel="Contact Us"
        to="/contact"
      />
    </div>
  );
}
