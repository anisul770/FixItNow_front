"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ISlot } from "@/lib/types";
import { createBooking } from "../_actions/createBooking";

const SELECT_CLASSES =
  "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

const formatSlot = (slot: ISlot) => {
  const date = new Date(slot.date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return `${date} · ${slot.startTime} – ${slot.endTime}`;
};

interface IBookingFormProps {
  serviceId: string;
  slots: ISlot[];
  defaultAddress: string;
}

const BookingForm = ({
  serviceId,
  slots,
  defaultAddress,
}: IBookingFormProps) => {
  const router = useRouter();
  const [state, action, pending] = useActionState(createBooking, null);

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success(state.message);
      router.push("/dashboard");
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="serviceId" value={serviceId} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="slot">Choose a slot</Label>
        <select id="slot" name="slot" className={SELECT_CLASSES} required>
          {slots.map((slot) => (
            <option key={slot.id} value={`${slot.date}|${slot.startTime}`}>
              {formatSlot(slot)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="address">Service address</Label>
        <Input
          id="address"
          name="address"
          type="text"
          autoComplete="street-address"
          placeholder="House, road, city"
          defaultValue={defaultAddress}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Booking..." : "Book this service"}
      </Button>
    </form>
  );
};

export default BookingForm;
