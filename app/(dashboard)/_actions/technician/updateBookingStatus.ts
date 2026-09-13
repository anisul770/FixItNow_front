"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

import type { IBookingStatus } from "@/lib/types";

/** PATCH /api/booking/:bookingId/status with { status } */
export const updateBookingStatus = async (
  bookingId: string,
  status: IBookingStatus
) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, message: "You are not logged in." };
  }

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/booking/${bookingId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    const result = await res.json();

    if (result?.success) {
      // Declining or cancelling can release the slot behind the booking.
      revalidateTag("slots", { expire: 0 });
    }

    return {
      success: Boolean(result?.success),
      message: result?.message ?? "Could not update this booking.",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
};
