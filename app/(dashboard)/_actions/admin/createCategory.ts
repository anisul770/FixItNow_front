"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export type TCategoryFormState = {
  success: boolean;
  message: string;
} | null;

/** POST /api/admin/new_category with { name } */
export const createCategory = async (
  prevState: TCategoryFormState,
  formData: FormData
): Promise<TCategoryFormState> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, message: "You are not logged in." };
  }

  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    return { success: false, message: "Give the category a name." };
  }

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/admin/new_category`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name }),
      }
    );

    const result = await res.json();

    if (result?.success) {
      // Feeds the service browser filter and the technician's service form.
      revalidateTag("categories", { expire: 0 });
    }

    return {
      success: Boolean(result?.success),
      message: result?.message ?? "Could not create the category.",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
};
