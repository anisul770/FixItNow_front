import { Skeleton } from "@/components/ui/skeleton";

const TechnicianCardSkeleton = () => {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <Skeleton className="size-11 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="mt-2 h-3 w-1/3" />
        </div>
        <Skeleton className="h-4 w-8 shrink-0" />
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-9 w-24 rounded-4xl" />
      </div>
    </div>
  );
};

export default TechnicianCardSkeleton;
