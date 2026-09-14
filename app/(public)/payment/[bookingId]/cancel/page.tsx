import type { Metadata } from "next";

import PaymentResult from "../../../_components/PaymentResult";

export const metadata: Metadata = {
  title: "Payment cancelled | FixItNow",
  description: "The payment was cancelled before it completed.",
};

export default async function PaymentCancelPage(
  props: PageProps<"/payment/[bookingId]/cancel">
) {
  const { bookingId } = await props.params;

  return <PaymentResult variant="cancel" bookingId={bookingId} />;
}
