import type { IBooking } from "@/lib/types";

import { authorizedFetch } from "../authorizedFetch";

/** GET /api/booking/technician_bookings → data.bookings */
export const getTechnicianBookings = async (): Promise<IBooking[]> => {
  const data = await authorizedFetch<{ bookings: IBooking[] }>(
    "/api/booking/technician_bookings"
  );

  return data?.bookings ?? [];
};
