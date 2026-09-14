import type { ITechnicianProfile } from "@/lib/types";

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
