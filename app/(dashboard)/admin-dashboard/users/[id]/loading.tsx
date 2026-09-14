import { Skeleton } from "@/components/ui/skeleton";
import DetailRowsSkeleton from "../../../_components/DetailRowsSkeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading user" className="flex flex-col gap-6">
      <Skeleton className="h-4 w-28" />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-12 shrink-0 rounded-full" />
          <div>
            <Skeleton className="h-6 w-40" />
            <div className="mt-2 flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>
        <Skeleton className="h-9 w-24 rounded-4xl" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-20" />
            <DetailRowsSkeleton rows={4} />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-24" />
            <DetailRowsSkeleton rows={3} />
          </div>
        </div>
        <div />
      </div>
    </div>
  );
}
