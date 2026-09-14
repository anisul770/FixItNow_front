import type { IPaymentListItem } from "@/lib/types";

import { authorizedFetch } from "../authorizedFetch";

export const getMyPayments = async (): Promise<IPaymentListItem[]> => {
  const data = await authorizedFetch<{ payments: IPaymentListItem[] }>(
    "/api/payment/my_payments"
  );

  return data?.payments ?? [];
};
