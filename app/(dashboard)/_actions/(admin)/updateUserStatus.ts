"use server";

import { revalidateTag } from "next/cache";

import type { TActiveStatus } from "@/lib/types";
import { authorizedRequest } from "@/service/authorizedRequest";

export const updateUserStatus = async (
  userId: string,
  activeStatus: TActiveStatus
) => {
  try {
    const result = await authorizedRequest(`/api/admin/${userId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activeStatus }),
    });

    if (!result) {
      return { success: false, message: "You are not logged in." };
    }

    if (result.success) {
      revalidateTag("technicians", { expire: 0 });
      revalidateTag("admin-users", { expire: 0 });
    }

    return {
      success: Boolean(result.success),
      message: (result.message as string) ?? "Could not update this account.",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
};
