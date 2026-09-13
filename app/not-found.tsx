import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

const SUGGESTIONS = [
  { label: "Browse services", href: "/services" },
  { label: "Find a technician", href: "/technicians" },
  { label: "My dashboard", href: "/dashboard" },
];

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh w-full items-center justify-center overflow-hidden px-4 py-16 sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(50% 60% at 50% 0%, color-mix(in oklch, var(--primary), transparent 85%), transparent 70%)",
        }}
      />

      <div className="relative flex w-full max-w-md flex-col items-center text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-6">
            <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
          </svg>
        </span>

        <p className="mt-6 font-mono text-sm tracking-widest text-muted-foreground">
          404
        </p>

        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          This page needs fixing
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The page you are looking for has been moved, or never existed. Not
          every broken thing has a technician for it.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className={buttonVariants()}>
            Back to home
          </Link>
          <Link
            href="/services"
            className={buttonVariants({ variant: "outline" })}
          >
            Browse services
          </Link>
        </div>

        <div className="mt-10 w-full border-t border-border pt-6">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Try one of these
          </p>
          <ul className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
            {SUGGESTIONS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
