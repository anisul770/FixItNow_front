import type { IBooking } from "@/lib/types";

import { authorizedFetch } from "../authorizedFetch";

export const getBookingById = async (
  bookingId: string
): Promise<IBooking | null> => {
  const data = await authorizedFetch<{ booking: IBooking }>(
    `/api/booking/${bookingId}`
  );

  return data?.booking ?? null;
};
