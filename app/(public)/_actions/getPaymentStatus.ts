import type { IPaymentStatus } from "@/lib/types";
import { authorizedRequest } from "@/service/authorizedRequest";

export const getPaymentStatus = async (
  bookingId: string
): Promise<IPaymentStatus | null> => {
  try {
    const result = await authorizedRequest(`/api/payment/${bookingId}/details`);
    const data = result?.data as { payment?: { status?: IPaymentStatus } };

    return data?.payment?.status ?? null;
  } catch {
    return null;
  }
};
