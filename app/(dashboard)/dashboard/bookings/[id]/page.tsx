import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/service/getCurrentUser";
import { getAllTechnicians } from "../../../_actions/(technician)/getAllTechnicians";
import { getBookingById } from "../../../_actions/(user)/getBookingById";
import { getPaymentDetails } from "../../../_actions/(user)/getPaymentDetails";
import PayButton from "../../../_components/PayButton";
import ReviewForm from "../../../_components/ReviewForm";
import {
  BOOKING_STATUS_UI,
  PAYMENT_STATUS_UI,
  TONE_CLASSES,
  canPayBooking,
} from "../../../_config/payment";

export const metadata: Metadata = {
  title: "Booking details | FixItNow",
  description: "Everything about this booking and the technician handling it.",
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

export default async function BookingDetailsPage(
  props: PageProps<"/dashboard/bookings/[id]">
) {
  const { id } = await props.params;

  const result = await getCurrentUser();

  const user = result && "id" in result ? result : null;

  if (!user) redirect("/login");

  const [booking, payment] = await Promise.all([
    getBookingById(id),
    getPaymentDetails(id),
  ]);

  if (!booking) notFound();

  const technicians = await getAllTechnicians();
  const technician = technicians.find(
    (item) => item.id === booking.technicianId
  );

  const technicianName =
    technician?.user?.name ?? booking.technician?.user?.name ?? "Technician";

  const statusUi = BOOKING_STATUS_UI[booking.status];
  const paymentUi = payment ? PAYMENT_STATUS_UI[payment.status] : null;

  const existingReview = user.customerReviews?.find(
    (review) => review.bookingId === booking.id
  );
  const canReview = booking.status === "COMPLETED";

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard/bookings"
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
            <h2 className="font-heading text-lg font-semibold tracking-tight">
              Payment
            </h2>

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
                <Row label="Method">
                  {payment.method
                    ? `${payment.method}${payment.methodType ? ` · ${payment.methodType}` : ""}`
                    : "—"}
                </Row>
                <Row label="Transaction">
                  <span className="font-mono text-xs">
                    {payment.transactionId ?? "—"}
                  </span>
                </Row>
              </dl>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                No payment started for this booking yet.
              </p>
            )}
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold tracking-tight">
              {existingReview ? "Your review" : "Leave a review"}
            </h2>

            {canReview ? (
              <div className="mt-3 rounded-xl border border-border bg-card p-5">
                {existingReview && (
                  <p className="mb-4 text-xs text-muted-foreground">
                    You reviewed this job on {formatDate(existingReview.createdAt)}
                    . Editing replaces what you wrote.
                  </p>
                )}

                <ReviewForm bookingId={booking.id} review={existingReview} />
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                You can review this job once the technician marks it complete.
              </p>
            )}
          </section>
        </div>

        <aside className="flex flex-col gap-4">
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

            {technician ? (
              <>
                <dl className="mt-4 border-t border-border pt-2 text-sm">
                  <Row label="Experience">{technician.experience} yrs</Row>
                  <Row label="Hourly rate">৳{technician.hourlyRate}</Row>
                  <Row label="Rating">
                    {technician.totalReviews > 0
                      ? `${technician.averageRating.toFixed(1)} (${technician.totalReviews})`
                      : "No ratings yet"}
                  </Row>
                </dl>

                {technician.bio && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {technician.bio}
                  </p>
                )}

                {technician.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {technician.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  href={`/technicians/${technician.id}`}
                  className={`mt-4 w-full ${buttonVariants({ variant: "outline", size: "sm" })}`}
                >
                  View full profile
                </Link>
              </>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                This technician&apos;s public profile is not available.
              </p>
            )}
          </div>

          {canPayBooking(booking.status, payment) && (
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">
                {payment?.status === "FAILED"
                  ? "The last attempt did not go through."
                  : "This booking is accepted and ready to pay."}
              </p>
              <div className="mt-3">
                <PayButton
                  bookingId={booking.id}
                  amount={booking.totalPrice}
                  label={payment?.status === "FAILED" ? "Try again" : undefined}
                />
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
