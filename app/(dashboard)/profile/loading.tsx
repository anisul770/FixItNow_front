import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading profile" className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-28" />
          <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-28 rounded-4xl" />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-3">
              <Skeleton className="size-12 shrink-0 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="mt-1.5 h-3 w-1/2" />
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-border bg-card p-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex justify-between gap-3 py-1.5"
                >
                  <Skeleton className="h-3.5 w-16" />
                  <Skeleton className="h-3.5 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
