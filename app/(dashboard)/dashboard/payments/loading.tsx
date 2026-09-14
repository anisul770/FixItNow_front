import { Skeleton } from "@/components/ui/skeleton";
import TableSkeleton from "../../_components/TableSkeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading payments" className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-40" />
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4"
          >
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-9 w-24 rounded-4xl" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-36" />
        <TableSkeleton columns={6} rows={5} />
      </div>
    </div>
  );
}
