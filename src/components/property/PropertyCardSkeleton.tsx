export function PropertyCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
      <div className="aspect-[4/3] bg-ink-100" />
      <div className="space-y-3 p-5">
        <div className="h-6 w-1/2 rounded-lg bg-ink-100" />
        <div className="h-4 w-3/4 rounded-lg bg-ink-100" />
        <div className="h-4 w-2/3 rounded-lg bg-ink-100" />
        <div className="grid grid-cols-3 gap-2 border-t border-ink-100 pt-4">
          <div className="h-5 rounded-lg bg-ink-100" />
          <div className="h-5 rounded-lg bg-ink-100" />
          <div className="h-5 rounded-lg bg-ink-100" />
        </div>
      </div>
    </div>
  );
}
