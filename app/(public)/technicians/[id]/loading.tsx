import { Skeleton } from "@/components/ui/skeleton";
import ServiceCardSkeleton from "../../_components/ServiceCardSkeleton";

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading technician profile"
      className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6"
    >
      <Skeleton className="h-4 w-36" />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div>
          <div className="flex items-start gap-4">
            <Skeleton className="size-16 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-8 w-48" />
              <div className="mt-2 flex items-center gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Skeleton className="h-5 w-16" />
            <div className="mt-3 flex flex-col gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          <div className="mt-8">
            <Skeleton className="h-5 w-16" />
            <div className="mt-3 flex flex-wrap gap-2">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>
          </div>

          <div className="mt-10">
            <Skeleton className="h-5 w-36" />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <ServiceCardSkeleton />
              <ServiceCardSkeleton />
            </div>
          </div>

          <div className="mt-10">
            <Skeleton className="h-5 w-20" />
            <div className="mt-4 flex flex-col gap-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-7 shrink-0 rounded-full" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <Skeleton className="mt-3 h-4 w-full" />
                  <Skeleton className="mt-1.5 h-4 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <Skeleton className="h-9 w-24" />

          <div className="mt-4 flex flex-col gap-2.5 border-t border-border pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>

      <span className="sr-only">Loading technician profile…</span>
    </div>
  );
}
