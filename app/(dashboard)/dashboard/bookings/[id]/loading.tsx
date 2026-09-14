import { Skeleton } from "@/components/ui/skeleton";
import DetailRowsSkeleton from "../../../_components/DetailRowsSkeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading booking" className="flex flex-col gap-6">
      <Skeleton className="h-4 w-32" />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-28" />
            <DetailRowsSkeleton rows={4} />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-20" />
            <DetailRowsSkeleton rows={3} />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-24" />
            <DetailRowsSkeleton rows={3} />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-32" />
            <div className="rounded-xl border border-border bg-card p-5">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="mt-4 h-9 w-28 rounded-4xl" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <Skeleton className="h-3 w-20" />
            <div className="mt-3 flex items-center gap-3">
              <Skeleton className="size-11 shrink-0 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="mt-1.5 h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="mt-4 h-9 w-full rounded-4xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
