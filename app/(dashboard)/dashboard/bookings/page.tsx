import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/service/getCurrentUser";
import { BOOKING_STATUS_UI, TONE_CLASSES } from "../../_config/payment";

export const metadata: Metadata = {
  title: "My bookings | FixItNow",
  description: "Every service you have booked, and how each one is going.",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default async function BookingsPage() {
  const result = await getCurrentUser();

  // getCurrentUser answers with a failure object when there is no session.
  const user = result && "id" in result ? result : null;

  if (!user) redirect("/login");

  const bookings = [...(user.customerBookings ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance">
            My bookings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {bookings.length === 0
              ? "You have not booked a service yet."
              : `${bookings.length} booking${bookings.length === 1 ? "" : "s"}, newest first.`}
          </p>
        </div>

        <Link href="/services" className={buttonVariants()}>
          Book a service
        </Link>
      </header>

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <p className="font-heading text-base font-medium text-foreground">
            Nothing booked yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse services to book your first technician.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {bookings.map((booking) => {
            const ui = BOOKING_STATUS_UI[booking.status];

            return (
              <li key={booking.id}>
                <Link
                  href={`/dashboard/bookings/${booking.id}`}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-muted"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-card-foreground">
                      {booking.service?.title ?? "Service"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatDate(booking.bookingDate)} · {booking.startTime} –{" "}
                      {booking.endTime}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {booking.address}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
                        ui ? TONE_CLASSES[ui.tone] : TONE_CLASSES.neutral
                      }`}
                    >
                      {ui?.label ?? booking.status}
                    </span>
                    <span className="text-sm font-medium tabular-nums text-card-foreground">
                      ৳{booking.totalPrice}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
