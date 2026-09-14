"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import ReviewForm from "./ReviewForm";

interface IReviewPromptProps {
  bookingId: string;
  label?: string;
}

const ReviewPrompt = ({
  bookingId,
  label = "Leave a review",
}: IReviewPromptProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen((current) => !current)}>
        {open ? "Cancel" : label}
      </Button>

      {open && (
        <div className="mt-4 w-full basis-full rounded-xl border border-primary/40 bg-primary/5 p-4">
          <ReviewForm bookingId={bookingId} />
        </div>
      )}
    </>
  );
};

export default ReviewPrompt;
