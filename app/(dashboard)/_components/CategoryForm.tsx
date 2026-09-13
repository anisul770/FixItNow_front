"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategory } from "../_actions/admin/createCategory";

const CategoryForm = () => {
  const [state, action, pending] = useActionState(createCategory, null);
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
        <Label htmlFor="name">Category name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Plumbing"
          required
        />
        <p className="text-xs text-muted-foreground">
          Technicians pick a category when publishing a service.
        </p>
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Creating..." : "Create category"}
      </Button>
    </form>
  );
};

export default CategoryForm;
