"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export type TReviewFormState = {
  success: boolean;
  message: string;
} | null;

/** POST /api/review/:bookingId with { rating, comment } */
export const createReview = async (
  prevState: TReviewFormState,
  formData: FormData
): Promise<TReviewFormState> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, message: "You are not logged in." };
  }

  const bookingId = String(formData.get("bookingId") ?? "");
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") ?? "").trim();

  if (!bookingId || !rating) {
    return { success: false, message: "Please choose a rating." };
  }

  if (!comment) {
    return { success: false, message: "Please write a short comment." };
  }

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/review/${bookingId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ rating, comment }),
      }
    );

    const result = await res.json();

    if (result?.success) {
      // Shown on the public service and technician pages.
      revalidateTag("reviews", { expire: 0 });
      revalidateTag("technicians", { expire: 0 });
    }

    return {
      success: Boolean(result?.success),
      message: result?.message ?? "Could not save your review.",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
};
