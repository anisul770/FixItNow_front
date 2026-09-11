import type { IUser } from "@/lib/types";

import { authorizedFetch } from "./authorizedFetch";

/** GET /api/admin/users → data.users (admin only) */
export const getAllUsers = async (): Promise<IUser[]> => {
  const data = await authorizedFetch<{ users: IUser[] }>("/api/admin/users", [
    "admin-users",
  ]);

  return data?.users ?? [];
};
