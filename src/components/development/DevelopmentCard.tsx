import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowUpRight, HardHat } from 'lucide-react';
import type { DevelopmentProject } from '../../types/development';
import { Badge } from '../ui/Badge';
import { developmentStatusTone, developmentStatusLabel } from '../../utils/developmentStatus';

interface DevelopmentCardProps {
  project: DevelopmentProject;
  index?: number;
}

export function DevelopmentCard({ project, index = 0 }: DevelopmentCardProps) {
  const coverImage = project.images.find((img) => img.isCover)?.url ?? project.images[0]?.url;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={project.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-ink-100">
            <HardHat className="h-12 w-12 text-ink-300" />
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <Badge tone={developmentStatusTone(project.status)} className="backdrop-blur-sm">
            {developmentStatusLabel(project.status)}
          </Badge>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/70 to-transparent p-3 pt-10">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-white/90">
            <MapPin className="h-3 w-3" /> {project.location}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink-900 line-clamp-2">
          {project.name}
        </h3>
        {project.developer && (
          <p className="mt-1 text-sm text-ink-500">{project.developer}</p>
        )}

        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-ink-500">
            <span>Progress</span>
            <span className="font-semibold text-ink-700">{project.progressPercentage}%</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink-100">
            <div
              className="h-full rounded-full bg-forest-500 transition-all"
              style={{ width: `${project.progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-ink-100 pt-4 text-sm">
          <div className="text-center">
            <p className="text-lg font-bold text-ink-900">{project.unitCount}</p>
            <p className="text-xs text-ink-400">Units</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-ink-900">{project.updateCount}</p>
            <p className="text-xs text-ink-400">Updates</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end">
          <Link
            to={`/developments/${project.slug}`}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-ink-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-forest-600"
          >
            View Details <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
