"use server";

import { revalidateTag } from "next/cache";

import { authorizedRequest } from "@/service/authorizedRequest";

export type TBookingState = { success: boolean; message: string } | null;

export const createBooking = async (
  prevState: TBookingState,
  formData: FormData
): Promise<TBookingState> => {
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

  if (Number.isNaN(new Date(chosenDate).getTime())) {
    return { success: false, message: "That date is not valid." };
  }

  try {
    const result = await authorizedRequest("/api/booking/new_booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId,
        bookingDate: chosenDate,
        startTime,
        address,
      }),
    });

    if (!result) {
      return { success: false, message: "Please log in to book a service." };
    }

    if (result.success) {
      revalidateTag(`slots-${serviceId}`, { expire: 0 });
      revalidateTag("my-profile", { expire: 0 });
    }

    return {
      success: Boolean(result.success),
      message: (result.message as string) ?? "Could not create this booking.",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
};
