import type { Metadata } from "next";

import type { IServiceFilters } from "@/lib/types";
import { getCategories } from "@/service/getCategories";
import { getAllServices } from "../_actions/getAllServices";
import ServiceCard from "../_components/ServiceCard";
import ServiceFilters from "../_components/ServiceFilters";

export const metadata: Metadata = {
  title: "Services | FixItNow",
  description: "Browse repair and maintenance services from vetted technicians.",
};

/** searchParams values arrive as string | string[] | undefined. */
const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : (value ?? "");

export default async function ServicesPage(props: PageProps<"/services">) {
  const searchParams = await props.searchParams;

  const filters: IServiceFilters = {
    searchTerm: first(searchParams.searchTerm),
    categoryId: first(searchParams.categoryId),
    minPrice: first(searchParams.minPrice),
    maxPrice: first(searchParams.maxPrice),
    sortBy: first(searchParams.sortBy),
    sortOrder: first(searchParams.sortOrder),
  };

  const isFiltered = Object.values(filters).some(Boolean);

  const [services, categories] = await Promise.all([
    getAllServices(filters),
    getCategories(),
  ]);

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
            {isFiltered ? "No services match those filters" : "No services available right now"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {isFiltered
              ? "Try widening the price range or clearing the search."
              : "Check back shortly — technicians add new services regularly."}
          </p>
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-muted-foreground">
            {services.length} {services.length === 1 ? "service" : "services"}{" "}
            {isFiltered ? "found" : "available"}
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
