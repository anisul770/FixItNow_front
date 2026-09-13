import { cookies } from "next/headers";

import type { IUser } from "@/lib/types";

import { refreshAccessToken } from "./refreshAccessToken";

type TSessionError = { success: boolean; message: string };

/** Session state is never cached — a stale entry keeps the app looking
 * logged in long after the token stops working. */
const fetchMe = (accessToken: string) =>
  fetch(`${process.env.BACKEND_API_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

/**
 * Resolves the signed-in user from the accessToken cookie, falling back to the
 * refresh token when the access token is missing or rejected.
 */
export const getCurrentUser = async (): Promise<IUser | TSessionError> => {
  const cookieStore = await cookies();
  let accessToken: string | undefined = cookieStore.get("accessToken")?.value;

  // The access cookie can expire while the refresh cookie is still good.
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

    // The global error handler answers 400 for everything, auth failures
    // included, so a rejected token never arrives as 401 — retry on any
    // failure rather than branching on the status code.
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
};
