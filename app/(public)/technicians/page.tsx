import type { Metadata } from "next";

import { getAllTechnicians } from "../_actions/getAllTechnicians";
import TechnicianCard from "../_components/TechnicianCard";

export const metadata: Metadata = {
  title: "Technicians | FixItNow",
  description: "Browse vetted technicians, their skills, rates and ratings.",
};

export default async function TechniciansPage() {
  const technicians = await getAllTechnicians();

  const sorted = [...technicians].sort((a, b) => {
    if (a.verified !== b.verified) return a.verified ? -1 : 1;
    return b.averageRating - a.averageRating;
  });

  const verifiedCount = technicians.filter(
    (technician) => technician.verified
  ).length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance">
          Technicians
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The people behind the work — their skills, rates and ratings. Open a
          profile to see the services they offer.
        </p>
      </header>

      {sorted.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <p className="font-heading text-base font-medium text-foreground">
            No technicians listed yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check back shortly — new technicians join regularly.
          </p>
        </div>
      ) : (
        <>
          <p className="mt-8 text-sm text-muted-foreground">
            {technicians.length}{" "}
            {technicians.length === 1 ? "technician" : "technicians"} ·{" "}
            {verifiedCount} verified
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((technician) => (
              <TechnicianCard key={technician.id} technician={technician} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
