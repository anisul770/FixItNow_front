import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/service/getCurrentUser";
import ProfileEditor from "../_components/ProfileEditor";

export const metadata: Metadata = {
  title: "Profile | FixItNow",
  description: "View and update your account details.",
};

export default async function ProfilePage() {
  const result = await getCurrentUser();

  const user = result && "id" in result ? result : null;

  if (!user) redirect("/login");

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance">
          Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View your account details and keep your contact information current.
        </p>
      </header>

      <ProfileEditor user={user} />
    </div>
  );
}
