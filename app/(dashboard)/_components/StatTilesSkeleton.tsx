import { Skeleton } from "@/components/ui/skeleton";

const StatTilesSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="rounded-xl border border-border bg-card p-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="mt-3 h-7 w-16" />
      </div>
    ))}
  </div>
);

export default StatTilesSkeleton;
