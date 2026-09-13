"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ISlot } from "@/lib/types";
import { createBooking } from "../_actions/createBooking";

const SELECT_CLASSES =
  "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

interface IBookingFormProps {
  serviceId: string;
  /** Open slots only — a booking must land on one the technician published. */
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

  // Dates the technician actually has open slots on, earliest first.
  const dates = [...new Set(slots.map((slot) => slot.date))].sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const [selectedDate, setSelectedDate] = useState(dates[0] ?? "");

  // Only the times published on the chosen date — any other pairing is a
  // slot the technician never opened, which the API rejects.
  const timesOnDate = slots
    .filter((slot) => slot.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

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
        <select
          id="bookingDate"
          name="bookingDate"
          className={SELECT_CLASSES}
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          required
        >
          {dates.map((date) => (
            <option key={date} value={date}>
              {formatDate(date)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="startTime">Time</Label>
        <select
          id="startTime"
          name="startTime"
          className={SELECT_CLASSES}
          required
        >
          {timesOnDate.map((slot) => (
            <option key={slot.id} value={slot.startTime}>
              {slot.startTime} – {slot.endTime}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">
          {timesOnDate.length} slot{timesOnDate.length === 1 ? "" : "s"} open on
          this date.
        </p>
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
