import { cookies } from "next/headers";

import { refreshAccessToken } from "./refreshAccessToken";

export type TApiResult = {
  success?: boolean;
  message?: string;
  data?: unknown;
} & Record<string, unknown>;

export const authorizedRequest = async (
  path: string,
  init: RequestInit = {}
): Promise<TApiResult | null> => {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    accessToken = (await refreshAccessToken()) ?? undefined;
  }

  if (!accessToken) return null;

  const attempt = (token: string) =>
    fetch(`${process.env.BACKEND_API_URL}${path}`, {
      ...init,
      headers: {
        ...(init.headers as Record<string, string> | undefined),
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

  let res = await attempt(accessToken);

  if (!res.ok) {
    const refreshedToken = await refreshAccessToken();

    if (refreshedToken) {
      res = await attempt(refreshedToken);
    }
  }

  return await res.json();
};
