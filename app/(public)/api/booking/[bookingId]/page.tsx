import type { Metadata } from "next";

import { getPaymentStatus } from "../../../_actions/getPaymentStatus";
import PaymentResult from "../../../_components/PaymentResult";

export const metadata: Metadata = {
  title: "Payment result | FixItNow",
  description: "The outcome of your payment.",
};

export default async function PaymentCallbackPage(
  props: PageProps<"/api/booking/[bookingId]">
) {
  const { bookingId } = await props.params;

  const status = await getPaymentStatus(bookingId);

  const variant = status === "COMPLETED" ? "success" : "fail";

  return <PaymentResult variant={variant} bookingId={bookingId} />;
}
