import type { ISlot } from "@/lib/types";

import { authorizedFetch } from "../authorizedFetch";

export const getMySlots = async (): Promise<ISlot[]> => {
  const data = await authorizedFetch<{ slots: ISlot[] }>(
    "/api/technician/my_slots"
  );

  return data?.slots ?? [];
};
