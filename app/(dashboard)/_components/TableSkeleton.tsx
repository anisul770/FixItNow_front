import { Skeleton } from "@/components/ui/skeleton";

interface ITableSkeletonProps {
  columns?: number;
  rows?: number;
  withActions?: boolean;
}

const TableSkeleton = ({
  columns = 4,
  rows = 5,
  withActions = false,
}: ITableSkeletonProps) => (
  <div className="overflow-hidden rounded-xl border border-border bg-card">
    <div className="flex items-center gap-4 border-b border-border px-4 py-3">
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} className="h-4 w-20" />
      ))}
      {withActions && <Skeleton className="ml-auto h-4 w-14" />}
    </div>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div
        key={rowIndex}
        className="flex items-center gap-4 border-b border-border px-4 py-3.5 last:border-0"
      >
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            className={colIndex === 0 ? "h-4 w-28" : "h-4 w-20"}
          />
        ))}
        {withActions && <Skeleton className="ml-auto h-8 w-20 rounded-4xl" />}
      </div>
    ))}
  </div>
);

export default TableSkeleton;
