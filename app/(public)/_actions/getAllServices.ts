import type { IService, IServiceFilters } from "@/lib/types";

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
