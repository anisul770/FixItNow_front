import { Skeleton } from "@/components/ui/skeleton";
import TableSkeleton from "../../_components/TableSkeleton";

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading technicians"
      className="flex flex-col gap-6"
    >
      <Skeleton className="h-4 w-24" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-96 max-w-full" />
        <Skeleton className="h-3 w-full max-w-lg" />
      </div>
      <TableSkeleton columns={7} rows={8} withActions />
    </div>
  );
}
