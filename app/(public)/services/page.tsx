import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import type { IServiceFilters } from "@/lib/types";
import { getCategories } from "@/service/getCategories";
import { getAllServices } from "../_actions/getAllServices";
import ServiceCard from "../_components/ServiceCard";
import ServiceFilters from "../_components/ServiceFilters";

export const metadata: Metadata = {
  title: "Services | FixItNow",
  description: "Browse repair and maintenance services from vetted technicians.",
};

const PAGE_SIZE = 10;

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : (value ?? "");

export default async function ServicesPage(props: PageProps<"/services">) {
  const searchParams = await props.searchParams;

  const page = Math.max(1, Number(first(searchParams.page)) || 1);

  const filters: IServiceFilters = {
    searchTerm: first(searchParams.searchTerm),
    categoryId: first(searchParams.categoryId),
    price: first(searchParams.price),
    location: first(searchParams.location),
    rating: first(searchParams.rating),
    sortBy: first(searchParams.sortBy),
    sortOrder: first(searchParams.sortOrder),
    page: String(page),
  };

  const isFiltered = Object.entries(filters).some(
    ([key, value]) => key !== "page" && Boolean(value)
  );

  const [services, categories] = await Promise.all([
    getAllServices(filters),
    getCategories(),
  ]);

  const hasNextPage = services.length === PAGE_SIZE;

  const pageHref = (targetPage: number) => {
    const query = new URLSearchParams();

    for (const [key, value] of Object.entries(filters)) {
      if (key !== "page" && value) query.set(key, value);
    }
    if (targetPage > 1) query.set("page", String(targetPage));

    const queryString = query.toString();
    return queryString ? `/services?${queryString}` : "/services";
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance">
          Browse services
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Repair and maintenance jobs offered by technicians on FixItNow. Pick
          one to see availability and book a slot.
        </p>
      </header>

      <div className="mt-8">
        <ServiceFilters categories={categories} initialFilters={filters} />
      </div>

      {services.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <p className="font-heading text-base font-medium text-foreground">
            {page > 1
              ? "No more services"
              : isFiltered
                ? "No services match those filters"
                : "No services available right now"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {page > 1
              ? "You've reached the end of the results."
              : isFiltered
                ? "Try widening the price range or clearing the search."
                : "Check back shortly — technicians add new services regularly."}
          </p>
          {page > 1 && (
            <Link
              href={pageHref(1)}
              className={`mt-4 ${buttonVariants({ variant: "outline", size: "sm" })}`}
            >
              Back to first page
            </Link>
          )}
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-muted-foreground">
            Showing {services.length}{" "}
            {services.length === 1 ? "service" : "services"}
            {page > 1 ? ` · page ${page}` : ""}
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {(page > 1 || hasNextPage) && (
            <div className="mt-8 flex items-center justify-between gap-3">
              {page > 1 ? (
                <Link
                  href={pageHref(page - 1)}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  ← Previous
                </Link>
              ) : (
                <span />
              )}

              {hasNextPage && (
                <Link
                  href={pageHref(page + 1)}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
