import type { IService } from "@/lib/types";

import { getAllServices } from "./getAllServices";

/**
 * The API exposes no single-service endpoint, so this narrows the cached
 * /api/service/all list. Swap the body for a direct fetch if one is added.
 */
export const getServiceById = async (id: string): Promise<IService | null> => {
  const services = await getAllServices();

  return services.find((service) => service.id === id) ?? null;
};
