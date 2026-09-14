import type { Metadata } from "next";
import { redirect } from "next/navigation";

import type { ISlot } from "@/lib/types";
import { getCurrentUser } from "@/service/getCurrentUser";
import { getMySlots } from "../../_actions/(technician)/getMySlots";
import SlotDeleteButton from "../../_components/SlotDeleteButton";
import SlotForm from "../../_components/SlotForm";

export const metadata: Metadata = {
  title: "My slots | FixItNow",
  description: "Publish the times customers can book you for.",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const groupByDate = (slots: ISlot[]) => {
  const groups = new Map<string, ISlot[]>();

  for (const slot of slots) {
    groups.set(slot.date, [...(groups.get(slot.date) ?? []), slot]);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(
      ([date, items]) =>
        [
          date,
          [...items].sort((a, b) => a.startTime.localeCompare(b.startTime)),
        ] as const
    );
};

export default async function TechnicianSlotsPage() {
  const result = await getCurrentUser();

  // getCurrentUser answers with a failure object when there is no session.
  const user = result && "id" in result ? result : null;

  if (!user) redirect("/login");
  if (user.role !== "TECHNICIAN") redirect("/dashboard");

  const slots = await getMySlots();
  const grouped = groupByDate(slots);
  const openCount = slots.filter((slot) => !slot.isBooked).length;

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance">
          My slots
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {slots.length} published · {openCount} still open ·{" "}
          {slots.length - openCount} booked
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <section>
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Published slots
          </h2>

          {grouped.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-border px-6 py-12 text-center">
              <p className="font-heading text-base font-medium text-foreground">
                No slots published
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Customers can only book you once you publish availability.
              </p>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-4">
              {grouped.map(([date, items]) => (
                <div
                  key={date}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <p className="text-sm font-medium text-card-foreground">
                    {formatDate(date)}
                  </p>

                  <ul className="mt-3 flex flex-wrap gap-2">
                    {items.map((slot) => (
                      <li
                        key={slot.id}
                        className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs ${
                          slot.isBooked
                            ? "border-border bg-muted text-muted-foreground"
                            : "border-primary/40 bg-primary/10 text-card-foreground"
                        }`}
                      >
                        <span className="font-medium">
                          {slot.startTime} – {slot.endTime}
                        </span>
                        {slot.isBooked ? (
                          <span className="text-[10px] tracking-wide uppercase">
                            booked
                          </span>
                        ) : (
                          <SlotDeleteButton slotId={slot.id} />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside>
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Publish availability
          </h2>

          <div className="mt-4 rounded-xl border border-border bg-card p-5">
            <SlotForm />
          </div>
        </aside>
      </div>
    </div>
  );
}
