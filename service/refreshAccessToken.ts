import { cookies } from "next/headers";

const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24;

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
    }

    return accessToken;
  } catch {
    return null;
  }
};
