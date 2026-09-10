import type { Metadata } from "next";

import { getAllServices } from "../_actions/getAllServices";
import ServiceCard from "../_components/ServiceCard";

export const metadata: Metadata = {
  title: "Services | FixItNow",
  description: "Browse repair and maintenance services from vetted technicians.",
};

export default async function ServicesPage() {
  const services = await getAllServices();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance">
          Browse services
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Repair and maintenance jobs offered by technicians on FixItNow. Pick
          one to see availability and book a slot.
        </p>
      </header>

      {services.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <p className="font-heading text-base font-medium text-foreground">
            No services available right now
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check back shortly — technicians add new services regularly.
          </p>
        </div>
      ) : (
        <>
          <p className="mt-8 text-sm text-muted-foreground">
            {services.length} {services.length === 1 ? "service" : "services"}{" "}
            available
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
