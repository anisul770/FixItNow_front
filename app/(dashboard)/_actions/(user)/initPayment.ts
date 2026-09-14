"use server";

import { authorizedRequest } from "@/service/authorizedRequest";

export interface IInitPaymentResult {
  success: boolean;
  message: string;
  url: string | null;
}

export const initPayment = async (
  bookingId: string
): Promise<IInitPaymentResult> => {
  try {
    const result = await authorizedRequest(`/api/payment/${bookingId}/init`);

    if (!result) {
      return { success: false, message: "You are not logged in.", url: null };
    }

    const data = result.data as { apiResponse?: { GatewayPageURL?: string } };
    const url: string | null = data?.apiResponse?.GatewayPageURL ?? null;

    if (!url) {
      return {
        success: false,
        message:
          (result.message as string) ??
          "The payment gateway did not return a checkout link.",
        url: null,
      };
    }

    return {
      success: true,
      message: (result.message as string) ?? "Redirecting to the payment gateway...",
      url,
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
      url: null,
    };
  }
};
