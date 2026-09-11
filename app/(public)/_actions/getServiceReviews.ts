import type { IReview } from "@/lib/types";

/** GET /api/review/service/:serviceId → data.reviews */
export const getServiceReviews = async (
  serviceId: string
): Promise<IReview[]> => {
  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/review/service/${serviceId}`,
      {
        next: {
          revalidate: 300,
          tags: ["reviews", `reviews-${serviceId}`],
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
