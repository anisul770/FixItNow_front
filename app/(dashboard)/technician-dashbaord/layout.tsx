import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/service/getCurrentUser";

export default async function TechnicianDashboardLayout({
  children,
}: LayoutProps<"/technician-dashbaord">) {
  const result = await getCurrentUser();
  const user = result && "id" in result ? result : null;

  if (!user) redirect("/login");
  if (user.role !== "TECHNICIAN") notFound();

  return children;
}
