import { Spinner } from '../ui/Spinner';

export function RouteLoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size="lg" label={label} />
    </div>
  );
}
