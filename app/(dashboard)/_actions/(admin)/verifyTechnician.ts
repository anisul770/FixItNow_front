"use server";

import { revalidateTag } from "next/cache";

import { authorizedRequest } from "@/service/authorizedRequest";

export const verifyTechnician = async (technicianId: string) => {
  try {
    const result = await authorizedRequest(
      `/api/admin/${technicianId}/verify_technician`,
      { method: "PUT" }
    );

    if (!result) {
      return { success: false, message: "You are not logged in." };
    }

    if (result.success) {
      revalidateTag("technicians", { expire: 0 });
      revalidateTag("admin-users", { expire: 0 });
    }

    return {
      success: Boolean(result.success),
      message: (result.message as string) ?? "Could not approve this technician.",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
};
