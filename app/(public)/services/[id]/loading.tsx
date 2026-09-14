import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading service"
      className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6"
    >
      <Skeleton className="h-4 w-32" />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div>
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="mt-3 h-9 w-2/3" />
          <div className="mt-3 flex items-center gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>

          <div className="mt-8">
            <Skeleton className="h-5 w-40" />
            <div className="mt-3 flex flex-col gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          <div className="mt-8">
            <Skeleton className="h-5 w-32" />
            <div className="mt-4 flex flex-col gap-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index}>
                  <Skeleton className="h-4 w-36" />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Skeleton className="h-7 w-24 rounded-lg" />
                    <Skeleton className="h-7 w-24 rounded-lg" />
                    <Skeleton className="h-7 w-24 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <Skeleton className="h-5 w-24" />
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
          <Skeleton className="mt-2 h-4 w-32" />

          <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>

          <div className="mt-4 flex items-center gap-2.5 border-t border-border pt-4">
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="mt-1.5 h-3 w-1/2" />
            </div>
          </div>
        </div>
      </div>

      <span className="sr-only">Loading service details…</span>
    </div>
  );
}
