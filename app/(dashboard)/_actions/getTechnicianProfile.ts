import type { ITechnicianProfile } from "@/lib/types";

import { authorizedFetch } from "./authorizedFetch";

/** GET /api/technician/profile → data.profile (includes user and services) */
export const getTechnicianProfile =
  async (): Promise<ITechnicianProfile | null> => {
    const data = await authorizedFetch<{ profile: ITechnicianProfile }>(
      "/api/technician/profile",
      ["technician-profile"]
    );

    return data?.profile ?? null;
  };
