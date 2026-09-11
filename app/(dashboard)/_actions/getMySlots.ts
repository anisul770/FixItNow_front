import type { ISlot } from "@/lib/types";

import { authorizedFetch } from "./authorizedFetch";

/** GET /api/technician/my_slots → data.slots */
export const getMySlots = async (): Promise<ISlot[]> => {
  const data = await authorizedFetch<{ slots: ISlot[] }>(
    "/api/technician/my_slots",
    ["my-slots"]
  );

  return data?.slots ?? [];
};
