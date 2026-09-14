"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { initPayment } from "../_actions/(user)/initPayment";

interface IPayButtonProps {
  bookingId: string;
  amount: number;
  label?: string;
}

const PayButton = ({ bookingId, amount, label }: IPayButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handlePay = () =>
    startTransition(async () => {
      const result = await initPayment(bookingId);

      if (result.success && result.url) {
        toast.success(result.message);
        window.location.href = result.url;
        return;
      }

      toast.error(result.message);
    });

  return (
    <Button size="sm" disabled={isPending} onClick={handlePay}>
      {isPending ? "Opening..." : (label ?? `Pay ৳${amount}`)}
    </Button>
  );
};

export default PayButton;
