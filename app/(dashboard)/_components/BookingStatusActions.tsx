"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { IBookingStatus } from "@/lib/types";
import { updateBookingStatus } from "../_actions/technician/updateBookingStatus";

/**
 * What the technician may do next, per booking status. A booking waits at
 * ACCEPTED until the customer pays, then moves PAID → IN_PROGRESS → COMPLETED.
 */
const NEXT_ACTIONS: Partial<
  Record<
    IBookingStatus,
    { label: string; status: IBookingStatus; variant?: "outline" }[]
  >
> = {
  REQUESTED: [
    { label: "Accept", status: "ACCEPTED" },
    { label: "Decline", status: "DECLINED", variant: "outline" },
  ],
  PAID: [{ label: "Start job", status: "IN_PROGRESS" }],
  IN_PROGRESS: [{ label: "Mark complete", status: "COMPLETED" }],
};

interface IBookingStatusActionsProps {
  bookingId: string;
  status: IBookingStatus;
}

const BookingStatusActions = ({
  bookingId,
  status,
}: IBookingStatusActionsProps) => {
  const [isPending, startTransition] = useTransition();

  const actions = NEXT_ACTIONS[status];

  if (!actions) return null;

  const run = (next: IBookingStatus) =>
    startTransition(async () => {
      const result = await updateBookingStatus(bookingId, next);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });

  return (
    <div className="flex justify-end gap-2">
      {actions.map((action) => (
        <Button
          key={action.status}
          size="sm"
          variant={action.variant}
          disabled={isPending}
          onClick={() => run(action.status)}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default BookingStatusActions;
