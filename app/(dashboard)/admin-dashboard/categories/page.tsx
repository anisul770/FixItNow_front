import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCategories } from "@/service/getCategories";
import { getCurrentUser } from "@/service/getCurrentUser";
import CategoryForm from "../../_components/CategoryForm";

export const metadata: Metadata = {
  title: "Categories | FixItNow Admin",
  description: "The categories technicians file their services under.",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default async function AdminCategoriesPage() {
  const result = await getCurrentUser();

  // getCurrentUser answers with a failure object when there is no session.
  const currentUser = result && "id" in result ? result : null;

  if (!currentUser) redirect("/login");
  if (currentUser.role !== "ADMIN") redirect("/dashboard");

  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin-dashboard"
        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        ← Back to dashboard
      </Link>

      <header>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance">
          Categories
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {categories.length} categor{categories.length === 1 ? "y" : "ies"} ·
          technicians cannot publish a service without one.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <section>
          {categories.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
              <p className="font-heading text-base font-medium text-foreground">
                No categories yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Create the first one so technicians can list their services.
              </p>
            </div>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <p className="font-heading text-base font-medium text-card-foreground">
                    {category.name}
                  </p>
                  {category.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    Added {formatDate(category.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside>
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Add a category
          </h2>

          <div className="mt-4 rounded-xl border border-border bg-card p-5">
            <CategoryForm />
          </div>
        </aside>
      </div>
    </div>
  );
}
