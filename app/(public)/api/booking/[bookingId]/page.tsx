import type { Metadata } from "next";

import { getPaymentStatus } from "../../../_actions/getPaymentStatus";
import PaymentResult from "../../../_components/PaymentResult";

export const metadata: Metadata = {
  title: "Payment result | FixItNow",
  description: "The outcome of your payment.",
};

/**
 * Where the SSLCommerz success, fail and cancel callbacks currently redirect
 * the customer: `${config.front_url}/api/booking/:booking_id`.
 *
 * All three land here, so the outcome is read from the payment row rather
 * than from the URL.
 */
export default async function PaymentCallbackPage(
  props: PageProps<"/api/booking/[bookingId]">
) {
  const { bookingId } = await props.params;

  const status = await getPaymentStatus(bookingId);

  // FAILED covers both a declined card and a cancelled checkout — the API
  // writes the same value for /fail and /cancel.
  const variant = status === "COMPLETED" ? "success" : "fail";

  return <PaymentResult variant={variant} bookingId={bookingId} />;
}
