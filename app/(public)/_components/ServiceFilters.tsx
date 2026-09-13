"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ICategory, IServiceFilters } from "@/lib/types";

const SORT_OPTIONS = [
  { label: "Newest first", sortBy: "createdAt", sortOrder: "desc" },
  { label: "Price: low to high", sortBy: "price", sortOrder: "asc" },
  { label: "Price: high to low", sortBy: "price", sortOrder: "desc" },
  { label: "Top rated", sortBy: "rating", sortOrder: "desc" },
];

const SELECT_CLASSES =
  "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

interface IServiceFiltersProps {
  categories: ICategory[];
  initialFilters: IServiceFilters;
}

const ServiceFilters = ({
  categories,
  initialFilters,
}: IServiceFiltersProps) => {
  const router = useRouter();
  const [filters, setFilters] = useState<IServiceFilters>(initialFilters);

  const sortValue =
    filters.sortBy && filters.sortOrder
      ? `${filters.sortBy}:${filters.sortOrder}`
      : "";

  const update = (patch: Partial<IServiceFilters>) =>
    setFilters((current) => ({ ...current, ...patch }));

  const apply = (next: IServiceFilters) => {
    const query = new URLSearchParams();

    for (const [key, value] of Object.entries(next)) {
      if (value) query.set(key, value);
    }

    const queryString = query.toString();
    router.push(queryString ? `/services?${queryString}` : "/services");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    apply(filters);
  };

  const handleReset = () => {
    setFilters({});
    router.push("/services");
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="flex flex-col gap-1.5 lg:col-span-2">
          <Label htmlFor="searchTerm">Search</Label>
          <Input
            id="searchTerm"
            name="searchTerm"
            type="search"
            placeholder="Leaking tap, wiring…"
            value={filters.searchTerm ?? ""}
            onChange={(event) => update({ searchTerm: event.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="categoryId">Category</Label>
          <select
            id="categoryId"
            name="categoryId"
            className={SELECT_CLASSES}
            value={filters.categoryId ?? ""}
            onChange={(event) => update({ categoryId: event.target.value })}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="minPrice">Price range</Label>
          <div className="flex items-center gap-2">
            <Input
              id="minPrice"
              name="minPrice"
              type="number"
              min={0}
              placeholder="Min"
              value={filters.minPrice ?? ""}
              onChange={(event) => update({ minPrice: event.target.value })}
            />
            <Input
              id="maxPrice"
              name="maxPrice"
              type="number"
              min={0}
              placeholder="Max"
              value={filters.maxPrice ?? ""}
              onChange={(event) => update({ maxPrice: event.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sort">Sort by</Label>
          <select
            id="sort"
            name="sort"
            className={SELECT_CLASSES}
            value={sortValue}
            onChange={(event) => {
              const [sortBy, sortOrder] = event.target.value.split(":");
              update({ sortBy, sortOrder });
            }}
          >
            <option value="">Default</option>
            {SORT_OPTIONS.map((option) => (
              <option
                key={option.label}
                value={`${option.sortBy}:${option.sortOrder}`}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button type="submit" size="sm">
          Apply filters
        </Button>
        {hasFilters && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleReset}
          >
            Clear
          </Button>
        )}
      </div>
    </form>
  );
};

export default ServiceFilters;
