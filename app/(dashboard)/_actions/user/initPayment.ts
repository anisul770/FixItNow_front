"use server";

import { cookies } from "next/headers";

export interface IInitPaymentResult {
  success: boolean;
  message: string;
  url: string | null;
}

/**
 * GET /api/payment/:bookingId/init — opens an SSLCommerz session and returns
 * the gateway payload as `data.apiResponse`. The controller does not redirect,
 * so the browser has to be sent to `GatewayPageURL` by the caller.
 *
 * Throws (as a 400) when the booking is not ACCEPTED, is already paid, or
 * belongs to another customer — so the message is what matters, not the status.
 */
export const initPayment = async (
  bookingId: string
): Promise<IInitPaymentResult> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, message: "You are not logged in.", url: null };
  }

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/payment/${bookingId}/init`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    const result = await res.json();
    const url: string | null = result?.data?.apiResponse?.GatewayPageURL ?? null;

    if (!url) {
      // Every backend error arrives as 400, so the message carries the reason:
      // already paid, not your booking, wrong booking status, not logged in.
      return {
        success: false,
        message:
          result?.message ?? "The payment gateway did not return a checkout link.",
        url: null,
      };
    }

    return {
      success: true,
      message: result?.message ?? "Redirecting to the payment gateway...",
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
