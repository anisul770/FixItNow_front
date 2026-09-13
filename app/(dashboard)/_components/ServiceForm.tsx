"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ICategory } from "@/lib/types";
import { createService } from "../_actions/technician/createService";

const SELECT_CLASSES =
  "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

interface IServiceFormProps {
  categories: ICategory[];
}

const ServiceForm = ({ categories }: IServiceFormProps) => {
  const [state, action, pending] = useActionState(createService, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success(state.message);
      formRef.current?.reset();
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="Tap and pipe repair"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          type="text"
          placeholder="What the job covers"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="categoryId">Category</Label>
        <select
          id="categoryId"
          name="categoryId"
          className={SELECT_CLASSES}
          required
        >
          <option value="">Choose a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="price">Price (৳)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min={0}
            step={10}
            placeholder="500"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="duration">Duration (min)</Label>
          <Input
            id="duration"
            name="duration"
            type="number"
            min={5}
            step={5}
            placeholder="30"
            required
          />
        </div>
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Publishing..." : "Publish service"}
      </Button>
    </form>
  );
};

export default ServiceForm;
