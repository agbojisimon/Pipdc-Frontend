import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Calendar, Share2, ArrowLeft, ChevronLeft, ChevronRight,
  HardHat, AlertTriangle, Radar,
} from 'lucide-react';
import { useDevelopmentProject } from '../hooks/queries';
import { useTrackDevelopmentProject, useStopDevelopmentTracking } from '../hooks/mutations';
import { useAuth } from '../contexts/AuthContext';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { useToast } from '../components/ui/Toast';
import { formatDate } from '../utils/format';
import { cn } from '../utils/cn';
import {
  developmentStatusTone,
  developmentStatusLabel,
  unitStatusTone,
  unitStatusLabel,
} from '../utils/developmentStatus';
import { CardTable, thClass, tdClass } from '../components/dashboard/sections/shared';
import { useDevelopmentTracking } from '../hooks/queries';

export function DevelopmentDetailsPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { notify } = useToast();
  const [activeImage, setActiveImage] = useState(0);

  const projectQuery = useDevelopmentProject(slug);
  const project = projectQuery.data;

  const trackingQuery = useDevelopmentTracking();
  const trackedProject = trackingQuery.data?.items.find((t) => t.developmentProjectId === project?.id);

  const trackProject = useTrackDevelopmentProject();
  const stopTracking = useStopDevelopmentTracking();

  if (projectQuery.isLoading) {
    return (
      <div className="container-x flex min-h-[60vh] items-center justify-center pt-28">
        <Spinner className="h-12 w-12 text-forest-500" />
      </div>
    );
  }

  if (projectQuery.isError || !project) {
    return (
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center pt-28 text-center">
        <AlertTriangle className="h-10 w-10 text-gold-500" />
        <h1 className="mt-4 heading-3">Project not found</h1>
        <p className="mt-2 text-ink-500">The development project you are looking for may have been removed.</p>
        <Link to="/developments" className="mt-6">
          <Button variant="primary" size="lg" leftIcon={<ArrowLeft className="h-4 w-4" />}>Back to projects</Button>
        </Link>
      </div>
    );
  }

  const images = project.images ?? [];
  const sortedImages = [...images].sort((a, b) => a.displayOrder - b.displayOrder);
  const displayImages = sortedImages.map((img) => img.url);

  const handleTrack = async () => {
    if (!user) {
      notify({ type: 'info', title: 'Sign in required', description: 'Please sign in to track projects.' });
      return;
    }
    try {
      await trackProject.mutateAsync({ projectId: project.id });
      notify({ type: 'success', title: 'Project tracked', description: `You are now tracking "${project.name}".` });
    } catch {
      notify({ type: 'error', title: 'Could not track project', description: 'An error occurred.' });
    }
  };

  const handleStopTracking = async () => {
    try {
      await stopTracking.mutateAsync(project.id);
      notify({ type: 'success', title: 'Tracking stopped', description: `You are no longer tracking "${project.name}".` });
    } catch {
      notify({ type: 'error', title: 'Could not stop tracking', description: 'An error occurred.' });
    }
  };

  return (
    <div className="bg-ink-50 pb-20 pt-28 lg:pt-36">
      <div className="container-x">
        <Breadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'Developments', to: '/developments' },
            { label: project.name },
          ]}
        />

        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          {/* Gallery + Info */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-ink-200"
            >
              {displayImages.length > 0 ? (
                <img
                  src={displayImages[activeImage]}
                  alt={`${project.name} - image ${activeImage + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <HardHat className="h-16 w-16 text-ink-300" />
                </div>
              )}
              <div className="absolute left-4 top-4 flex gap-2">
                <Badge tone={developmentStatusTone(project.status)} className="backdrop-blur-sm">
                  {developmentStatusLabel(project.status)}
                </Badge>
              </div>
              <div className="absolute right-4 top-4 flex gap-2">
                <button
                  aria-label="Share project"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href).catch(() => {});
                    notify({ type: 'info', title: 'Link copied', description: 'Share link copied to clipboard.' });
                  }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/70 text-ink-700 backdrop-blur-md transition-all hover:bg-white"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((i) => (i - 1 + displayImages.length) % displayImages.length)}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-ink-800 backdrop-blur-md transition-colors hover:bg-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setActiveImage((i) => (i + 1) % displayImages.length)}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-ink-800 backdrop-blur-md transition-colors hover:bg-white"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </motion.div>

            {displayImages.length > 1 && (
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 sm:gap-3">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      'aspect-[4/3] overflow-hidden rounded-xl border-2 transition-all',
                      idx === activeImage ? 'border-forest-500' : 'border-transparent hover:border-forest-200',
                    )}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Title + Progress */}
            <div className="mt-8 rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">{project.name}</h1>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-500">
                    <MapPin className="h-4 w-4 text-forest-500" /> {project.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-ink-400">
                    {project.expectedCompletionDate
                      ? `Expected ${formatDate(project.expectedCompletionDate)}`
                      : 'Completion date TBD'}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-ink-600">Construction Progress</span>
                  <span className="font-bold text-forest-600">{project.progressPercentage}%</span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-ink-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progressPercentage}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full rounded-full bg-forest-500"
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-ink-100 pt-6 sm:grid-cols-3">
                <div className="rounded-xl bg-ink-50 p-3 text-center">
                  <p className="font-display text-xl font-bold text-ink-900">{project.unitCount}</p>
                  <p className="text-xs text-ink-500">Units</p>
                </div>
                <div className="rounded-xl bg-ink-50 p-3 text-center">
                  <p className="font-display text-xl font-bold text-ink-900">{project.updateCount}</p>
                  <p className="text-xs text-ink-500">Updates</p>
                </div>
                <div className="rounded-xl bg-ink-50 p-3 text-center sm:col-span-1">
                  <p className="font-display text-xl font-bold text-ink-900">{project.developer ?? '—'}</p>
                  <p className="text-xs text-ink-500">Developer</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
              <h2 className="font-display text-lg font-semibold text-ink-900">About this project</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">{project.description}</p>
            </div>

            {/* Units Table */}
            {project.units.length > 0 && (
              <div className="mt-6">
                <CardTable title={`Available Units (${project.units.length})`}>
                  <table className="w-full min-w-[560px] border-collapse">
                    <thead>
                      <tr className="border-b border-ink-100 bg-ink-50/60">
                        <th className={thClass}>Unit</th>
                        <th className={thClass}>Type</th>
                        <th className={thClass}>Status</th>
                        <th className={thClass}>Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-50">
                      {project.units.map((u) => (
                        <tr key={u.id} className="transition-colors hover:bg-ink-50/60">
                          <td className={tdClass}>
                            <span className="font-medium text-ink-900">{u.unitIdentifier}</span>
                          </td>
                          <td className={tdClass}>{u.unitType}</td>
                          <td className={tdClass}>
                            <Badge tone={unitStatusTone(u.status)}>{unitStatusLabel(u.status)}</Badge>
                          </td>
                          <td className={tdClass}>
                            {u.price != null ? `${u.currency} ${u.price.toLocaleString()}` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardTable>
              </div>
            )}

            {/* Updates Timeline */}
            {project.updates.length > 0 && (
              <div className="mt-6 rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
                <h2 className="font-display text-lg font-semibold text-ink-900">Project Updates</h2>
                <div className="mt-4 space-y-6">
                  {[...project.updates]
                    .sort((a, b) => new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime())
                    .map((u) => (
                      <div key={u.id} className="relative border-l-2 border-forest-200 pl-6">
                        <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full border-2 border-forest-500 bg-white" />
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h3 className="font-display text-base font-semibold text-ink-900">{u.title}</h3>
                          <span className="text-xs text-ink-400">
                            <Calendar className="mr-1 inline h-3 w-3" />
                            {formatDate(u.updateDate)}
                          </span>
                        </div>
                        {u.progressPercentage != null && (
                          <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-2.5 py-0.5 text-xs font-medium text-forest-700">
                            {u.progressPercentage}% complete
                          </div>
                        )}
                        <p className="mt-2 text-sm text-ink-600">{u.description}</p>
                        {u.imageUrls.length > 0 && (
                          <div className="mt-3 grid grid-cols-3 gap-2">
                            {u.imageUrls.map((url, i) => (
                              <img key={i} src={url} alt="" className="aspect-video w-full rounded-lg object-cover" />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Track */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-50 text-forest-600">
                    <HardHat className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold text-ink-900">{project.name}</h3>
                    <p className="text-xs text-ink-500">{project.location}</p>
                  </div>
                </div>

                <div className="mt-4">
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

                <div className="mt-6">
                  {trackedProject ? (
                    <Button
                      variant="ghost"
                      size="lg"
                      className="w-full"
                      leftIcon={<Radar className="h-4 w-4" />}
                      loading={stopTracking.isPending}
                      onClick={handleStopTracking}
                    >
                      Stop Tracking
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      leftIcon={<Radar className="h-4 w-4" />}
                      loading={trackProject.isPending}
                      onClick={handleTrack}
                    >
                      Track This Project
                    </Button>
                  )}
                </div>

                <p className="mt-3 text-center text-xs text-ink-400">
                  {trackedProject
                    ? 'You are tracking this project and will receive updates.'
                    : 'Track this project to receive updates and monitor progress.'}
                </p>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
