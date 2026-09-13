import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/service/getCurrentUser";
import { getTechnicianBookings } from "../../_actions/technician/getTechnicianBookings";
import BookingStatusActions from "../../_components/BookingStatusActions";
import { BOOKING_STATUS_UI, TONE_CLASSES } from "../../_config/payment";

export const metadata: Metadata = {
  title: "Booking requests | FixItNow",
  description: "Accept, decline and progress the jobs customers book.",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default async function TechnicianBookingsPage() {
  const result = await getCurrentUser();

  // getCurrentUser answers with a failure object when there is no session.
  const user = result && "id" in result ? result : null;

  if (!user) redirect("/login");
  if (user.role !== "TECHNICIAN") redirect("/dashboard");

  const bookings = await getTechnicianBookings();

  // Anything needing a decision first, then the rest newest-first.
  const needsAction = new Set(["REQUESTED", "PAID", "IN_PROGRESS"]);
  const sorted = [...bookings].sort((a, b) => {
    const aUrgent = needsAction.has(a.status) ? 0 : 1;
    const bUrgent = needsAction.has(b.status) ? 0 : 1;

    if (aUrgent !== bUrgent) return aUrgent - bUrgent;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const requested = bookings.filter(
    (booking) => booking.status === "REQUESTED"
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance">
          Booking requests
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {bookings.length} total ·{" "}
          {requested === 0
            ? "nothing waiting on you"
            : `${requested} waiting on your decision`}
        </p>
      </header>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <p className="font-heading text-base font-medium text-foreground">
            No bookings yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Publish services and slots so customers can book you.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Address</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Price</th>
                <th className="px-4 py-3 text-right font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((booking) => {
                const ui = BOOKING_STATUS_UI[booking.status];

                return (
                  <tr
                    key={booking.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-card-foreground">
                      {booking.customer?.name ?? "—"}
                    </td>
                    <td className="max-w-40 truncate px-4 py-3 text-muted-foreground">
                      {booking.service?.title ?? "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {formatDate(booking.bookingDate)} · {booking.startTime}
                    </td>
                    <td className="max-w-40 truncate px-4 py-3 text-muted-foreground">
                      {booking.address}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
                          ui ? TONE_CLASSES[ui.tone] : TONE_CLASSES.neutral
                        }`}
                      >
                        {ui?.label ?? booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-card-foreground">
                      ৳{booking.totalPrice}
                    </td>
                    <td className="px-4 py-3">
                      <BookingStatusActions
                        bookingId={booking.id}
                        status={booking.status}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
