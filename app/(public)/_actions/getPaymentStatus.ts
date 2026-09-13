import { cookies } from "next/headers";

import type { IPaymentStatus } from "@/lib/types";

/**
 * GET /api/payment/:bookingId/details → data.payment.status
 *
 * Used by the gateway landing page to read what actually happened, rather
 * than inferring it from which callback the gateway hit.
 */
export const getPaymentStatus = async (
  bookingId: string
): Promise<IPaymentStatus | null> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) return null;

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/payment/${bookingId}/details`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    const result = await res.json();

    return result?.data?.payment?.status ?? null;
  } catch {
    return null;
  }
};
