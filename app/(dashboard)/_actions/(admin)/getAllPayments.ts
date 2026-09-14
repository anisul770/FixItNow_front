import type { IPaymentDetails } from "@/lib/types";

import { authorizedFetch } from "../authorizedFetch";

export const getAllPayments = async (): Promise<IPaymentDetails[]> => {
  const data = await authorizedFetch<{ payments: IPaymentDetails[] }>(
    "/api/admin/payments"
  );

  return data?.payments ?? [];
};
