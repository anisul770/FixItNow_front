import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import type { ITechnicianProfile } from "@/lib/types";

interface ITechnicianCardProps {
  technician: ITechnicianProfile;
}

const TechnicianCard = ({ technician }: ITechnicianCardProps) => {
  const name = technician.user?.name ?? "Technician";

  return (
    <article className="flex flex-col rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {name.charAt(0).toUpperCase()}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-1.5 font-heading text-base font-semibold tracking-tight text-card-foreground">
            <span className="truncate">{name}</span>
            {technician.verified && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-label="Verified technician"
                className="size-3.5 shrink-0 text-primary"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            )}
          </h3>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {technician.location ?? "Location not set"}
          </p>
        </div>

        <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-card-foreground">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-3.5 text-primary">
            <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
          </svg>
          {technician.totalReviews > 0
            ? technician.averageRating.toFixed(1)
            : "New"}
        </span>
      </div>

      {technician.bio && (
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {technician.bio}
        </p>
      )}

      {technician.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {technician.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
        <div>
          <p className="font-heading text-lg font-semibold tracking-tight text-card-foreground">
            ৳{technician.hourlyRate}
            <span className="text-xs font-normal text-muted-foreground">
              /hr
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            {technician.experience} yrs experience
          </p>
        </div>

        <Link
          href={`/technicians/${technician.id}`}
          className={buttonVariants({ size: "sm" })}
        >
          View profile
        </Link>
      </div>
    </article>
  );
};

export default TechnicianCard;
