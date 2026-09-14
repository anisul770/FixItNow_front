import { Skeleton } from "@/components/ui/skeleton";
import TableSkeleton from "../../_components/TableSkeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading payments" className="flex flex-col gap-6">
      <Skeleton className="h-4 w-24" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <TableSkeleton columns={6} rows={8} />
    </div>
  );
}
