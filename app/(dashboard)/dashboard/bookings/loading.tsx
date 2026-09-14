import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading bookings" className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-32 rounded-4xl" />
      </div>

      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4"
          >
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-8 w-20 rounded-4xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
