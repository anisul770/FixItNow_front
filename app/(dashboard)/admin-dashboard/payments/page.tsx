import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/service/getCurrentUser";
import { getAllPayments } from "../../_actions/(admin)/getAllPayments";
import { PAYMENT_STATUS_UI, TONE_CLASSES } from "../../_config/payment";

export const metadata: Metadata = {
  title: "Payments | FixItNow Admin",
  description: "Every payment attempt on the platform.",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default async function AdminPaymentsPage() {
  const result = await getCurrentUser();

  // getCurrentUser answers with a failure object when there is no session.
  const currentUser = result && "id" in result ? result : null;

  if (!currentUser) redirect("/login");
  if (currentUser.role !== "ADMIN") redirect("/dashboard");

  const payments = await getAllPayments();

  const sorted = [...payments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Only COMPLETED payments have actually settled.
  const settled = payments.filter((payment) => payment.status === "COMPLETED");
  const revenue = settled.reduce(
    (sum, payment) => sum + (Number(payment.amount) || 0),
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
          Payments
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {payments.length} attempt{payments.length === 1 ? "" : "s"} ·{" "}
          {settled.length} settled · ৳{revenue} collected
        </p>
      </header>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <p className="font-heading text-base font-medium text-foreground">
            No payments found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Either nobody has paid yet, or the admin endpoint returned nothing.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Technician</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Paid on</th>
                <th className="px-4 py-3 font-medium">Method</th>
                <th className="px-4 py-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((payment) => {
                const ui = PAYMENT_STATUS_UI[payment.status];

                return (
                  <tr
                    key={payment.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-card-foreground">
                      <Link
                        href={`/admin-dashboard/payments/${payment.bookingId}`}
                        className="hover:underline"
                      >
                        {payment.booking?.customer?.name ?? "—"}
                      </Link>
                    </td>
                    <td className="max-w-40 truncate px-4 py-3 text-muted-foreground">
                      {payment.booking?.service?.title ?? "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {payment.booking?.technician?.user?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
                          ui ? TONE_CLASSES[ui.tone] : TONE_CLASSES.neutral
                        }`}
                      >
                        {ui?.label ?? payment.status}
                      </span>
                    </td>
                    {/* Null until settlement. */}
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {payment.paidAt ? formatDate(payment.paidAt) : "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {payment.method ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-card-foreground">
                      <Link
                        href={`/admin-dashboard/payments/${payment.bookingId}`}
                        className="hover:underline"
                      >
                        ৳{payment.amount}
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
