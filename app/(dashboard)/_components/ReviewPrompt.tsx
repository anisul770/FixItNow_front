"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import ReviewForm from "./ReviewForm";

interface IReviewPromptProps {
  bookingId: string;
  /** Compact renders just the toggle, for use inside a dense list row. */
  label?: string;
}

/**
 * A review button that opens the form where it stands, so a completed job can
 * be rated from any list without navigating to the booking.
 */
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
