"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

/**
 * DELETE /api/technician/slots/:slotId.
 * The API refuses to delete a slot that is already booked.
 */
export const deleteSlot = async (slotId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, message: "You are not logged in." };
  }

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/technician/slots/${slotId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const result = await res.json();

    if (result?.success) {
      revalidateTag("slots", { expire: 0 });
    }

    return {
      success: Boolean(result?.success),
      message: result?.message ?? "Could not delete the slot.",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
};
