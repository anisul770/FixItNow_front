import type { IService } from "@/lib/types";

/**
 * GET /api/service/all → data.services
 * Returns an empty list on any failure so the page can render its own
 * empty state instead of throwing inside the layout.
 */
export const getAllServices = async (): Promise<IService[]> => {
  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/service/all`, {
      next: {
        revalidate: 300,
        tags: ["services"],
      },
    });

    if (!res.ok) return [];

    const result = await res.json();

    return result?.data?.services ?? [];
  } catch {
    return [];
  }
};
