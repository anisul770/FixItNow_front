import type { IPaymentDetails } from "@/lib/types";

import { authorizedFetch } from "../authorizedFetch";

/** GET /api/admin/payments → data.payments — every payment, full nesting. */
export const getAllPayments = async (): Promise<IPaymentDetails[]> => {
  const data = await authorizedFetch<{ payments: IPaymentDetails[] }>(
    "/api/admin/payments"
  );

  return data?.payments ?? [];
};
