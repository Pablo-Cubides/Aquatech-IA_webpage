export default function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 animate-pulse">
      <div className="mb-3 h-44 w-full rounded-xl bg-neutral-200" />
      <div className="h-5 w-3/4 rounded bg-neutral-200" />
      <div className="mt-2 h-3 w-full rounded bg-neutral-200" />
      <div className="mt-2 h-3 w-11/12 rounded bg-neutral-200" />
      <div className="mt-4 h-9 w-full rounded bg-neutral-200" />
    </div>
  );
}
