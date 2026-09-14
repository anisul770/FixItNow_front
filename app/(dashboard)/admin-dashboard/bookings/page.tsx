import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { cn } from "@/lib/utils";
import type { IBookingStatus } from "@/lib/types";
import { getCurrentUser } from "@/service/getCurrentUser";
import { getAllBookings } from "../../_actions/(admin)/getAllBookings";
import { BOOKING_STATUS_UI, TONE_CLASSES } from "../../_config/payment";

export const metadata: Metadata = {
  title: "Bookings | FixItNow Admin",
  description: "Every booking on the platform.",
};

const ALL_STATUSES: IBookingStatus[] = [
  "REQUESTED",
  "ACCEPTED",
  "DECLINED",
  "PAID",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const isBookingStatus = (value: string): value is IBookingStatus =>
  (ALL_STATUSES as string[]).includes(value);

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default async function AdminBookingsPage(
  props: PageProps<"/admin-dashboard/bookings">
) {
  const result = await getCurrentUser();

  const currentUser = result && "id" in result ? result : null;

  if (!currentUser) redirect("/login");

  const searchParams = await props.searchParams;
  const statusParam = searchParams.status;
  const rawStatus = Array.isArray(statusParam) ? statusParam[0] : statusParam;
  const activeStatus =
    rawStatus && isBookingStatus(rawStatus) ? rawStatus : null;

  const allBookings = await getAllBookings();
  const bookings = activeStatus
    ? allBookings.filter((booking) => booking.status === activeStatus)
    : allBookings;

  const sorted = [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const value = bookings.reduce(
    (sum, booking) => sum + (Number(booking.totalPrice) || 0),
    0
  );

  const countFor = (status: IBookingStatus) =>
    allBookings.filter((booking) => booking.status === status).length;

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

      <div
        className="flex flex-wrap gap-2 overflow-x-auto pb-1"
        role="group"
        aria-label="Filter bookings by status"
      >
        <Link
          href="/admin-dashboard/bookings"
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
            !activeStatus
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border bg-card text-muted-foreground hover:bg-muted"
          )}
        >
          All
          <span className="tabular-nums opacity-70">{allBookings.length}</span>
        </Link>

        {ALL_STATUSES.map((status) => (
          <Link
            key={status}
            href={`/admin-dashboard/bookings?status=${status}`}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
              activeStatus === status
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-muted"
            )}
          >
            {BOOKING_STATUS_UI[status].label}
            <span className="tabular-nums opacity-70">{countFor(status)}</span>
          </Link>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <p className="font-heading text-base font-medium text-foreground">
            No bookings found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeStatus
              ? "No bookings currently have this status."
              : "Either nobody has booked yet, or the admin endpoint returned nothing."}
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
                      <Link
                        href={`/admin-dashboard/bookings/${booking.id}`}
                        className="hover:underline"
                      >
                        {booking.customer?.name ?? "—"}
                      </Link>
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
                      <Link
                        href={`/admin-dashboard/bookings/${booking.id}`}
                        className="hover:underline"
                      >
                        ৳{booking.totalPrice}
                      </Link>
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
