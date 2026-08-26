import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid3x3, List, MapPin, AlertTriangle } from 'lucide-react';
import type { PropertyFilters } from '../types';
import { useProperties, useLocations } from '../hooks/queries';
import { useFavourites } from '../hooks/useFavourites';
import { PropertyCard } from '../components/property/PropertyCard';
import { PropertyCardSkeleton } from '../components/property/PropertyCardSkeleton';
import { SearchFilterCard } from '../components/property/SearchFilter';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { EmptyState } from '../components/ui/EmptyState';
import { Pagination } from '../components/ui/Pagination';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { cn } from '../utils/cn';

const PAGE_SIZE = 9;

export function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const { isFavourite, toggle } = useFavourites();
  const { data: states = [] } = useLocations({ type: 'State' });

  const filters: PropertyFilters = useMemo(
    () => ({
      location: searchParams.get('location') ?? undefined,
      type: searchParams.get('type') ?? undefined,
      status: searchParams.get('status') ?? undefined,
      listingType: searchParams.get('listingType') ?? undefined,
      bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      query: searchParams.get('q') ?? undefined,
      sort: searchParams.get('sort') ?? 'newest',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      pageSize: PAGE_SIZE,
    }),
    [searchParams],
  );

  const result = useProperties(filters);
  const totalCount = result.data?.totalCount ?? 0;
  const totalPages = result.data?.totalPages ?? 1;

  const onChange = (next: PropertyFilters, page = 1) => {
    const params = new URLSearchParams();
    if (next.location && next.location !== 'All') params.set('location', next.location);
    if (next.type && next.type !== 'All') params.set('type', next.type);
    if (next.status && next.status !== 'All') params.set('status', next.status);
    if (next.listingType && next.listingType !== 'All') params.set('listingType', next.listingType);
    if (next.bedrooms) params.set('bedrooms', String(next.bedrooms));
    if (next.maxPrice) params.set('maxPrice', String(next.maxPrice));
    if (next.query) params.set('q', next.query);
    if (next.sort) params.set('sort', next.sort);
    if (page > 1) params.set('page', String(page));
    setSearchParams(params);
  };

  return (
    <div className="bg-ink-50">
      <div className="container-x pt-28 pb-8 lg:pt-36">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Properties' }]} />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="heading-2">Properties in Plateau State</h1>
            <p className="mt-2 max-w-xl text-ink-500">
              Browse {totalCount.toLocaleString()} verified {totalCount === 1 ? 'property' : 'properties'} across Jos,
              Rayfield, Bukuru and beyond.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="neutral" className="px-3 py-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
            </Badge>
            <div className="inline-flex rounded-xl border border-ink-200 bg-white p-1">
              <button
                onClick={() => setView('grid')}
                aria-label="Grid view"
                aria-pressed={view === 'grid'}
                className={cn(
                  'rounded-lg p-1.5 transition-colors',
                  view === 'grid' ? 'bg-forest-500 text-white' : 'text-ink-500 hover:bg-ink-100',
                )}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView('list')}
                aria-label="List view"
                aria-pressed={view === 'list'}
                className={cn(
                  'rounded-lg p-1.5 transition-colors',
                  view === 'list' ? 'bg-forest-500 text-white' : 'text-ink-500 hover:bg-ink-100',
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-x pb-20">
        <div className="grid gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-4">
              <SearchFilterCard filters={filters} onChange={(next) => onChange(next)} onSearch={() => {}} />
              <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
                <h3 className="font-display text-sm font-semibold text-ink-900">Popular locations</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {states.slice(0, 5).map((s) => (
                    <li key={s.id}>
                      <button
                        onClick={() => onChange({ ...filters, locationId: s.id, location: undefined })}
                        className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-ink-600 transition-colors hover:bg-ink-100 hover:text-forest-600"
                      >
                        <span className="inline-flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-forest-500" /> {s.name}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-9">
            {result.isLoading ? (
              <div className={cn('grid gap-6', view === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1')}>
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            ) : result.isError ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink-200 bg-white p-12 text-center">
                <AlertTriangle className="h-6 w-6 text-gold-500" />
                <p className="text-sm text-ink-500">Could not load properties. Is the backend running?</p>
              </div>
            ) : result.data && result.data.items.length === 0 ? (
              <EmptyState
                icon={<MapPin className="h-6 w-6" />}
                title="No properties match your filters"
                description="Try widening your price range or clearing filters to see more listings."
                action={<Button size="lg" onClick={() => onChange({})}>Clear filters</Button>}
              />
            ) : (
              <>
                <div className={cn('grid gap-6', view === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1')}>
                  {(result.data?.items ?? []).map((p, idx) => (
                    <PropertyCard
                      key={p.id}
                      property={p}
                      index={idx}
                      agentName={p.agentName}
                      isFavourite={isFavourite(p.id)}
                      onToggleFavourite={toggle}
                    />
                  ))}
                </div>
                <Pagination
                  className="mt-10"
                  page={filters.page ?? 1}
                  totalPages={totalPages}
                  onPageChange={(page) => onChange(filters, page)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
