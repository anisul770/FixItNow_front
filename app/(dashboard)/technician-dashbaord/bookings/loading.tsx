import { Skeleton } from "@/components/ui/skeleton";
import TableSkeleton from "../../_components/TableSkeleton";

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading booking requests"
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <TableSkeleton columns={6} rows={6} withActions />
    </div>
  );
}
