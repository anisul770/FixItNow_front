import type { Metadata } from "next";
import { redirect } from "next/navigation";

import type { IBookingStatus } from "@/lib/types";
import { getCurrentUser } from "@/service/getCurrentUser";
import { BOOKING_STATUS_UI, TONE_CLASSES } from "../_config/payment";
import { getMySlots } from "../_actions/(technician)/getMySlots";
import { getTechnicianBookings } from "../_actions/(technician)/getTechnicianBookings";
import { getTechnicianProfile } from "../_actions/(technician)/getTechnicianProfile";

export const metadata: Metadata = {
  title: "Technician dashboard | FixItNow",
  description: "Your incoming jobs, services, slots and earnings.",
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

const StatusBadge = ({ status }: { status: IBookingStatus }) => {
  const ui = BOOKING_STATUS_UI[status];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
        ui ? TONE_CLASSES[ui.tone] : TONE_CLASSES.neutral
      }`}
    >
      {ui?.label ?? status}
    </span>
  );
};

export default async function TechnicianDashboardPage() {
  const result = await getCurrentUser();

  // getCurrentUser answers with a failure object when there is no session.
  const user = result && "id" in result ? result : null;

  if (!user) redirect("/login");
  if (user.role !== "TECHNICIAN") redirect("/dashboard");

  const [profile, bookings, slots] = await Promise.all([
    getTechnicianProfile(),
    getTechnicianBookings(),
    getMySlots(),
  ]);

  const services = profile?.services ?? [];
  // A new booking arrives as REQUESTED and waits for the technician.
  const pending = bookings.filter((booking) => booking.status === "REQUESTED");
  const settled = bookings.filter(
    (booking) =>
      booking.status === "PAID" ||
      booking.status === "IN_PROGRESS" ||
      booking.status === "COMPLETED"
  );
  const earned = settled.reduce((sum, booking) => sum + booking.totalPrice, 0);
  const openSlots = slots.filter((slot) => !slot.isBooked);

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 6);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance">
            Welcome back, {user.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your incoming jobs, services and availability.
          </p>
        </div>

        {profile && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
              profile.verified
                ? "bg-chart-3/15 text-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {profile.verified ? "Verified technician" : "Pending verification"}
          </span>
        )}
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Pending requests" value={String(pending.length)} />
        <StatTile label="Completed jobs" value={String(settled.length)} />
        <StatTile label="Total earned" value={`৳${earned}`} />
        <StatTile
          label="Rating"
          value={
            profile && profile.totalReviews > 0
              ? `${profile.averageRating.toFixed(1)} / 5`
              : "No ratings"
          }
        />
      </section>

      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Booking requests
          </h2>
          {bookings.length > 6 && (
            <span className="text-sm text-muted-foreground">
              Showing 6 of {bookings.length}
            </span>
          )}
        </div>

        {recentBookings.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border px-6 py-12 text-center">
            <p className="font-heading text-base font-medium text-foreground">
              No bookings yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Publish services and slots so customers can book you.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Time</th>
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
                      {booking.customer?.name ?? "—"}
                    </td>
                    <td className="max-w-40 truncate px-4 py-3 text-muted-foreground">
                      {booking.service?.title ?? "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {formatDate(booking.bookingDate)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {booking.startTime} – {booking.endTime}
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
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-semibold tracking-tight">
              My services
            </h2>
            <span className="text-sm text-muted-foreground">
              {services.length} listed
            </span>
          </div>

          {services.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              You have not published any services yet.
            </p>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {services.map((service) => (
                <li
                  key={service.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-card-foreground">
                      {service.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {service.duration} min
                      {!service.isActive && " · inactive"}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium tabular-nums text-card-foreground">
                    ৳{service.price}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="flex flex-col gap-6">
          <div>
            <h2 className="font-heading text-lg font-semibold tracking-tight">
              Availability
            </h2>
            <dl className="mt-4 rounded-xl border border-border bg-card p-4 text-sm">
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-muted-foreground">Open slots</dt>
                <dd className="text-card-foreground">{openSlots.length}</dd>
              </div>
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-muted-foreground">Booked slots</dt>
                <dd className="text-card-foreground">
                  {slots.length - openSlots.length}
                </dd>
              </div>
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-muted-foreground">Total published</dt>
                <dd className="text-card-foreground">{slots.length}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="font-heading text-lg font-semibold tracking-tight">
              Profile
            </h2>
            <dl className="mt-4 rounded-xl border border-border bg-card p-4 text-sm">
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="truncate text-card-foreground">{user.email}</dd>
              </div>
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-muted-foreground">Experience</dt>
                <dd className="text-card-foreground">
                  {profile ? `${profile.experience} yrs` : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-muted-foreground">Hourly rate</dt>
                <dd className="text-card-foreground">
                  {profile ? `৳${profile.hourlyRate}` : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-muted-foreground">Reviews</dt>
                <dd className="text-card-foreground">
                  {profile?.totalReviews ?? 0}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
