import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading reviews" className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-52" />
        <div className="rounded-xl border border-primary/40 bg-primary/5 p-5">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="mt-4 flex flex-col gap-3 border-t border-primary/20 pt-4">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-28 rounded-4xl" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-20" />
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="mt-2.5 h-4 w-full" />
            <Skeleton className="mt-1.5 h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
