import type { ITechnicianProfile } from "@/lib/types";

import { authorizedFetch } from "../authorizedFetch";

export const getAllTechnicians = async (): Promise<ITechnicianProfile[]> => {
  const data = await authorizedFetch<{ technicians: ITechnicianProfile[] }>(
    "/api/technician/all"
  );

  return data?.technicians ?? [];
};
