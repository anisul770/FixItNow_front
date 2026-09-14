"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export type TServiceFormState = {
  success: boolean;
  message: string;
} | null;

/** POST /api/technician/new_service with { title, description, categoryId, price, duration } */
export const createService = async (
  prevState: TServiceFormState,
  formData: FormData
): Promise<TServiceFormState> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, message: "You are not logged in." };
  }

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
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/technician/new_service`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await res.json();

    if (result?.success) {
      // The public service browser caches this list.
      revalidateTag("services", { expire: 0 });
    }

    return {
      success: Boolean(result?.success),
      message: result?.message ?? "Could not create the service.",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
};
