import type { IPaymentDetails } from "@/lib/types";

import { authorizedFetch } from "../authorizedFetch";

/**
 * GET /api/payment/:bookingId/details → data.payment.
 * Returns null when no payment row exists for the booking yet.
 */
export const getPaymentDetails = async (
  bookingId: string
): Promise<IPaymentDetails | null> => {
  const data = await authorizedFetch<{ payment: IPaymentDetails }>(
    `/api/payment/${bookingId}/details`
  );

  return data?.payment ?? null;
};
