import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/service/getCurrentUser";
import { getAllBookings } from "../../../_actions/(admin)/getAllBookings";
import { getAllTechnicians } from "../../../_actions/(technician)/getAllTechnicians";
import { getPaymentDetails } from "../../../_actions/(user)/getPaymentDetails";
import { BOOKING_STATUS_UI, PAYMENT_STATUS_UI, TONE_CLASSES } from "../../../_config/payment";

export const metadata: Metadata = {
  title: "Booking details | FixItNow Admin",
  description: "Full detail on one booking — customer, technician and payment.",
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

export default async function AdminBookingDetailsPage(
  props: PageProps<"/admin-dashboard/bookings/[id]">
) {
  const { id } = await props.params;

  const result = await getCurrentUser();

  // getCurrentUser answers with a failure object when there is no session.
  const currentUser = result && "id" in result ? result : null;

  if (!currentUser) redirect("/login");
  if (currentUser.role !== "ADMIN") redirect("/dashboard");

  // GET /api/booking/:id is scoped to the booking's own customer, so an
  // admin's token gets refused there. /api/admin/bookings is what actually
  // grants admin visibility into any booking — find this one in that list.
  const [allBookings, payment, technicians] = await Promise.all([
    getAllBookings(),
    getPaymentDetails(id),
    getAllTechnicians(),
  ]);

  const booking = allBookings.find((item) => item.id === id) ?? null;

  if (!booking) notFound();

  const technician = technicians.find(
    (item) => item.id === booking.technicianId
  );
  const technicianName =
    technician?.user?.name ?? booking.technician?.user?.name ?? "Technician";
  const customerName = booking.customer?.name ?? "Customer";

  const statusUi = BOOKING_STATUS_UI[booking.status];
  const paymentUi = payment ? PAYMENT_STATUS_UI[payment.status] : null;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin-dashboard/bookings"
        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        ← Back to bookings
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance">
            {booking.service?.title ?? "Booking"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Booked on {formatDate(booking.createdAt)}
          </p>
        </div>

        <span
          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap ${
            statusUi ? TONE_CLASSES[statusUi.tone] : TONE_CLASSES.neutral
          }`}
        >
          {statusUi?.label ?? booking.status}
        </span>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-6">
          <section>
            <h2 className="font-heading text-lg font-semibold tracking-tight">
              Appointment
            </h2>
            <dl className="mt-3 rounded-xl border border-border bg-card px-4 py-2 text-sm">
              <Row label="Date">{formatDate(booking.bookingDate)}</Row>
              <Row label="Time">
                {booking.startTime} – {booking.endTime}
              </Row>
              <Row label="Address">{booking.address}</Row>
              {booking.problemDescription && (
                <Row label="Problem">{booking.problemDescription}</Row>
              )}
              <Row label="Total">৳{booking.totalPrice}</Row>
            </dl>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold tracking-tight">
              Service
            </h2>
            <dl className="mt-3 rounded-xl border border-border bg-card px-4 py-2 text-sm">
              <Row label="Title">{booking.service?.title ?? "—"}</Row>
              {booking.service?.description && (
                <Row label="Description">{booking.service.description}</Row>
              )}
              <Row label="Duration">
                {booking.service?.duration
                  ? `${booking.service.duration} min`
                  : "—"}
              </Row>
              <Row label="Price">
                {booking.service?.price != null
                  ? `৳${booking.service.price}`
                  : "—"}
              </Row>
            </dl>
          </section>

          <section>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-heading text-lg font-semibold tracking-tight">
                Payment
              </h2>
              {payment && (
                <Link
                  href={`/admin-dashboard/payments/${booking.id}`}
                  className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Full payment details →
                </Link>
              )}
            </div>

            {payment ? (
              <dl className="mt-3 rounded-xl border border-border bg-card px-4 py-2 text-sm">
                <Row label="Status">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
                      paymentUi
                        ? TONE_CLASSES[paymentUi.tone]
                        : TONE_CLASSES.neutral
                    }`}
                  >
                    {paymentUi?.label ?? payment.status}
                  </span>
                </Row>
                <Row label="Amount">৳{payment.amount}</Row>
                <Row label="Paid on">
                  {payment.paidAt ? formatDate(payment.paidAt) : "—"}
                </Row>
              </dl>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                No payment started for this booking yet.
              </p>
            )}
          </section>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Customer
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {customerName.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate font-heading text-base font-semibold tracking-tight text-card-foreground">
                  {customerName}
                </p>
                {booking.customer?.email && (
                  <p className="truncate text-xs text-muted-foreground">
                    {booking.customer.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Technician
            </p>

            <div className="mt-3 flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {technicianName.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 truncate font-heading text-base font-semibold tracking-tight text-card-foreground">
                  {technicianName}
                  {technician?.verified && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-label="Verified"
                      className="size-3.5 shrink-0 text-primary"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </p>
                {technician?.location && (
                  <p className="truncate text-xs text-muted-foreground">
                    {technician.location}
                  </p>
                )}
              </div>
            </div>

            {technician && (
              <dl className="mt-4 border-t border-border pt-2 text-sm">
                <Row label="Experience">{technician.experience} yrs</Row>
                <Row label="Hourly rate">৳{technician.hourlyRate}</Row>
                <Row label="Rating">
                  {technician.totalReviews > 0
                    ? `${technician.averageRating.toFixed(1)} (${technician.totalReviews})`
                    : "No ratings yet"}
                </Row>
              </dl>
            )}

            {technician && (
              <Link
                href={`/technicians/${technician.id}`}
                className={`mt-4 w-full ${buttonVariants({ variant: "outline", size: "sm" })}`}
              >
                View public profile
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
