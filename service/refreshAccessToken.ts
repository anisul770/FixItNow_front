import { cookies } from "next/headers";

const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24;

/**
 * POST /api/auth/refresh-token — the Postman request sends no body or headers,
 * so the backend reads the refresh token from the request cookie. The token is
 * also sent in the body as a fallback for implementations that expect it there.
 *
 * Returns the new access token, or null when the session cannot be revived.
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) return null;

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `refreshToken=${refreshToken}`,
        },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    const result = await res.json();
    const accessToken = result?.data?.accessToken;

    if (!accessToken) return null;

    try {
      cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        maxAge: ACCESS_TOKEN_MAX_AGE,
        sameSite: "lax",
      });
    } catch {
      // Cookies can only be written from a Server Action or Route Handler.
      // During a page render the new token still serves this request; the
      // next request refreshes again until one is written from an action.
    }

    return accessToken;
  } catch {
    return null;
  }
};
