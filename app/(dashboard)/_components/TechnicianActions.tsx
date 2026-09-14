"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { updateUserStatus } from "../_actions/(admin)/updateUserStatus";
import { verifyTechnician } from "../_actions/(admin)/verifyTechnician";

interface ITechnicianActionsProps {
  technicianId: string;
  userId: string;
  verified: boolean;
  blocked: boolean;
}

const TechnicianActions = ({
  technicianId,
  userId,
  verified,
  blocked,
}: ITechnicianActionsProps) => {
  const [isPending, startTransition] = useTransition();

  const run = (action: () => Promise<{ success: boolean; message: string }>) =>
    startTransition(async () => {
      const result = await action();

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });

  return (
    <div className="flex justify-end gap-2">
      {!verified && (
        <Button
          size="sm"
          disabled={isPending}
          onClick={() => run(() => verifyTechnician(technicianId))}
        >
          Approve
        </Button>
      )}

      {blocked ? (
        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() => run(() => updateUserStatus(userId, "ACTIVE"))}
        >
          Unblock
        </Button>
      ) : (
        <Button
          size="sm"
          variant="destructive"
          disabled={isPending}
          onClick={() => run(() => updateUserStatus(userId, "BLOCKED"))}
        >
          Reject
        </Button>
      )}
    </div>
  );
};

export default TechnicianActions;
