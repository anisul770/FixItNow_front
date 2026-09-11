import type { IUser } from "@/lib/types";

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
}

const UsersTable = ({ users }: IUsersTableProps) => {
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
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3 whitespace-nowrap text-card-foreground">
                {user.name}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
