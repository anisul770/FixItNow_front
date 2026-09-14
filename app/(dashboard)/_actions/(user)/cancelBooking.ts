"use server";

import { revalidateTag } from "next/cache";

import { authorizedRequest } from "@/service/authorizedRequest";

export const cancelBooking = async (bookingId: string) => {
  try {
    const result = await authorizedRequest(`/api/booking/${bookingId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });

    if (!result) {
      return { success: false, message: "You are not logged in." };
    }

    if (result.success) {
      revalidateTag("slots", { expire: 0 });
    }

    return {
      success: Boolean(result.success),
      message: (result.message as string) ?? "Could not cancel this booking.",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
};
