import type { Metadata } from "next";

import PaymentResult from "../../../_components/PaymentResult";

export const metadata: Metadata = {
  title: "Payment successful | FixItNow",
  description: "Your booking has been paid.",
};

/** Where the gateway's success callback should send the customer. */
export default async function PaymentSuccessPage(
  props: PageProps<"/payment/[bookingId]/success">
) {
  const { bookingId } = await props.params;

  return <PaymentResult variant="success" bookingId={bookingId} />;
}
