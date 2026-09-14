"use server";

import { revalidateTag } from "next/cache";

import { authorizedRequest } from "@/service/authorizedRequest";

export type TSlotFormState = {
  success: boolean;
  message: string;
} | null;

export const createSlots = async (
  prevState: TSlotFormState,
  formData: FormData
): Promise<TSlotFormState> => {
  const chosenDate = String(formData.get("date") ?? "");
  const startTime = String(formData.get("startTime") ?? "");
  const endTime = String(formData.get("endTime") ?? "");
  const slotDuration = Number(formData.get("slotDuration"));

  if (!chosenDate || !startTime || !endTime) {
    return { success: false, message: "Date, start and end time are required." };
  }

  if (startTime >= endTime) {
    return { success: false, message: "The end time must be after the start." };
  }

  if (!slotDuration || slotDuration <= 0) {
    return { success: false, message: "Slot length must be more than zero." };
  }

  const [year, month, day] = chosenDate.split("-");

  try {
    const result = await authorizedRequest("/api/technician/new_slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: `${month}/${day}/${year}`,
        startTime,
        endTime,
        slotDuration,
      }),
    });

    if (!result) {
      return { success: false, message: "You are not logged in." };
    }

    if (result.success) {
      revalidateTag("slots", { expire: 0 });
    }

    return {
      success: Boolean(result.success),
      message: (result.message as string) ?? "Could not create the slots.",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
};
