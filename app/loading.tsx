export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-svh w-full flex-col items-center justify-center gap-4 px-4"
    >
      <span className="relative flex size-12 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-xl bg-primary/30" />
        <span className="relative flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-6">
            <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
          </svg>
        </span>
      </span>

      <p className="text-sm text-muted-foreground">Loading…</p>
    </div>
  );
}
