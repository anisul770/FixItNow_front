import { cookies } from "next/headers";

/**
 * Fetches a protected endpoint with the accessToken cookie attached and
 * unwraps `data`. Returns null on a missing session or any failure, so each
 * caller can fall back to its own empty state.
 *
 * Never cached: every response here is specific to the signed-in user, and a
 * dashboard showing another request's data — or data from before a mutation —
 * is worse than the round trip it saves.
 */
export const authorizedFetch = async <TData>(
  path: string
): Promise<TData | null> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) return null;

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const result = await res.json();

    return result?.data ?? null;
  } catch {
    return null;
  }
};
