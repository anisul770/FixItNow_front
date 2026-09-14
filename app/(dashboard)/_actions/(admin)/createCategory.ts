"use server";

import { revalidateTag } from "next/cache";

import { authorizedRequest } from "@/service/authorizedRequest";

export type TCategoryFormState = {
  success: boolean;
  message: string;
} | null;

export const createCategory = async (
  prevState: TCategoryFormState,
  formData: FormData
): Promise<TCategoryFormState> => {
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    return { success: false, message: "Give the category a name." };
  }

  try {
    const result = await authorizedRequest("/api/admin/new_category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!result) {
      return { success: false, message: "You are not logged in." };
    }

    if (result.success) {
      revalidateTag("categories", { expire: 0 });
    }

    return {
      success: Boolean(result.success),
      message: (result.message as string) ?? "Could not create the category.",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
};
