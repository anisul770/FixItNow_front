"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

/**
 * PUT /api/admin/:technicianId/verify_technician — no request body.
 * `technicianId` is the technician PROFILE id, not the user id.
 */
export const verifyTechnician = async (technicianId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, message: "You are not logged in." };
  }

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/admin/${technicianId}/verify_technician`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const result = await res.json();

    if (result?.success) {
      revalidateTag("technicians",{
        expire:0
      });
      revalidateTag("admin-users",{
        expire:0
      });
    }

    return {
      success: Boolean(result?.success),
      message: result?.message ?? "Could not approve this technician.",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
};
