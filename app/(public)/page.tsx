import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { getCategories } from "@/service/getCategories";
import { getAllServices } from "./_actions/getAllServices";
import ServiceCard from "./_components/ServiceCard";

const STEPS = [
  {
    title: "Find a service",
    description:
      "Search by problem or browse a category to see what technicians near you offer.",
  },
  {
    title: "Pick a slot",
    description:
      "Every technician publishes their availability. Choose a time that suits you.",
  },
  {
    title: "Get it fixed",
    description:
      "Track the job from your dashboard, then pay and review once the work is done.",
  },
];

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getAllServices({ limit: "6" }),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(50% 60% at 15% 0%, color-mix(in oklch, var(--primary), transparent 82%), transparent 70%), radial-gradient(40% 50% at 95% 10%, color-mix(in oklch, var(--chart-3), transparent 88%), transparent 70%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              Vetted technicians · Upfront pricing
            </span>

            <h1 className="mt-5 font-heading text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl">
              Fix it now.
              <span className="block text-primary">Not next week.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              Book a plumber, electrician or handyman in minutes. See real
              availability, agree the price upfront, and track the job from one
              place.
            </p>

            <form
              action="/services"
              method="get"
              className="mt-8 flex max-w-md gap-2"
            >
              <input
                type="search"
                name="searchTerm"
                aria-label="Search services"
                placeholder="Leaking tap, broken socket…"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
              <button
                type="submit"
                className={buttonVariants({ size: "lg" })}
              >
                Search
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/services"
                className={buttonVariants({ variant: "outline" })}
              >
                Browse all services
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Join as a technician →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Browse by category
          </h2>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/services?categoryId=${category.id}`}
                  className="flex h-full flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-muted"
                >
                  <span className="font-heading text-base font-medium text-card-foreground">
                    {category.name}
                  </span>
                  {category.description && (
                    <span className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {category.description}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {featured.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              Popular services
            </h2>
            <Link
              href="/services"
              className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              View all services
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            How it works
          </h2>

          <ol className="mt-6 grid gap-6 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <span className="flex size-8 items-center justify-center rounded-full bg-primary font-heading text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <h3 className="mt-3 font-heading text-base font-medium text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-border bg-card p-8">
            <div className="max-w-lg">
              <h2 className="font-heading text-xl font-semibold tracking-tight text-card-foreground">
                Are you a technician?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                List your services, publish your slots and take on jobs near
                you. Free to join — you only pay per job.
              </p>
            </div>

            <Link href="/register" className={buttonVariants({ size: "lg" })}>
              Join FixItNow
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
