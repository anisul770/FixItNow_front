import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import type { IService } from "@/lib/types";

interface IServiceCardProps {
  service: IService;
}

const ServiceCard = ({ service }: IServiceCardProps) => {
  const technicianName = service.technician?.user?.name;
  const isVerified = service.technician?.verified;
  const rating = service.technician?.averageRating ?? 0;

  return (
    <article className="flex flex-col rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        {service.category && (
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {service.category.name}
          </span>
        )}

        <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-card-foreground">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-3.5 text-primary">
            <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
          </svg>
          {rating > 0 ? rating.toFixed(1) : "New"}
        </span>
      </div>

      <h3 className="mt-3 font-heading text-base font-semibold tracking-tight text-card-foreground">
        {service.title}
      </h3>

      {service.description && (
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {service.description}
        </p>
      )}

      {technicianName && (
        <div className="mt-4 flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            {technicianName.charAt(0).toUpperCase()}
          </span>
          <span className="truncate text-sm text-muted-foreground">
            {technicianName}
          </span>
          {isVerified && (
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
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
        <div>
          <p className="font-heading text-lg font-semibold tracking-tight text-card-foreground">
            ৳{service.price}
          </p>
          <p className="text-xs text-muted-foreground">
            {service.duration} min
          </p>
        </div>

        <Link
          href={`/services/${service.id}`}
          className={buttonVariants({ size: "sm" })}
        >
          View details
        </Link>
      </div>
    </article>
  );
};

export default ServiceCard;
