import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/service/getCurrentUser";
import ProfileForm from "../_components/ProfileForm";

export const metadata: Metadata = {
  title: "Profile | FixItNow",
  description: "View and update your account details.",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const toTitleCase = (value: string) =>
  value.charAt(0) + value.slice(1).toLowerCase();

export default async function ProfilePage() {
  const result = await getCurrentUser();

  // getCurrentUser answers with a failure object when there is no session.
  const user = result && "id" in result ? result : null;

  if (!user) redirect("/login");

  const technicianProfile = user.technicianProfile;

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance">
          Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View your account details and keep your contact information current.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <section>
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Edit details
          </h2>

          <div className="mt-4 rounded-xl border border-border bg-card p-5">
            <ProfileForm user={user} />
          </div>
        </section>

        <aside className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate font-heading text-base font-semibold tracking-tight text-foreground">
                  {user.name}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>

            <dl className="mt-4 rounded-xl border border-border bg-card p-4 text-sm">
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-muted-foreground">Role</dt>
                <dd className="text-card-foreground">
                  {toTitleCase(user.role)}
                </dd>
              </div>
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-muted-foreground">Account</dt>
                <dd
                  className={
                    user.activeStatus === "BLOCKED"
                      ? "text-destructive"
                      : "text-card-foreground"
                  }
                >
                  {toTitleCase(user.activeStatus)}
                </dd>
              </div>
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="text-card-foreground">
                  {user.profile?.phone ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-muted-foreground">Address</dt>
                <dd className="max-w-40 truncate text-card-foreground">
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
          </div>

          {technicianProfile && (
            <div>
              <h2 className="font-heading text-lg font-semibold tracking-tight">
                Technician details
              </h2>
              <dl className="mt-4 rounded-xl border border-border bg-card p-4 text-sm">
                <div className="flex justify-between gap-3 py-1.5">
                  <dt className="text-muted-foreground">Verification</dt>
                  <dd className="text-card-foreground">
                    {technicianProfile.verified ? "Verified" : "Pending"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3 py-1.5">
                  <dt className="text-muted-foreground">Experience</dt>
                  <dd className="text-card-foreground">
                    {technicianProfile.experience} yrs
                  </dd>
                </div>
                <div className="flex justify-between gap-3 py-1.5">
                  <dt className="text-muted-foreground">Hourly rate</dt>
                  <dd className="text-card-foreground">
                    ৳{technicianProfile.hourlyRate}
                  </dd>
                </div>
                <div className="flex justify-between gap-3 py-1.5">
                  <dt className="text-muted-foreground">Rating</dt>
                  <dd className="text-card-foreground">
                    {technicianProfile.totalReviews > 0
                      ? `${technicianProfile.averageRating.toFixed(1)} (${technicianProfile.totalReviews})`
                      : "—"}
                  </dd>
                </div>
              </dl>
              <p className="mt-2 text-xs text-muted-foreground">
                Bio, skills and rate are not editable through this endpoint.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
