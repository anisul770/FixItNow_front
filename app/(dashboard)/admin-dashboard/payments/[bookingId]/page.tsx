import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/service/getCurrentUser";
import { getPaymentDetails } from "../../../_actions/(user)/getPaymentDetails";
import { BOOKING_STATUS_UI, PAYMENT_STATUS_UI, TONE_CLASSES } from "../../../_config/payment";

export const metadata: Metadata = {
  title: "Payment details | FixItNow Admin",
  description: "Full detail on one payment attempt.",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const Row = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex justify-between gap-4 border-b border-border py-2.5 last:border-0">
    <dt className="shrink-0 text-muted-foreground">{label}</dt>
    <dd className="text-right text-card-foreground">{children}</dd>
  </div>
);

export default async function AdminPaymentDetailsPage(
  props: PageProps<"/admin-dashboard/payments/[bookingId]">
) {
  const { bookingId } = await props.params;

  const result = await getCurrentUser();

  // getCurrentUser answers with a failure object when there is no session.
  const currentUser = result && "id" in result ? result : null;

  if (!currentUser) redirect("/login");
  if (currentUser.role !== "ADMIN") redirect("/dashboard");

  // GET /api/payment/:bookingId/details — the contract documents this as
  // CUSTOMER · ADMIN, admins seeing any booking's payment.
  const payment = await getPaymentDetails(bookingId);

  if (!payment) notFound();

  const paymentUi = PAYMENT_STATUS_UI[payment.status];
  const bookingUi = payment.booking
    ? BOOKING_STATUS_UI[payment.booking.status]
    : null;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin-dashboard/payments"
        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        ← Back to payments
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance">
            Payment for {payment.booking?.service?.title ?? "a booking"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Started {formatDate(payment.createdAt)}
          </p>
        </div>

        <span
          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap ${
            paymentUi ? TONE_CLASSES[paymentUi.tone] : TONE_CLASSES.neutral
          }`}
        >
          {paymentUi?.label ?? payment.status}
        </span>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-6">
          <section>
            <h2 className="font-heading text-lg font-semibold tracking-tight">
              Payment
            </h2>
            <dl className="mt-3 rounded-xl border border-border bg-card px-4 py-2 text-sm">
              <Row label="Amount">৳{payment.amount}</Row>
              <Row label="Provider">{payment.provider}</Row>
              {/* These four stay null until the payment settles. */}
              <Row label="Paid on">
                {payment.paidAt ? formatDate(payment.paidAt) : "—"}
              </Row>
              <Row label="Method">
                {payment.method
                  ? `${payment.method}${payment.methodType ? ` · ${payment.methodType}` : ""}`
                  : "—"}
              </Row>
              <Row label="Transaction ID">
                <span className="font-mono text-xs">
                  {payment.transactionId ?? "—"}
                </span>
              </Row>
              <Row label="Gateway session">
                <span className="font-mono text-xs">
                  {payment.paymentIntentId ?? "—"}
                </span>
              </Row>
            </dl>
          </section>

          {payment.booking && (
            <section>
              <h2 className="font-heading text-lg font-semibold tracking-tight">
                Booking
              </h2>
              <dl className="mt-3 rounded-xl border border-border bg-card px-4 py-2 text-sm">
                <Row label="Status">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
                      bookingUi
                        ? TONE_CLASSES[bookingUi.tone]
                        : TONE_CLASSES.neutral
                    }`}
                  >
                    {bookingUi?.label ?? payment.booking.status}
                  </span>
                </Row>
                <Row label="Date">{formatDate(payment.booking.bookingDate)}</Row>
                <Row label="Time">
                  {payment.booking.startTime} – {payment.booking.endTime}
                </Row>
                <Row label="Address">{payment.booking.address}</Row>
                <Row label="Total price">৳{payment.booking.totalPrice}</Row>
              </dl>
            </section>
          )}
        </div>

        <aside className="flex flex-col gap-4">
          {payment.booking && (
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Customer
              </p>
              <p className="mt-2 font-heading text-base font-semibold tracking-tight text-card-foreground">
                {payment.booking.customer.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {payment.booking.customer.email}
              </p>

              <p className="mt-4 border-t border-border pt-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Technician
              </p>
              <p className="mt-2 font-heading text-base font-semibold tracking-tight text-card-foreground">
                {payment.booking.technician?.user?.name ?? "—"}
              </p>

              <Link
                href={`/admin-dashboard/bookings/${payment.bookingId}`}
                className={`mt-4 w-full ${buttonVariants({ variant: "outline", size: "sm" })}`}
              >
                View full booking
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
