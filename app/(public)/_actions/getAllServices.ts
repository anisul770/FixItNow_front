import type { IService } from "@/lib/types";

/**
 * Query keys sent to /api/service/all. Filtering happens on the backend —
 * rename these here if the API expects different keys.
 */
export interface IServiceFilters {
  searchTerm?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  sortOrder?: string;
}

/**
 * GET /api/service/all → data.services
 * Returns an empty list on any failure so the page can render its own
 * empty state instead of throwing inside the layout.
 */
export const getAllServices = async (
  filters: IServiceFilters = {}
): Promise<IService[]> => {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value) query.set(key, value);
  }

  const queryString = query.toString();

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/service/all${queryString ? `?${queryString}` : ""}`,
      {
        next: {
          revalidate: 300,
          tags: ["services"],
        },
      }
    );

    if (!res.ok) return [];

    const result = await res.json();

    return result?.data?.services ?? [];
  } catch {
    return [];
  }
};
