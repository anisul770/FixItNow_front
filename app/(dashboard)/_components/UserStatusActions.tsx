"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { updateUserStatus } from "../_actions/(admin)/updateUserStatus";

interface IUserStatusActionsProps {
  userId: string;
  blocked: boolean;
  /** True for the signed-in admin's own row, which cannot be blocked. */
  isSelf?: boolean;
}

const UserStatusActions = ({
  userId,
  blocked,
  isSelf,
}: IUserStatusActionsProps) => {
  const [isPending, startTransition] = useTransition();

  if (isSelf) {
    return <span className="text-xs text-muted-foreground">You</span>;
  }

  const run = (activeStatus: "ACTIVE" | "BLOCKED") =>
    startTransition(async () => {
      const result = await updateUserStatus(userId, activeStatus);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });

  return blocked ? (
    <Button
      size="sm"
      variant="outline"
      disabled={isPending}
      onClick={() => run("ACTIVE")}
    >
      Unblock
    </Button>
  ) : (
    <Button
      size="sm"
      variant="destructive"
      disabled={isPending}
      onClick={() => run("BLOCKED")}
    >
      Block
    </Button>
  );
};

export default UserStatusActions;
