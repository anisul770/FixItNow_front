import { Skeleton } from "@/components/ui/skeleton";

const DetailRowsSkeleton = ({ rows = 4 }: { rows?: number }) => (
  <div className="rounded-xl border border-border bg-card px-4 py-2">
    {Array.from({ length: rows }).map((_, index) => (
      <div
        key={index}
        className="flex items-center justify-between gap-4 border-b border-border py-2.5 last:border-0"
      >
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-3.5 w-28" />
      </div>
    ))}
  </div>
);

export default DetailRowsSkeleton;
