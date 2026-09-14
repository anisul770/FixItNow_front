import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main
      role="status"
      aria-label="Loading"
      className="grid w-full min-h-svh lg:grid-cols-2"
    >
      <section className="hidden bg-muted/40 p-12 lg:flex lg:flex-col lg:justify-between">
        <Skeleton className="h-9 w-36" />
        <div className="max-w-md">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="mt-2 h-10 w-2/3" />
          <Skeleton className="mt-4 h-4 w-full" />
          <div className="mt-8 flex flex-col gap-3">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
        <Skeleton className="h-3 w-40" />
      </section>

      <section className="flex items-center justify-center px-6 py-8 sm:px-10">
        <div className="w-full max-w-lg">
          <Skeleton className="mx-auto h-4 w-24" />

          <div className="mt-6 rounded-2xl border border-border p-8">
            <Skeleton className="mx-auto h-6 w-48" />
            <Skeleton className="mx-auto mt-2 h-3 w-56" />

            <div className="mt-6 flex flex-col gap-4">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-9 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
              <Skeleton className="h-9 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
