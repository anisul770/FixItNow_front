"use server";

import { refresh, revalidatePath } from "next/cache";

import { authorizedRequest } from "@/service/authorizedRequest";

export type TProfileState = { success: boolean; message: string } | null;

export const updateProfile = async (
  prevState: TProfileState,
  formData: FormData
): Promise<TProfileState> => {
  const payload = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
  };

  try {
    const result = await authorizedRequest("/api/users/my-profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!result) {
      return { success: false, message: "You are not logged in." };
    }

    if (result.success) {
      revalidatePath("/", "layout");
      refresh();
    }

    return {
      success: Boolean(result.success),
      message: (result.message as string) ?? "Could not update your profile.",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
};
