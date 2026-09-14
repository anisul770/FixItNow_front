import { Skeleton } from "@/components/ui/skeleton";
import StatTilesSkeleton from "../_components/StatTilesSkeleton";
import TableSkeleton from "../_components/TableSkeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading dashboard" className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <Skeleton className="h-7 w-36 rounded-full" />
      </div>

      <StatTilesSkeleton />

      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-40" />
        <TableSkeleton columns={6} rows={5} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-28" />
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4"
            >
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-14" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-24" />
            <div className="rounded-xl border border-border bg-card p-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2.5 h-4 w-full" />
              <Skeleton className="mt-2.5 h-4 w-2/3" />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-16" />
            <div className="rounded-xl border border-border bg-card p-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2.5 h-4 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
