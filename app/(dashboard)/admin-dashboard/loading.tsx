import { Skeleton } from "@/components/ui/skeleton";
import StatTilesSkeleton from "../_components/StatTilesSkeleton";
import TableSkeleton from "../_components/TableSkeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading admin dashboard" className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      <StatTilesSkeleton />

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-40" />
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3"
              >
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-8" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-20" />
            <div className="rounded-xl border border-border bg-card p-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2.5 h-4 w-full" />
              <Skeleton className="mt-2.5 h-4 w-2/3" />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-20" />
            <div className="rounded-xl border border-border bg-card p-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2.5 h-4 w-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-32" />
        <TableSkeleton columns={5} rows={6} />
      </div>
    </div>
  );
}
