import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading payment result"
      className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-20 text-center sm:px-6"
    >
      <Skeleton className="size-14 rounded-full" />
      <Skeleton className="mt-6 h-7 w-64 max-w-full" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-1.5 h-4 w-2/3" />
      <div className="mt-8 flex gap-3">
        <Skeleton className="h-9 w-32 rounded-4xl" />
        <Skeleton className="h-9 w-32 rounded-4xl" />
      </div>
    </div>
  );
}
