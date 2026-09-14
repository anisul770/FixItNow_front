import { Skeleton } from "@/components/ui/skeleton";
import TechnicianCardSkeleton from "../_components/TechnicianCardSkeleton";

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading technicians"
      className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6"
    >
      <div className="max-w-2xl">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="mt-2 h-4 w-full max-w-md" />
      </div>

      <Skeleton className="mt-8 h-4 w-40" />

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <TechnicianCardSkeleton key={index} />
        ))}
      </div>

      <span className="sr-only">Loading technicians…</span>
    </div>
  );
}
