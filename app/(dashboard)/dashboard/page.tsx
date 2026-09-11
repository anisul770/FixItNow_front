import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import type { IBooking, TBookingStatus } from "@/lib/types";
import { getCurrentUser } from "@/service/getCurrentUser";

export const metadata: Metadata = {
  title: "Dashboard | FixItNow",
  description: "Your bookings, spending and reviews at a glance.",
};

const STATUS_STYLES: Record<TBookingStatus, string> = {
  PENDING: "bg-muted text-muted-foreground",
  ACCEPTED: "bg-primary/15 text-foreground",
  COMPLETED: "bg-chart-3/15 text-foreground",
  PAID: "bg-chart-3/15 text-foreground",
  CANCELLED: "bg-destructive/10 text-destructive",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const StatTile = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border border-border bg-card p-4">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="mt-1 font-heading text-2xl font-semibold tracking-tight text-card-foreground">
      {value}
    </p>
  </div>
);

const StatusBadge = ({ status }: { status: TBookingStatus }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status] ?? "bg-muted text-muted-foreground"}`}
  >
    {status.charAt(0) + status.slice(1).toLowerCase()}
  </span>
);

export default async function DashboardPage() {
  const result = await getCurrentUser();

  // getCurrentUser answers with a failure object when there is no session.
  const user = result && "id" in result ? result : null;

  if (!user) redirect("/login");

  const bookings: IBooking[] = user.customerBookings ?? [];
  const reviews = user.customerReviews ?? [];

  const settled = bookings.filter(
    (booking) => booking.status === "COMPLETED" || booking.status === "PAID"
  );
  const active = bookings.filter(
    (booking) => booking.status === "PENDING" || booking.status === "ACCEPTED"
  );
  const totalSpent = settled.reduce(
    (sum, booking) => sum + booking.totalPrice,
    0
  );

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance">
            Welcome back, {user.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here is where your bookings and spending stand.
          </p>
        </div>

        <Link href="/services" className={buttonVariants()}>
          Book a service
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total bookings" value={String(bookings.length)} />
        <StatTile label="In progress" value={String(active.length)} />
        <StatTile label="Completed" value={String(settled.length)} />
        <StatTile label="Total spent" value={`৳${totalSpent}`} />
      </section>

      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Recent bookings
          </h2>
          {bookings.length > 5 && (
            <span className="text-sm text-muted-foreground">
              Showing 5 of {bookings.length}
            </span>
          )}
        </div>

        {recentBookings.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border px-6 py-12 text-center">
            <p className="font-heading text-base font-medium text-foreground">
              No bookings yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse services to book your first technician.
            </p>
            <Link
              href="/services"
              className={`mt-4 ${buttonVariants({ variant: "outline", size: "sm" })}`}
            >
              Browse services
            </Link>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Address</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-card-foreground">
                      {formatDate(booking.bookingDate)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {booking.startTime} – {booking.endTime}
                    </td>
                    <td className="max-w-48 truncate px-4 py-3 text-muted-foreground">
                      {booking.address}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-card-foreground">
                      ৳{booking.totalPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <section>
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Your reviews
          </h2>

          {reviews.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              You have not reviewed a completed booking yet.
            </p>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {reviews.slice(0, 3).map((review) => (
                <li
                  key={review.id}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-card-foreground">
                      {review.rating} / 5
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {review.comment}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside>
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Profile
          </h2>

          <dl className="mt-4 rounded-xl border border-border bg-card p-4 text-sm">
            <div className="flex justify-between gap-3 py-1.5">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="truncate text-card-foreground">{user.email}</dd>
            </div>
            <div className="flex justify-between gap-3 py-1.5">
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="text-card-foreground">
                {user.profile?.phone ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-3 py-1.5">
              <dt className="text-muted-foreground">Address</dt>
              <dd className="truncate text-card-foreground">
                {user.profile?.address ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-3 py-1.5">
              <dt className="text-muted-foreground">Member since</dt>
              <dd className="text-card-foreground">
                {formatDate(user.createdAt)}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
