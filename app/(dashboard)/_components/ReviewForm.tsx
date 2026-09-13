"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IReview } from "@/lib/types";
import { createReview } from "../_actions/user/createReview";
import { updateReview } from "../_actions/user/updateReview";

const RATINGS = [1, 2, 3, 4, 5];

interface IReviewFormProps {
  bookingId: string;
  /** When present the form edits that review instead of creating one. */
  review?: IReview;
}

const ReviewForm = ({ bookingId, review }: IReviewFormProps) => {
  const [state, action, pending] = useActionState(
    review ? updateReview : createReview,
    null
  );
  const [rating, setRating] = useState(review?.rating ?? 5);

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
      {review ? (
        <input type="hidden" name="reviewId" value={review.id} />
      ) : (
        <input type="hidden" name="bookingId" value={bookingId} />
      )}
      <input type="hidden" name="rating" value={rating} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="rating-3">Rating</Label>
        <div className="flex items-center gap-1">
          {RATINGS.map((value) => (
            <button
              key={value}
              id={`rating-${value}`}
              type="button"
              onClick={() => setRating(value)}
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
              aria-pressed={value === rating}
              className="rounded-sm p-0.5 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
                className={
                  value <= rating
                    ? "size-6 text-primary"
                    : "size-6 text-border transition-colors hover:text-primary/40"
                }
              >
                <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
              </svg>
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {rating} / 5
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="comment">Comment</Label>
        <Input
          id="comment"
          name="comment"
          type="text"
          placeholder="How did the job go?"
          defaultValue={review?.comment ?? ""}
          required
        />
      </div>

      <div>
        <Button type="submit" disabled={pending}>
          {pending
            ? "Saving..."
            : review
              ? "Update review"
              : "Submit review"}
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
