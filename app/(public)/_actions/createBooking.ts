"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export type TBookingState = { success: boolean; message: string } | null;

/**
 * POST /api/booking/new_booking with { serviceId, bookingDate, startTime, address }.
 * The chosen slot arrives as "<isoDate>|<startTime>" in the `slot` field.
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
  const [bookingDate, startTime] = String(formData.get("slot") ?? "").split("|");
  const address = String(formData.get("address") ?? "").trim();

  if (!serviceId || !bookingDate || !startTime) {
    return { success: false, message: "Please choose an available slot." };
  }

  if (!address) {
    return { success: false, message: "Please add the service address." };
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
        body: JSON.stringify({ serviceId, bookingDate, startTime, address }),
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
