import type { IReview } from "@/lib/types";

/** GET /api/review/technician/:technicianId → data.reviews */
export const getTechnicianReviews = async (
  technicianId: string
): Promise<IReview[]> => {
  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/review/technician/${technicianId}`,
      {
        next: {
          revalidate: 300,
          tags: ["reviews", `reviews-technician-${technicianId}`],
        },
      }
    );

    if (!res.ok) return [];

    const result = await res.json();

    return result?.data?.reviews ?? [];
  } catch {
    return [];
  }
};
