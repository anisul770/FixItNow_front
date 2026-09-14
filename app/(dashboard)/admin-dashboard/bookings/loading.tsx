import { Skeleton } from "@/components/ui/skeleton";
import TableSkeleton from "../../_components/TableSkeleton";

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading bookings"
      className="flex flex-col gap-6"
    >
      <Skeleton className="h-4 w-24" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-60" />
      </div>

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-7 w-24 rounded-full" />
        ))}
      </div>

      <TableSkeleton columns={5} rows={8} />
    </div>
  );
}
