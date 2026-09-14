import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading categories" className="flex flex-col gap-6">
      <Skeleton className="h-4 w-24" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-border bg-card p-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="mt-2 h-3 w-full" />
              <Skeleton className="mt-3 h-3 w-20" />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-32" />
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-36 rounded-4xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
