import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/service/getCurrentUser";
import { getMyPayments } from "../../_actions/(user)/getMyPayments";
import PayButton from "../../_components/PayButton";
import { PAYMENT_STATUS_UI, TONE_CLASSES } from "../../_config/payment";

export const metadata: Metadata = {
  title: "Payments | FixItNow",
  description: "Pay for accepted bookings and review your payment history.",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default async function PaymentsPage() {
  const result = await getCurrentUser();

  const user = result && "id" in result ? result : null;

  if (!user) redirect("/login");

  const payments = await getMyPayments();

  const paidBookingIds = new Set(
    payments
      .filter((payment) => payment.status === "COMPLETED")
      .map((payment) => payment.bookingId)
  );

  const payable = (user.customerBookings ?? []).filter(
    (booking) =>
      booking.status === "ACCEPTED" && !paidBookingIds.has(booking.id)
  );

  const totalPaid = payments
    .filter((payment) => payment.status === "COMPLETED")
    .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance">
          Payments
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pay for accepted bookings and review what you have already paid.
        </p>
      </header>

      <section>
        <h2 className="font-heading text-lg font-semibold tracking-tight">
          Awaiting payment
        </h2>

        {payable.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Nothing to pay right now. Once a technician accepts a booking it
            shows up here.{" "}
            <Link
              href="/services"
              className="text-foreground underline underline-offset-4"
            >
              Browse services
            </Link>
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {payable.map((booking) => (
              <li
                key={booking.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-card-foreground">
                    {formatDate(booking.bookingDate)} · {booking.startTime} –{" "}
                    {booking.endTime}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {booking.address}
                  </p>
                </div>

                <PayButton bookingId={booking.id} amount={booking.totalPrice} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Payment history
          </h2>
          {payments.length > 0 && (
            <span className="text-sm text-muted-foreground">
              ৳{totalPaid} paid in total
            </span>
          )}
        </div>

        {payments.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border px-6 py-12 text-center">
            <p className="font-heading text-base font-medium text-foreground">
              No payments yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Every attempt, settled or not, will be listed here.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Booked for</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Paid on</th>
                  <th className="px-4 py-3 font-medium">Transaction</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3 text-right font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => {
                  const ui = PAYMENT_STATUS_UI[payment.status];

                  return (
                    <tr
                      key={payment.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="max-w-44 truncate px-4 py-3 text-card-foreground">
                        {payment.booking?.service?.title ?? "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                        {payment.booking?.bookingDate
                          ? formatDate(payment.booking.bookingDate)
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
                            ui ? TONE_CLASSES[ui.tone] : TONE_CLASSES.neutral
                          }`}
                        >
                          {ui?.label ?? payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                        {payment.paidAt ? formatDate(payment.paidAt) : "—"}
                      </td>
                      <td className="max-w-40 truncate px-4 py-3 font-mono text-xs text-muted-foreground">
                        {payment.transactionId ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-card-foreground">
                        ৳{payment.amount}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {ui?.canRetry && (
                          <PayButton
                            bookingId={payment.bookingId}
                            amount={payment.amount}
                            label={
                              payment.status === "FAILED"
                                ? "Try again"
                                : "Resume payment"
                            }
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
