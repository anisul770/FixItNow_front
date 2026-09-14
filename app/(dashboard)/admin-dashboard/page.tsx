import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import type { IBookingStatus } from "@/lib/types";
import { BOOKING_STATUS_UI, TONE_CLASSES } from "../_config/payment";
import { getCurrentUser } from "@/service/getCurrentUser";
import { getAllBookings } from "../_actions/(admin)/getAllBookings";
import { getAllPayments } from "../_actions/(admin)/getAllPayments";
import { getAllUsers } from "../_actions/(admin)/getAllUsers";
import UsersTable from "../_components/UsersTable";

export const metadata: Metadata = {
  title: "Admin dashboard | FixItNow",
  description: "Platform users, bookings and payments at a glance.",
};

const BOOKING_STATUSES: IBookingStatus[] = [
  "REQUESTED",
  "ACCEPTED",
  "DECLINED",
  "PAID",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const StatTile = ({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) => (
  <Link
    href={href}
    className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-muted"
  >
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="mt-1 font-heading text-2xl font-semibold tracking-tight text-card-foreground">
      {value}
    </p>
  </Link>
);

export default async function AdminDashboardPage() {
  const result = await getCurrentUser();

  // getCurrentUser answers with a failure object when there is no session.
  const user = result && "id" in result ? result : null;

  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");

  const [users, bookings, payments] = await Promise.all([
    getAllUsers(),
    getAllBookings(),
    getAllPayments(),
  ]);

  const technicians = users.filter((item) => item.role === "TECHNICIAN");
  const customers = users.filter((item) => item.role === "CUSTOMER");
  const blocked = users.filter((item) => item.activeStatus === "BLOCKED");

  // Only COMPLETED payments have actually settled.
  const revenue = payments
    .filter((payment) => payment.status === "COMPLETED")
    .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);

  const statusCounts = BOOKING_STATUSES.map((status) => ({
    status,
    count: bookings.filter((booking) => booking.status === status).length,
  }));

  const recentUsers = [...users]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 8);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance">
          Admin dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform-wide users, bookings and payments.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Total users"
          value={String(users.length)}
          href="/admin-dashboard/users"
        />
        <StatTile
          label="Technicians"
          value={String(technicians.length)}
          href="/admin-dashboard/technicians"
        />
        <StatTile
          label="Total bookings"
          value={String(bookings.length)}
          href="/admin-dashboard/bookings"
        />
        <StatTile
          label="Revenue collected"
          value={`৳${revenue}`}
          href="/admin-dashboard/payments"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <section>
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Bookings by status
          </h2>

          {bookings.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              No bookings on the platform yet.
            </p>
          ) : (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {statusCounts.map(({ status, count }) => (
                <li key={status}>
                  <Link
                    href={`/admin-dashboard/bookings?status=${status}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-primary/50 hover:bg-muted"
                  >
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${TONE_CLASSES[BOOKING_STATUS_UI[status].tone]}`}
                    >
                      {BOOKING_STATUS_UI[status].label}
                    </span>
                    <span className="font-heading text-lg font-semibold tabular-nums text-card-foreground">
                      {count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="flex flex-col gap-6">
          <div>
            <h2 className="font-heading text-lg font-semibold tracking-tight">
              Accounts
            </h2>
            <dl className="mt-4 rounded-xl border border-border bg-card p-4 text-sm">
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-muted-foreground">Customers</dt>
                <dd className="text-card-foreground">{customers.length}</dd>
              </div>
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-muted-foreground">Technicians</dt>
                <dd className="text-card-foreground">{technicians.length}</dd>
              </div>
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-muted-foreground">Blocked</dt>
                <dd className="text-card-foreground">{blocked.length}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="font-heading text-lg font-semibold tracking-tight">
              Payments
            </h2>
            <dl className="mt-4 rounded-xl border border-border bg-card p-4 text-sm">
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-muted-foreground">Transactions</dt>
                <dd className="text-card-foreground">{payments.length}</dd>
              </div>
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-muted-foreground">Collected</dt>
                <dd className="text-card-foreground">৳{revenue}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Newest users
          </h2>
          {users.length > 0 && (
            <Link
              href="/admin-dashboard/users"
              className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {users.length > 8
                ? `View all ${users.length} users`
                : "View all users"}
            </Link>
          )}
        </div>

        {recentUsers.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border px-6 py-12 text-center">
            <p className="font-heading text-base font-medium text-foreground">
              No users found
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Either nobody has registered yet, or the admin endpoint returned
              nothing.
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <UsersTable users={recentUsers} />
          </div>
        )}
      </section>
    </div>
  );
}
