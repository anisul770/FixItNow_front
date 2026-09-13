"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export type TSlotFormState = {
  success: boolean;
  message: string;
} | null;

/**
 * POST /api/technician/new_slots with { date, startTime, endTime, slotDuration }.
 * Carves the window into slots of `slotDuration` minutes.
 *
 * The API was built against MM/DD/YYYY dates, so the YYYY-MM-DD a date input
 * produces is converted rather than sent as-is.
 */
export const createSlots = async (
  prevState: TSlotFormState,
  formData: FormData
): Promise<TSlotFormState> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, message: "You are not logged in." };
  }

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
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/technician/new_slots`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          date: `${month}/${day}/${year}`,
          startTime,
          endTime,
          slotDuration,
        }),
      }
    );

    const result = await res.json();

    if (result?.success) {
      // Availability shown on the public service pages.
      revalidateTag("slots", { expire: 0 });
    }

    return {
      success: Boolean(result?.success),
      message: result?.message ?? "Could not create the slots.",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
};
