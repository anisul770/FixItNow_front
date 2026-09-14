import type { ITechnicianProfile } from "@/lib/types";

import { authorizedFetch } from "../authorizedFetch";

export const getTechnicianProfile =
  async (): Promise<ITechnicianProfile | null> => {
    const data = await authorizedFetch<{ profile: ITechnicianProfile }>(
      "/api/technician/profile"
    );

    return data?.profile ?? null;
  };
