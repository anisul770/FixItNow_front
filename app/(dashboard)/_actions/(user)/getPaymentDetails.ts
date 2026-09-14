import type { IPaymentDetails } from "@/lib/types";

import { authorizedFetch } from "../authorizedFetch";

export const getPaymentDetails = async (
  bookingId: string
): Promise<IPaymentDetails | null> => {
  const data = await authorizedFetch<{ payment: IPaymentDetails }>(
    `/api/payment/${bookingId}/details`
  );

  return data?.payment ?? null;
};
