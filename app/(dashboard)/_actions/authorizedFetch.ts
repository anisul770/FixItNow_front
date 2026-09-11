import { cookies } from "next/headers";

/**
 * Fetches a protected endpoint with the accessToken cookie attached and
 * unwraps `data`. Returns null on a missing session or any failure, so each
 * caller can fall back to its own empty state.
 */
export const authorizedFetch = async <TData>(
  path: string,
  tags: string[]
): Promise<TData | null> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) return null;

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        revalidate: 60,
        tags,
      },
    });

    if (!res.ok) return null;

    const result = await res.json();

    return result?.data ?? null;
  } catch {
    return null;
  }
};
