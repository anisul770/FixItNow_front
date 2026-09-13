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

/**
 * A slot fixes a time of day, not a date — the same 10:00–10:50 window can be
 * published on several dates, so the dropdown lists each window once.
 */
const distinctTimes = (slots: ISlot[]) => {
  const seen = new Map<string, ISlot>();

  for (const slot of slots) {
    const key = `${slot.startTime}-${slot.endTime}`;
    if (!seen.has(key)) seen.set(key, slot);
  }

  return [...seen.values()].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );
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

  const times = distinctTimes(slots);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success(state.message);
      router.push("/dashboard/bookings");
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="serviceId" value={serviceId} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bookingDate">Date</Label>
        <Input
          id="bookingDate"
          name="bookingDate"
          type="date"
          min={today}
          defaultValue={today}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="startTime">Time slot</Label>
        <select
          id="startTime"
          name="startTime"
          className={SELECT_CLASSES}
          required
        >
          {times.map((slot) => (
            <option key={slot.id} value={slot.startTime}>
              {slot.startTime} – {slot.endTime}
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
