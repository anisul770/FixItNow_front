import type { ICategory } from "@/lib/types";

/**
 * GET /api/category/all → data.categories.
 * Public read, used by both the service browser and the technician module.
 */
export const getCategories = async (): Promise<ICategory[]> => {
  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/category/all`, {
      next: {
        revalidate: 3600,
        tags: ["categories"],
      },
    });

    if (!res.ok) return [];

    const result = await res.json();

    return result?.data?.categories ?? [];
  } catch {
    return [];
  }
};
