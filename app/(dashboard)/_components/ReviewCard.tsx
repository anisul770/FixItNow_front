"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { IReview } from "@/lib/types";
import ReviewForm from "./ReviewForm";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const Stars = ({ rating }: { rating: number }) => (
  <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
        className={star <= rating ? "size-4 text-primary" : "size-4 text-border"}
      >
        <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
      </svg>
    ))}
  </span>
);

interface IReviewCardProps {
  review: IReview;
  /** Shown above the review so it is clear which job it belongs to. */
  title?: string;
}

const ReviewCard = ({ review, title }: IReviewCardProps) => {
  const [editing, setEditing] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          {title && (
            <p className="truncate text-sm font-medium text-card-foreground">
              {title}
            </p>
          )}
          <div className="mt-1 flex items-center gap-2">
            <Stars rating={review.rating} />
            <span className="text-xs text-muted-foreground">
              {formatDate(review.createdAt)}
            </span>
          </div>
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => setEditing((current) => !current)}
        >
          {editing ? "Cancel" : "Edit"}
        </Button>
      </div>

      {editing ? (
        <div className="mt-4 border-t border-border pt-4">
          <ReviewForm bookingId={review.bookingId} review={review} />
        </div>
      ) : (
        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
          {review.comment}
        </p>
      )}
    </div>
  );
};

export default ReviewCard;
