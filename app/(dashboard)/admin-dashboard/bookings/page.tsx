import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/service/getCurrentUser";
import { getAllBookings } from "../../_actions/admin/getAllBookings";
import { BOOKING_STATUS_UI, TONE_CLASSES } from "../../_config/payment";

export const metadata: Metadata = {
  title: "Bookings | FixItNow Admin",
  description: "Every booking on the platform.",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default async function AdminBookingsPage() {
  const result = await getCurrentUser();

  // getCurrentUser answers with a failure object when there is no session.
  const currentUser = result && "id" in result ? result : null;

  if (!currentUser) redirect("/login");
  if (currentUser.role !== "ADMIN") redirect("/dashboard");

  const bookings = await getAllBookings();

  const sorted = [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const value = bookings.reduce(
    (sum, booking) => sum + (Number(booking.totalPrice) || 0),
    0
  );

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin-dashboard"
        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        ← Back to dashboard
      </Link>

      <header>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance">
          Bookings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {bookings.length} booking{bookings.length === 1 ? "" : "s"} · ৳{value}{" "}
          booked in total
        </p>
      </header>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <p className="font-heading text-base font-medium text-foreground">
            No bookings found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Either nobody has booked yet, or the admin endpoint returned
            nothing.
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
