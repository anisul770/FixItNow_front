"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export type TBookingState = { success: boolean; message: string } | null;

/**
 * POST /api/booking/new_booking with { serviceId, bookingDate, startTime, address }.
 *
 * A slot only fixes the time of day — the backend does not pin it to the slot's
 * own date — so the customer picks the date and the slot supplies the time.
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

  // The date input gives "2026-10-11"; pin it to UTC midnight so the stored
  // date cannot drift a day either way with the server's timezone.
  const bookingDate = new Date(`${chosenDate}T00:00:00.000Z`);

  if (Number.isNaN(bookingDate.getTime())) {
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
          bookingDate: bookingDate.toISOString(),
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
