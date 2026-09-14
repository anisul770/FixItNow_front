import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading services" className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-28" />
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-14" />
              </div>
              <Skeleton className="mt-2.5 h-3 w-48" />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-32" />
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
            <Skeleton className="h-9 w-32 rounded-4xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
