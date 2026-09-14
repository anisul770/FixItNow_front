import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCategories } from "@/service/getCategories";
import { getCurrentUser } from "@/service/getCurrentUser";
import { getTechnicianProfile } from "../../_actions/(technician)/getTechnicianProfile";
import ServiceForm from "../../_components/ServiceForm";

export const metadata: Metadata = {
  title: "My services | FixItNow",
  description: "Publish the services customers can book you for.",
};

export default async function TechnicianServicesPage() {
  const result = await getCurrentUser();

  // getCurrentUser answers with a failure object when there is no session.
  const user = result && "id" in result ? result : null;

  if (!user) redirect("/login");
  if (user.role !== "TECHNICIAN") redirect("/dashboard");

  const [profile, categories] = await Promise.all([
    getTechnicianProfile(),
    getCategories(),
  ]);

  const services = profile?.services ?? [];

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance">
          My services
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Each service is what a customer books — set the price and how long the
          visit takes.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <section>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-semibold tracking-tight">
              Published
            </h2>
            <span className="text-sm text-muted-foreground">
              {services.length} listed
            </span>
          </div>

          {services.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-border px-6 py-12 text-center">
              <p className="font-heading text-base font-medium text-foreground">
                No services yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Publish your first one and it appears in the service browser.
              </p>
            </div>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {services.map((service) => (
                <li
                  key={service.id}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-card-foreground">
                        {service.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {service.category?.name ?? "Uncategorised"} ·{" "}
                        {service.duration} min
                        {!service.isActive && " · inactive"}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-medium tabular-nums text-card-foreground">
                      ৳{service.price}
                    </p>
                  </div>

                  {service.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside>
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Add a service
          </h2>

          <div className="mt-4 rounded-xl border border-border bg-card p-5">
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No categories are available yet — an admin has to create one
                before services can be published.
              </p>
            ) : (
              <ServiceForm categories={categories} />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
