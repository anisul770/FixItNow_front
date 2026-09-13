import type { ITechnicianProfile } from "@/lib/types";

/**
 * GET /api/technician/all → data.technicians (each with its nested user).
 * Public read — no token attached.
 */
export const getAllTechnicians = async (): Promise<ITechnicianProfile[]> => {
  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/technician/all`,
      {
        next: {
          revalidate: 300,
          tags: ["technicians"],
        },
      }
    );

    if (!res.ok) return [];

    const result = await res.json();

    return result?.data?.technicians ?? [];
  } catch {
    return [];
  }
};
