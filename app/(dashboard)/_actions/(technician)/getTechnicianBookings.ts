import type { IBooking } from "@/lib/types";

import { authorizedFetch } from "../authorizedFetch";

export const getTechnicianBookings = async (): Promise<IBooking[]> => {
  const data = await authorizedFetch<{ bookings: IBooking[] }>(
    "/api/booking/technician_bookings"
  );

  return data?.bookings ?? [];
};
