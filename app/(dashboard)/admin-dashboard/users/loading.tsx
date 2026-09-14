import { Skeleton } from "@/components/ui/skeleton";
import TableSkeleton from "../../_components/TableSkeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading users" className="flex flex-col gap-6">
      <Skeleton className="h-4 w-24" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <TableSkeleton columns={5} rows={8} />
    </div>
  );
}
