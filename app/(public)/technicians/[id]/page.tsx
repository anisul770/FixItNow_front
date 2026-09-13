import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllServices } from "../../_actions/getAllServices";
import { getTechnicianById } from "../../_actions/getTechnicianById";
import { getTechnicianReviews } from "../../_actions/getTechnicianReviews";
import ServiceCard from "../../_components/ServiceCard";

export async function generateMetadata(
  props: PageProps<"/technicians/[id]">
): Promise<Metadata> {
  const { id } = await props.params;
  const technician = await getTechnicianById(id);
  const name = technician?.user?.name;

  return {
    title: name ? `${name} | FixItNow` : "Technician | FixItNow",
    description: technician?.bio ?? undefined,
  };
}

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
        className={star <= rating ? "size-3.5 text-primary" : "size-3.5 text-border"}
      >
        <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
      </svg>
    ))}
  </span>
);

export default async function TechnicianDetailsPage(
  props: PageProps<"/technicians/[id]">
) {
  const { id } = await props.params;

  const [technician, allServices, reviews] = await Promise.all([
    getTechnicianById(id),
    getAllServices(),
    getTechnicianReviews(id),
  ]);

  if (!technician) notFound();

  const name = technician.user?.name ?? "Technician";
  const services = allServices.filter(
    (service) => service.technicianId === technician.id
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/technicians"
        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        ← Back to technicians
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div>
          <header className="flex items-start gap-4">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
              {name.charAt(0).toUpperCase()}
            </span>

            <div className="min-w-0">
              <h1 className="flex flex-wrap items-center gap-2 font-heading text-3xl font-semibold tracking-tight text-balance">
                {name}
                {technician.verified && (
                  <span className="inline-flex rounded-full bg-chart-3/15 px-2.5 py-1 text-xs font-medium text-foreground">
                    Verified
                  </span>
                )}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Stars rating={Math.round(technician.averageRating)} />
                  {technician.totalReviews > 0
                    ? `${technician.averageRating.toFixed(1)} (${technician.totalReviews})`
                    : "No ratings yet"}
                </span>
                {technician.location && <span>{technician.location}</span>}
                <span>{technician.experience} yrs experience</span>
              </div>
            </div>
          </header>

          {technician.bio && (
            <section className="mt-8">
              <h2 className="font-heading text-lg font-semibold tracking-tight">
                About
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {technician.bio}
              </p>
            </section>
          )}

          {technician.skills.length > 0 && (
            <section className="mt-8">
              <h2 className="font-heading text-lg font-semibold tracking-tight">
                Skills
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {technician.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="mt-10">
            <h2 className="font-heading text-lg font-semibold tracking-tight">
              Services offered
            </h2>

            {services.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                This technician has not published any services yet.
              </p>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
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
                No reviews for this technician yet.
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
              ৳{technician.hourlyRate}
              <span className="text-sm font-normal text-muted-foreground">
                /hr
              </span>
            </p>

            <dl className="mt-4 border-t border-border pt-4 text-sm">
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-muted-foreground">Experience</dt>
                <dd className="text-card-foreground">
                  {technician.experience} yrs
                </dd>
              </div>
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-muted-foreground">Services</dt>
                <dd className="text-card-foreground">{services.length}</dd>
              </div>
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-muted-foreground">Reviews</dt>
                <dd className="text-card-foreground">
                  {technician.totalReviews}
                </dd>
              </div>
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-muted-foreground">Joined</dt>
                <dd className="text-card-foreground">
                  {formatDate(technician.createdAt)}
                </dd>
              </div>
            </dl>

            {services.length > 0 && (
              <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
                Open a service above to see availability and book a slot.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
