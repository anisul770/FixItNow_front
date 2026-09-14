import type { IService } from "@/lib/types";

import { getAllServices } from "./getAllServices";

export const getServiceById = async (id: string): Promise<IService | null> => {
  const services = await getAllServices({ limit: "1000" });

  return services.find((service) => service.id === id) ?? null;
};
