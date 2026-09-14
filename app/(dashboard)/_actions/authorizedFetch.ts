import { authorizedRequest } from "@/service/authorizedRequest";

export const authorizedFetch = async <TData>(
  path: string
): Promise<TData | null> => {
  try {
    const result = await authorizedRequest(path);

    return (result?.data as TData) ?? null;
  } catch {
    return null;
  }
};
