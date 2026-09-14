import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/service/getCurrentUser";
import { getAllTechnicians } from "../../../_actions/(technician)/getAllTechnicians";
import { getAllUsers } from "../../../_actions/(admin)/getAllUsers";
import UserStatusActions from "../../../_components/UserStatusActions";

export const metadata: Metadata = {
  title: "User details | FixItNow Admin",
  description: "Account details for one platform user.",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const toTitleCase = (value: string) =>
  value.charAt(0) + value.slice(1).toLowerCase();

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

export default async function AdminUserDetailsPage(
  props: PageProps<"/admin-dashboard/users/[id]">
) {
  const { id } = await props.params;

  const result = await getCurrentUser();

  const currentUser = result && "id" in result ? result : null;

  if (!currentUser) redirect("/login");

  const [users, technicians] = await Promise.all([
    getAllUsers(),
    getAllTechnicians(),
  ]);

  const user = users.find((item) => item.id === id) ?? null;

  if (!user) notFound();

  const technicianProfile =
    user.technicianProfile ??
    technicians.find((item) => item.userId === user.id) ??
    null;

  const isSelf = user.id === currentUser.id;
  const bookingCount = user.customerBookings?.length;
  const reviewCount = user.customerReviews?.length;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin-dashboard/users"
        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        ← Back to users
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance">
              {user.name}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {toTitleCase(user.role)}
              </span>
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                  user.activeStatus === "BLOCKED"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-chart-3/15 text-foreground"
                }`}
              >
                {toTitleCase(user.activeStatus)}
              </span>
            </div>
          </div>
        </div>

        <UserStatusActions
          userId={user.id}
          blocked={user.activeStatus === "BLOCKED"}
          isSelf={isSelf}
        />
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-6">
          <section>
            <h2 className="font-heading text-lg font-semibold tracking-tight">
              Account
            </h2>
            <dl className="mt-3 rounded-xl border border-border bg-card px-4 py-2 text-sm">
              <Row label="Email">{user.email}</Row>
              <Row label="Phone">{user.profile?.phone ?? "—"}</Row>
              <Row label="Address">{user.profile?.address ?? "—"}</Row>
              <Row label="Joined">{formatDate(user.createdAt)}</Row>
            </dl>
          </section>

          {user.role === "CUSTOMER" && (
            <section>
              <h2 className="font-heading text-lg font-semibold tracking-tight">
                Activity
              </h2>
              <dl className="mt-3 rounded-xl border border-border bg-card px-4 py-2 text-sm">
                <Row label="Bookings made">{bookingCount ?? "—"}</Row>
                <Row label="Reviews written">{reviewCount ?? "—"}</Row>
              </dl>
            </section>
          )}

          {user.role === "TECHNICIAN" && (
            <section>
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-heading text-lg font-semibold tracking-tight">
                  Technician profile
                </h2>
                <Link
                  href="/admin-dashboard/technicians"
                  className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Manage approval →
                </Link>
              </div>

              {technicianProfile ? (
                <dl className="mt-3 rounded-xl border border-border bg-card px-4 py-2 text-sm">
                  <Row label="Verification">
                    {technicianProfile.verified ? "Verified" : "Pending"}
                  </Row>
                  <Row label="Experience">
                    {technicianProfile.experience} yrs
                  </Row>
                  <Row label="Hourly rate">
                    ৳{technicianProfile.hourlyRate}
                  </Row>
                  <Row label="Rating">
                    {technicianProfile.totalReviews > 0
                      ? `${technicianProfile.averageRating.toFixed(1)} (${technicianProfile.totalReviews})`
                      : "No ratings yet"}
                  </Row>
                  {technicianProfile.location && (
                    <Row label="Location">{technicianProfile.location}</Row>
                  )}
                </dl>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  This technician has not set up a profile yet.
                </p>
              )}

              {technicianProfile?.bio && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {technicianProfile.bio}
                </p>
              )}

              {technicianProfile && technicianProfile.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {technicianProfile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {technicianProfile && (
                <Link
                  href={`/technicians/${technicianProfile.id}`}
                  className={`mt-4 w-fit ${buttonVariants({ variant: "outline", size: "sm" })}`}
                >
                  View public profile
                </Link>
              )}
            </section>
          )}
        </div>

        <aside>
          {isSelf && (
            <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              This is your own account — it cannot be blocked from here.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
