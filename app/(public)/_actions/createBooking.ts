"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export type TBookingState = { success: boolean; message: string } | null;

/**
 * POST /api/booking/new_booking with { serviceId, bookingDate, startTime, address }.
 *
 * The date and time must match a slot the technician actually published —
 * anything else is refused with "technician is not available at that time" —
 * so both values come straight off the chosen slot.
 */
export const createBooking = async (
  prevState: TBookingState,
  formData: FormData
): Promise<TBookingState> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, message: "Please log in to book a service." };
  }

  const serviceId = String(formData.get("serviceId") ?? "");
  const chosenDate = String(formData.get("bookingDate") ?? "");
  const startTime = String(formData.get("startTime") ?? "");
  const address = String(formData.get("address") ?? "").trim();

  if (!serviceId || !startTime) {
    return { success: false, message: "Please choose a time slot." };
  }

  if (!chosenDate) {
    return { success: false, message: "Please choose a date." };
  }

  if (!address) {
    return { success: false, message: "Please add the service address." };
  }

  // chosenDate is the slot's own ISO date, forwarded untouched so it matches
  // the stored slot exactly — reformatting it here is what breaks the match.
  if (Number.isNaN(new Date(chosenDate).getTime())) {
    return { success: false, message: "That date is not valid." };
  }

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/booking/new_booking`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          serviceId,
          bookingDate: chosenDate,
          startTime,
          address,
        }),
      }
    );

    const result = await res.json();

    if (result?.success) {
      revalidateTag(`slots-${serviceId}`, { expire: 0 });
      revalidateTag("my-profile", { expire: 0 });
    }

    return {
      success: Boolean(result?.success),
      message: result?.message ?? "Could not create this booking.",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
};
