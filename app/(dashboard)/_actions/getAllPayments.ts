import type { IPayment } from "@/lib/types";

import { authorizedFetch } from "./authorizedFetch";

/** GET /api/admin/payments → data.payments (admin only) */
export const getAllPayments = async (): Promise<IPayment[]> => {
  const data = await authorizedFetch<{ payments: IPayment[] }>(
    "/api/admin/payments",
    ["admin-payments"]
  );

  return data?.payments ?? [];
};
