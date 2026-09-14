import type { IPaymentListItem } from "@/lib/types";

import { authorizedFetch } from "../authorizedFetch";

/** GET /api/payment/my_payments → data.payments — newest first, slim nesting. */
export const getMyPayments = async (): Promise<IPaymentListItem[]> => {
  const data = await authorizedFetch<{ payments: IPaymentListItem[] }>(
    "/api/payment/my_payments"
  );

  return data?.payments ?? [];
};
