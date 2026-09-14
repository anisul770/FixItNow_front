import type { ITechnicianProfile } from "@/lib/types";

import { getAllTechnicians } from "./getAllTechnicians";

export const getTechnicianById = async (
  id: string
): Promise<ITechnicianProfile | null> => {
  const technicians = await getAllTechnicians();

  return technicians.find((technician) => technician.id === id) ?? null;
};
