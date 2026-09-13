import type { Metadata } from "next";

import PaymentResult from "../../../_components/PaymentResult";

export const metadata: Metadata = {
  title: "Payment failed | FixItNow",
  description: "The payment did not go through.",
};

/** Where the gateway's fail callback should send the customer. */
export default async function PaymentFailPage(
  props: PageProps<"/payment/[bookingId]/fail">
) {
  const { bookingId } = await props.params;

  return <PaymentResult variant="fail" bookingId={bookingId} />;
}
