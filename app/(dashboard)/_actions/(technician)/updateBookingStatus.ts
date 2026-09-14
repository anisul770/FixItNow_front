"use server";

import { revalidateTag } from "next/cache";

import type { IBookingStatus } from "@/lib/types";
import { authorizedRequest } from "@/service/authorizedRequest";

export const updateBookingStatus = async (
  bookingId: string,
  status: IBookingStatus
) => {
  try {
    const result = await authorizedRequest(`/api/booking/${bookingId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!result) {
      return { success: false, message: "You are not logged in." };
    }

    if (result.success) {
      revalidateTag("slots", { expire: 0 });
    }

    return {
      success: Boolean(result.success),
      message: (result.message as string) ?? "Could not update this booking.",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
};
