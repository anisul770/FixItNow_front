"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSlots } from "../_actions/technician/createSlots";

const SlotForm = () => {
  const [state, action, pending] = useActionState(createSlots, null);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          min={today}
          defaultValue={today}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="startTime">Day starts</Label>
          <Input
            id="startTime"
            name="startTime"
            type="time"
            defaultValue="10:00"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="endTime">Day ends</Label>
          <Input
            id="endTime"
            name="endTime"
            type="time"
            defaultValue="17:00"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="slotDuration">Slot length (min)</Label>
        <Input
          id="slotDuration"
          name="slotDuration"
          type="number"
          min={5}
          step={5}
          defaultValue={50}
          required
        />
        <p className="text-xs text-muted-foreground">
          The window is split into back-to-back slots of this length.
        </p>
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Creating..." : "Create slots"}
      </Button>
    </form>
  );
};

export default SlotForm;
