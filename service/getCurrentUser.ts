import { cookies } from "next/headers";
import { cache } from "react";

import type { IUser } from "@/lib/types";

import { refreshAccessToken } from "./refreshAccessToken";

type TSessionError = { success: boolean; message: string };

const fetchMe = (accessToken: string) =>
  fetch(`${process.env.BACKEND_API_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

export const getCurrentUser = cache(
  async (): Promise<IUser | TSessionError> => {
    const cookieStore = await cookies();
    let accessToken: string | undefined = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      accessToken = (await refreshAccessToken()) ?? undefined;
    }

    if (!accessToken) {
      return {
        success: false,
        message: "User not logged in!",
      };
    }

    try {
      let res = await fetchMe(accessToken);

      if (!res.ok) {
        const refreshedToken = await refreshAccessToken();

        if (refreshedToken) {
          res = await fetchMe(refreshedToken);
        }
      }

      if (!res.ok) {
        return {
          success: false,
          message: "Your session has expired. Please log in again.",
        };
      }

      const result = await res.json();

      return (
        result?.data?.profile ?? {
          success: false,
          message: "Could not load your profile.",
        }
      );
    } catch {
      return {
        success: false,
        message: "Could not reach the server.",
      };
    }
  }
);
