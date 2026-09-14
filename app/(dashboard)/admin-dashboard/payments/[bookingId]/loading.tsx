import { Skeleton } from "@/components/ui/skeleton";
import DetailRowsSkeleton from "../../../_components/DetailRowsSkeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading payment" className="flex flex-col gap-6">
      <Skeleton className="h-4 w-32" />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-24" />
            <DetailRowsSkeleton rows={6} />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-20" />
            <DetailRowsSkeleton rows={5} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-2 h-5 w-2/3" />
          <Skeleton className="mt-4 h-3 w-24" />
          <Skeleton className="mt-2 h-5 w-1/2" />
          <Skeleton className="mt-4 h-9 w-full rounded-4xl" />
        </div>
      </div>
    </div>
  );
}
