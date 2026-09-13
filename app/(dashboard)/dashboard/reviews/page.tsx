import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/service/getCurrentUser";
import ReviewCard from "../../_components/ReviewCard";
import ReviewForm from "../../_components/ReviewForm";

export const metadata: Metadata = {
  title: "My reviews | FixItNow",
  description: "Rate the jobs you have had done and edit what you wrote.",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default async function ReviewsPage() {
  const result = await getCurrentUser();

  // getCurrentUser answers with a failure object when there is no session.
  const user = result && "id" in result ? result : null;

  if (!user) redirect("/login");

  const reviews = [...(user.customerReviews ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const bookings = user.customerBookings ?? [];
  const reviewedIds = new Set(reviews.map((review) => review.bookingId));
  const awaitingReview = bookings.filter(
    (booking) =>
      booking.status === "COMPLETED" && !reviewedIds.has(booking.id)
  );

  const titleForBooking = (bookingId: string) =>
    bookings.find((booking) => booking.id === bookingId)?.service?.title;

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance">
          My reviews
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {reviews.length} written
          {awaitingReview.length > 0 &&
            ` · ${awaitingReview.length} job${awaitingReview.length === 1 ? "" : "s"} waiting to be rated`}
        </p>
      </header>

      {awaitingReview.length > 0 && (
        <section>
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Rate your completed jobs
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Write it here — no need to open the booking.
          </p>

          <ul className="mt-4 flex flex-col gap-4">
            {awaitingReview.map((booking) => (
              <li
                key={booking.id}
                className="rounded-xl border border-primary/40 bg-primary/5 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-card-foreground">
                      {booking.service?.title ?? "Completed job"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatDate(booking.bookingDate)} · {booking.startTime} –{" "}
                      {booking.endTime}
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/bookings/${booking.id}`}
                    className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    View booking
                  </Link>
                </div>

                <div className="mt-4 border-t border-primary/20 pt-4">
                  <ReviewForm bookingId={booking.id} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="font-heading text-lg font-semibold tracking-tight">
          Written
        </h2>

        {reviews.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border px-6 py-12 text-center">
            <p className="font-heading text-base font-medium text-foreground">
              No reviews yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Once a technician completes a job you can rate how it went.
            </p>
            <Link
              href="/services"
              className={`mt-4 ${buttonVariants({ variant: "outline", size: "sm" })}`}
            >
              Browse services
            </Link>
          </div>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {reviews.map((review) => (
              <li key={review.id}>
                <ReviewCard
                  review={review}
                  title={titleForBooking(review.bookingId)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
