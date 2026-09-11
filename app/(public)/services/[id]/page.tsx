import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import type { ISlot } from "@/lib/types";
import { getServiceById } from "../../_actions/getServiceById";
import { getServiceReviews } from "../../_actions/getServiceReviews";
import { getServiceSlots } from "../../_actions/getServiceSlots";

export async function generateMetadata(
  props: PageProps<"/services/[id]">
): Promise<Metadata> {
  const { id } = await props.params;
  const service = await getServiceById(id);

  return {
    title: service ? `${service.title} | FixItNow` : "Service | FixItNow",
    description: service?.description ?? undefined,
  };
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

const groupSlotsByDate = (slots: ISlot[]) => {
  const groups = new Map<string, ISlot[]>();

  for (const slot of slots) {
    const key = slot.date;
    groups.set(key, [...(groups.get(key) ?? []), slot]);
  }

  return [...groups.entries()].sort(
    ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
  );
};

const Stars = ({ rating }: { rating: number }) => (
  <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
        className={star <= rating ? "size-3.5 text-primary" : "size-3.5 text-border"}
      >
        <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
      </svg>
    ))}
  </span>
);

export default async function ServiceDetailsPage(
  props: PageProps<"/services/[id]">
) {
  const { id } = await props.params;

  const [service, slots, reviews] = await Promise.all([
    getServiceById(id),
    getServiceSlots(id),
    getServiceReviews(id),
  ]);

  if (!service) notFound();

  const technician = service.technician;
  const technicianName = technician?.user?.name;
  const openSlots = slots.filter((slot) => !slot.isBooked);
  const slotsByDate = groupSlotsByDate(slots);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/services"
        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        ← Back to services
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div>
          <header>
            <div className="flex flex-wrap items-center gap-2">
              {service.category && (
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {service.category.name}
                </span>
              )}
              {!service.isActive && (
                <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
                  Currently unavailable
                </span>
              )}
            </div>

            <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-balance">
              {service.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Stars rating={Math.round(service.rating)} />
                {service.rating > 0
                  ? service.rating.toFixed(1)
                  : "No rating yet"}
              </span>
              <span>{reviews.length} reviews</span>
              <span>{service.duration} min</span>
            </div>
          </header>

          {service.description && (
            <section className="mt-8">
              <h2 className="font-heading text-lg font-semibold tracking-tight">
                About this service
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </section>
          )}

          <section className="mt-8">
            <h2 className="font-heading text-lg font-semibold tracking-tight">
              Availability
            </h2>

            {slotsByDate.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                This technician has not published any slots yet.
              </p>
            ) : (
              <div className="mt-4 flex flex-col gap-4">
                {slotsByDate.map(([date, dateSlots]) => (
                  <div key={date}>
                    <p className="text-sm font-medium text-card-foreground">
                      {formatDate(date)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {dateSlots.map((slot) => (
                        <span
                          key={slot.id}
                          className={
                            slot.isBooked
                              ? "rounded-lg border border-border bg-muted px-3 py-1.5 text-xs text-muted-foreground line-through"
                              : "rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-card-foreground"
                          }
                        >
                          {slot.startTime} – {slot.endTime}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mt-10">
            <h2 className="font-heading text-lg font-semibold tracking-tight">
              Reviews
            </h2>

            {reviews.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                No reviews yet for this service.
              </p>
            ) : (
              <ul className="mt-4 flex flex-col gap-4">
                {reviews.map((review) => (
                  <li
                    key={review.id}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                          {(review.customer?.name ?? "?")
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                        <span className="text-sm font-medium text-card-foreground">
                          {review.customer?.name ?? "Customer"}
                        </span>
                      </div>
                      <Stars rating={review.rating} />
                    </div>

                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                      {review.comment}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="font-heading text-3xl font-semibold tracking-tight text-card-foreground">
              ৳{service.price}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {service.duration} minute visit
            </p>

            <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
              {openSlots.length > 0
                ? `${openSlots.length} slot${openSlots.length === 1 ? "" : "s"} open`
                : "No open slots right now"}
            </p>

            {technicianName && (
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Technician
                </p>
                <div className="mt-2 flex items-center gap-2.5">
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {technicianName.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate text-sm font-medium text-card-foreground">
                      {technicianName}
                      {technician?.verified && (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={3}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-label="Verified"
                          className="size-3.5 shrink-0 text-primary"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </p>
                    {technician && (
                      <p className="text-xs text-muted-foreground">
                        {technician.experience} yrs · ৳{technician.hourlyRate}/hr
                      </p>
                    )}
                  </div>
                </div>

                {technician?.bio && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {technician.bio}
                  </p>
                )}

                {technician?.skills && technician.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {technician.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
