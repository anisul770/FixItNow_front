import Link from "next/link";

import type { IUser } from "@/lib/types";

import UserStatusActions from "./UserStatusActions";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const toTitleCase = (value: string) =>
  value.charAt(0) + value.slice(1).toLowerCase();

interface IUsersTableProps {
  users: IUser[];
  /** Adds a block/unblock column — off on the dashboard preview. */
  showActions?: boolean;
  /** The signed-in admin, so their own row cannot be blocked. */
  currentUserId?: string;
}

const UsersTable = ({
  users,
  showActions,
  currentUserId,
}: IUsersTableProps) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Joined</th>
            {showActions && (
              <th className="px-4 py-3 text-right font-medium">
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3 whitespace-nowrap text-card-foreground">
                <Link
                  href={`/admin-dashboard/users/${user.id}`}
                  className="hover:underline"
                >
                  {user.name}
                </Link>
              </td>
              <td className="max-w-48 truncate px-4 py-3 text-muted-foreground">
                {user.email}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {toTitleCase(user.role)}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    user.activeStatus === "BLOCKED"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-chart-3/15 text-foreground"
                  }`}
                >
                  {toTitleCase(user.activeStatus)}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                {formatDate(user.createdAt)}
              </td>
              {showActions && (
                <td className="px-4 py-3 text-right">
                  <UserStatusActions
                    userId={user.id}
                    blocked={user.activeStatus === "BLOCKED"}
                    isSelf={user.id === currentUserId}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
