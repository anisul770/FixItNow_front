"use server";

import { cookies } from "next/headers";

export type TProfileState = { success: boolean; message: string } | null;

/** PUT /api/users/my-profile with { name, phone, address } → data.updatedUser */
export const updateProfile = async (
  prevState: TProfileState,
  formData: FormData
): Promise<TProfileState> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, message: "You are not logged in." };
  }

  const payload = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
  };

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/users/my-profile`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await res.json();

    console.log("updateProfile:", res.status, result);

    return {
      success: Boolean(result?.success),
      message: result?.message ?? "Could not update your profile.",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
};
