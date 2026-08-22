import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HardHat, AlertTriangle } from 'lucide-react';
import type { DevelopmentProjectFilters } from '../types/development';
import { useDevelopmentProjects } from '../hooks/queries';
import { DevelopmentCard } from '../components/development/DevelopmentCard';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { EmptyState } from '../components/ui/EmptyState';
import { Pagination } from '../components/ui/Pagination';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import { DEVELOPMENT_PROJECT_STATUS_OPTIONS, developmentStatusLabel } from '../utils/developmentStatus';

const PAGE_SIZE = 9;

export function DevelopmentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: DevelopmentProjectFilters = useMemo(
    () => ({
      keyword: searchParams.get('q') ?? undefined,
      status: (searchParams.get('status') as DevelopmentProjectFilters['status']) ?? undefined,
      pageNumber: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      pageSize: PAGE_SIZE,
    }),
    [searchParams],
  );

  const result = useDevelopmentProjects(filters);
  const totalCount = result.data?.totalCount ?? 0;
  const totalPages = result.data?.totalPages ?? 1;

  const setStatus = (status?: string) => {
    const params = new URLSearchParams(searchParams);
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    params.delete('page');
    setSearchParams(params);
  };

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set('page', String(page));
    } else {
      params.delete('page');
    }
    setSearchParams(params);
  };

  return (
    <div className="bg-ink-50">
      <div className="container-x pt-28 pb-8 lg:pt-36">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Developments' }]} />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="heading-2">Development Projects</h1>
            <p className="mt-2 max-w-xl text-ink-500">
              Browse {totalCount.toLocaleString()} ongoing {totalCount === 1 ? 'project' : 'projects'} across
              Plateau State.
            </p>
          </div>
          <Select
            value={filters.status ?? ''}
            onChange={(e) => setStatus(e.target.value || undefined)}
            className="w-auto"
          >
            <option value="">All statuses</option>
            {DEVELOPMENT_PROJECT_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{developmentStatusLabel(s)}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="container-x pb-20">
        {result.isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-ink-100" />
            ))}
          </div>
        ) : result.isError ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink-200 bg-white p-12 text-center">
            <AlertTriangle className="h-6 w-6 text-gold-500" />
            <p className="text-sm text-ink-500">Could not load projects. Is the backend running?</p>
          </div>
        ) : result.data && result.data.items.length === 0 ? (
          <EmptyState
            icon={<HardHat className="h-6 w-6" />}
            title="No projects found"
            description="There are no development projects matching your criteria."
            action={<Button size="lg" onClick={() => { setSearchParams(new URLSearchParams()); }}>Clear filters</Button>}
          />
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {(result.data?.items ?? []).map((p, idx) => (
                <DevelopmentCard key={p.id} project={p} index={idx} />
              ))}
            </div>
            <Pagination
              className="mt-10"
              page={filters.pageNumber ?? 1}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
