import { Skeleton } from "@/components/ui/skeleton";

const ServiceCardSkeleton = () => {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-4 w-8" />
      </div>

      <Skeleton className="mt-3 h-5 w-3/4" />

      <div className="mt-1.5 flex flex-col gap-1.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Skeleton className="size-6 shrink-0 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-6 w-14" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-9 w-24 rounded-4xl" />
      </div>
    </div>
  );
};

export default ServiceCardSkeleton;
