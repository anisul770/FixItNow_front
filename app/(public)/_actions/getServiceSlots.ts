import type { ISlot } from "@/lib/types";

/** GET /api/technician/availability/:serviceId → data.slots */
export const getServiceSlots = async (serviceId: string): Promise<ISlot[]> => {
  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/technician/availability/${serviceId}`,
      {
        next: {
          revalidate: 60,
          tags: ["slots", `slots-${serviceId}`],
        },
      }
    );

    if (!res.ok) return [];

    const result = await res.json();

    return result?.data?.slots ?? [];
  } catch {
    return [];
  }
};
