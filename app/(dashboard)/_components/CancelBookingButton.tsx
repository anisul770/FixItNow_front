"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cancelBooking } from "../_actions/(user)/cancelBooking";

interface ICancelBookingButtonProps {
  bookingId: string;
}

const CancelBookingButton = ({ bookingId }: ICancelBookingButtonProps) => {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCancel = () =>
    startTransition(async () => {
      const result = await cancelBooking(bookingId);

      if (result.success) {
        toast.success(result.message);
        setConfirming(false);
      } else {
        toast.error(result.message);
      }
    });

  if (!confirming) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => setConfirming(true)}
      >
        Cancel booking
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Cancel this booking?</span>
      <Button
        size="sm"
        variant="destructive"
        disabled={isPending}
        onClick={handleCancel}
      >
        {isPending ? "Cancelling..." : "Yes, cancel"}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        disabled={isPending}
        onClick={() => setConfirming(false)}
      >
        Keep booking
      </Button>
    </div>
  );
};

export default CancelBookingButton;
