"use server";

import { revalidateTag } from "next/cache";

import { authorizedRequest } from "@/service/authorizedRequest";

export type TReviewFormState = {
  success: boolean;
  message: string;
} | null;

export const createReview = async (
  prevState: TReviewFormState,
  formData: FormData
): Promise<TReviewFormState> => {
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
    const result = await authorizedRequest(`/api/review/${bookingId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });

    if (!result) {
      return { success: false, message: "You are not logged in." };
    }

    if (result.success) {
      revalidateTag("reviews", { expire: 0 });
      revalidateTag("technicians", { expire: 0 });
    }

    return {
      success: Boolean(result.success),
      message: (result.message as string) ?? "Could not save your review.",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
};
