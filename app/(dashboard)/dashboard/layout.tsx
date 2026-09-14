import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/service/getCurrentUser";

export default async function CustomerDashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const result = await getCurrentUser();
  const user = result && "id" in result ? result : null;

  if (!user) redirect("/login");
  if (user.role !== "CUSTOMER") notFound();

  return children;
}
