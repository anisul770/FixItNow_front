"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { deleteSlot } from "../_actions/(technician)/deleteSlot";

interface ISlotDeleteButtonProps {
  slotId: string;
}

const SlotDeleteButton = ({ slotId }: ISlotDeleteButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () =>
    startTransition(async () => {
      const result = await deleteSlot(slotId);

      if (result.success) {
        toast.success(result.message);
      } else {
        // Most often: "A booked slot can not be deleted".
        toast.error(result.message);
      }
    });

  return (
    <Button
      size="xs"
      variant="ghost"
      disabled={isPending}
      onClick={handleDelete}
      aria-label="Delete slot"
    >
      {isPending ? "..." : "Remove"}
    </Button>
  );
};

export default SlotDeleteButton;
