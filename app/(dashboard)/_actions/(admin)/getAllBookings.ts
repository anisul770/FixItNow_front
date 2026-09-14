import type { IBooking } from "@/lib/types";

import { authorizedFetch } from "../authorizedFetch";

/** GET /api/admin/bookings → data.bookings (admin only) */
export const getAllBookings = async (): Promise<IBooking[]> => {
  const data = await authorizedFetch<{ bookings: IBooking[] }>(
    "/api/admin/bookings"
  );

  return data?.bookings ?? [];
};
