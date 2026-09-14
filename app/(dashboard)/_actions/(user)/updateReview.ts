"use server";

import { revalidateTag } from "next/cache";

import { authorizedRequest } from "@/service/authorizedRequest";

import type { TReviewFormState } from "./createReview";

export const updateReview = async (
  prevState: TReviewFormState,
  formData: FormData
): Promise<TReviewFormState> => {
  const reviewId = String(formData.get("reviewId") ?? "");
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") ?? "").trim();

  if (!reviewId || !rating) {
    return { success: false, message: "Please choose a rating." };
  }

  if (!comment) {
    return { success: false, message: "Please write a short comment." };
  }

  try {
    const result = await authorizedRequest(`/api/review/${reviewId}`, {
      method: "PATCH",
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
      message: (result.message as string) ?? "Could not update your review.",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
};
