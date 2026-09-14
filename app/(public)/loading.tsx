import { Skeleton } from "@/components/ui/skeleton";
import ServiceCardSkeleton from "./_components/ServiceCardSkeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="flex flex-col">
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="max-w-2xl">
            <Skeleton className="h-6 w-56 rounded-full" />
            <Skeleton className="mt-5 h-10 w-full max-w-md" />
            <Skeleton className="mt-2 h-10 w-2/3 max-w-sm" />
            <Skeleton className="mt-5 h-4 w-full max-w-xl" />
            <Skeleton className="mt-2 h-4 w-2/3 max-w-md" />
            <Skeleton className="mt-8 h-10 w-full max-w-md rounded-lg" />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <Skeleton className="h-7 w-56" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6">
        <Skeleton className="h-7 w-48" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <ServiceCardSkeleton key={index} />
          ))}
        </div>
      </section>

      <span className="sr-only">Loading…</span>
    </div>
  );
}
