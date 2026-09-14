import type { IUser } from "@/lib/types";

import { authorizedFetch } from "../authorizedFetch";

export const getAllUsers = async (): Promise<IUser[]> => {
  const data = await authorizedFetch<{ users: IUser[] }>("/api/admin/users");

  return data?.users ?? [];
};
