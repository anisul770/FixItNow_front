import { Skeleton } from "@/components/ui/skeleton";
import ServiceCardSkeleton from "../_components/ServiceCardSkeleton";

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading services"
      className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6"
    >
      <div className="max-w-2xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-full max-w-md" />
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Skeleton className="h-9 w-full lg:col-span-2" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
        <Skeleton className="mt-4 h-8 w-28 rounded-4xl" />
      </div>

      <Skeleton className="mt-6 h-4 w-32" />

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <ServiceCardSkeleton key={index} />
        ))}
      </div>

      <span className="sr-only">Loading services…</span>
    </div>
  );
}
