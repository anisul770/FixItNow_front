"use server";

import { revalidateTag } from "next/cache";

import { authorizedRequest } from "@/service/authorizedRequest";

export type TServiceFormState = {
  success: boolean;
  message: string;
} | null;

export const createService = async (
  prevState: TServiceFormState,
  formData: FormData
): Promise<TServiceFormState> => {
  const payload = {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    categoryId: String(formData.get("categoryId") ?? ""),
    price: Number(formData.get("price")),
    duration: Number(formData.get("duration")),
  };

  if (!payload.title || !payload.categoryId) {
    return { success: false, message: "Title and category are required." };
  }

  try {
    const result = await authorizedRequest("/api/technician/new_service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!result) {
      return { success: false, message: "You are not logged in." };
    }

    if (result.success) {
      revalidateTag("services", { expire: 0 });
    }

    return {
      success: Boolean(result.success),
      message: (result.message as string) ?? "Could not create the service.",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
};
