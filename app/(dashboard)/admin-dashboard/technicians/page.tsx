import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/service/getCurrentUser";
import { getAllTechnicians } from "../../_actions/technician/getAllTechnicians";
import TechnicianActions from "../../_components/TechnicianActions";

export const metadata: Metadata = {
  title: "Technicians | FixItNow Admin",
  description: "Approve or reject technician accounts.",
};

export default async function AdminTechniciansPage() {
  const result = await getCurrentUser();

  // getCurrentUser answers with a failure object when there is no session.
  const currentUser = result && "id" in result ? result : null;

  if (!currentUser) redirect("/login");
  if (currentUser.role !== "ADMIN") redirect("/dashboard");

  const technicians = await getAllTechnicians();

  const pending = technicians.filter((technician) => !technician.verified);
  const verified = technicians.filter((technician) => technician.verified);

  const sorted = [...pending, ...verified];

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
          Technicians
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {technicians.length} total · {pending.length} awaiting approval ·{" "}
          {verified.length} verified
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Approving marks the technician verified. The API has no reject route,
          so rejecting blocks the account instead — you can undo that here.
        </p>
      </header>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <p className="font-heading text-base font-medium text-foreground">
            No technicians yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Accounts registered with the technician role will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Experience</th>
                <th className="px-4 py-3 font-medium">Rate</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Approval</th>
                <th className="px-4 py-3 font-medium">Account</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((technician) => {
                const blocked = technician.user?.activeStatus === "BLOCKED";

                return (
                  <tr
                    key={technician.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-card-foreground">
                      {technician.user?.name ?? "—"}
                    </td>
                    <td className="max-w-44 truncate px-4 py-3 text-muted-foreground">
                      {technician.user?.email ?? "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {technician.experience} yrs
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap tabular-nums text-muted-foreground">
                      ৳{technician.hourlyRate}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {technician.totalReviews > 0
                        ? `${technician.averageRating.toFixed(1)} (${technician.totalReviews})`
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          technician.verified
                            ? "bg-chart-3/15 text-foreground"
                            : "bg-primary/15 text-foreground"
                        }`}
                      >
                        {technician.verified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          blocked
                            ? "bg-destructive/10 text-destructive"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {blocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <TechnicianActions
                        technicianId={technician.id}
                        userId={technician.userId}
                        verified={technician.verified}
                        blocked={blocked}
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
