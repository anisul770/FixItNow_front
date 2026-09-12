"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

import type { TActiveStatus } from "@/lib/types";

/**
 * PATCH /api/admin/:userId/status with { activeStatus }.
 * `userId` is the USER id, not the technician profile id.
 */
export const updateUserStatus = async (
  userId: string,
  activeStatus: TActiveStatus
) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, message: "You are not logged in." };
  }

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/admin/${userId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ activeStatus }),
      }
    );

    const result = await res.json();

    if (result?.success) {
      revalidateTag("technicians",{
        expire :0
      });
      revalidateTag("admin-users",{
        expire:0
      });
    }

    return {
      success: Boolean(result?.success),
      message: result?.message ?? "Could not update this account.",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
};
