import type { IBooking } from "@/lib/types";

import { authorizedFetch } from "../authorizedFetch";

/**
 * GET /api/booking/:bookingId → data.booking.
 * Nests the full service, but only { userId, user: { name } } for the
 * technician — the rest of their profile has to be fetched separately.
 */
export const getBookingById = async (
  bookingId: string
): Promise<IBooking | null> => {
  const data = await authorizedFetch<{ booking: IBooking }>(
    `/api/booking/${bookingId}`
  );

  return data?.booking ?? null;
};
