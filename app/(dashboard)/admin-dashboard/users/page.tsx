import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/service/getCurrentUser";
import { getAllUsers } from "../../_actions/admin/getAllUsers";
import UsersTable from "../../_components/UsersTable";

export const metadata: Metadata = {
  title: "Users | FixItNow Admin",
  description: "Every account registered on the platform.",
};

export default async function AdminUsersPage() {
  const result = await getCurrentUser();

  // getCurrentUser answers with a failure object when there is no session.
  const currentUser = result && "id" in result ? result : null;

  if (!currentUser) redirect("/login");
  if (currentUser.role !== "ADMIN") redirect("/dashboard");

  const users = await getAllUsers();

  const sortedUsers = [...users].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const technicians = users.filter((user) => user.role === "TECHNICIAN").length;
  const customers = users.filter((user) => user.role === "CUSTOMER").length;
  const blocked = users.filter((user) => user.activeStatus === "BLOCKED").length;

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
          Users
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {users.length} total · {customers} customers · {technicians}{" "}
          technicians · {blocked} blocked
        </p>
      </header>

      {sortedUsers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <p className="font-heading text-base font-medium text-foreground">
            No users found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Either nobody has registered yet, or the admin endpoint returned
            nothing.
          </p>
        </div>
      ) : (
        <UsersTable
          users={sortedUsers}
          showActions
          currentUserId={currentUser.id}
        />
      )}
    </div>
  );
}
