import { Link } from 'react-router-dom';
import { ArrowRight, HardHat } from 'lucide-react';
import { useFeaturedDevelopmentProjects } from '../../hooks/queries';
import { DevelopmentCard } from '../../components/development/DevelopmentCard';
import { SectionHeading } from '../../components/ui/SectionHeading';

export function FeaturedDevelopmentsSection() {
  const result = useFeaturedDevelopmentProjects();
  const projects = result.data?.items ?? [];

  if (result.isLoading || projects.length === 0) return null;

  return (
    <section className="py-20">
      <div className="container-x">
        <SectionHeading
          eyebrow="Developments"
          title="Ongoing Projects"
          description="Explore our portfolio of development projects across Plateau State."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((p, idx) => (
            <DevelopmentCard key={p.id} project={p} index={idx} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/developments"
            className="inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-6 py-3 text-sm font-semibold text-ink-700 transition-colors hover:border-forest-500 hover:text-forest-600"
          >
            <HardHat className="h-4 w-4" />
            View All Projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
