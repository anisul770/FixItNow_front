import type { ITechnicianProfile } from "@/lib/types";

import { getAllTechnicians } from "./getAllTechnicians";

/**
 * The API exposes no public single-technician endpoint, so this narrows the
 * cached /api/technician/all list. `id` is the technician PROFILE id.
 */
export const getTechnicianById = async (
  id: string
): Promise<ITechnicianProfile | null> => {
  const technicians = await getAllTechnicians();

  return technicians.find((technician) => technician.id === id) ?? null;
};
