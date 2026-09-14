"use client";

import { useOptimistic, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IUser } from "@/lib/types";
import { updateProfile } from "../_actions/(user)/updateProfile";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const toTitleCase = (value: string) =>
  value.charAt(0) + value.slice(1).toLowerCase();

interface IProfileEditorProps {
  user: IUser;
}

/**
 * Holds the optimistic copy of name/phone/address so the summary card next
 * to the form updates the instant Save is pressed, not once the request
 * that follows resolves. The toast reports what that request found out.
 */
const ProfileEditor = ({ user }: IProfileEditorProps) => {
  const [pending, setPending] = useState(false);

  const [optimisticUser, setOptimisticUser] = useOptimistic(
    user,
    (
      state,
      patch: { name: string; phone: string; address: string }
    ): IUser => ({
      ...state,
      name: patch.name,
      profile: {
        id: state.profile?.id ?? "",
        userId: state.id,
        profilePhoto: state.profile?.profilePhoto ?? null,
        phone: patch.phone || null,
        address: patch.address || null,
        createdAt: state.profile?.createdAt ?? "",
        updatedAt: state.profile?.updatedAt ?? "",
      },
    })
  );

  const formAction = async (formData: FormData) => {
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();

    // Shown right away — the request behind it hasn't been sent yet.
    setOptimisticUser({ name, phone, address });

    setPending(true);
    const result = await updateProfile(null, formData);
    setPending(false);

    if (result?.success) {
      toast.success(result.message);
    } else {
      toast.error(result?.message ?? "Could not update your profile.");
    }
  };

  const technicianProfile = user.technicianProfile;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <section>
        <h2 className="font-heading text-lg font-semibold tracking-tight">
          Edit details
        </h2>

        <div className="mt-4 rounded-xl border border-border bg-card p-5">
          <form action={formAction} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                defaultValue={user.name}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                readOnly
                disabled
                aria-describedby="email-hint"
              />
              <p id="email-hint" className="text-xs text-muted-foreground">
                Your email cannot be changed here.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+880 1XXX XXXXXX"
                defaultValue={user.profile?.phone ?? ""}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                type="text"
                autoComplete="street-address"
                placeholder="House, road, city"
                defaultValue={user.profile?.address ?? ""}
              />
            </div>

            <div>
              <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </div>
      </section>

      <aside className="flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground">
              {optimisticUser.name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate font-heading text-base font-semibold tracking-tight text-foreground">
                {optimisticUser.name}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>

          <dl className="mt-4 rounded-xl border border-border bg-card p-4 text-sm">
            <div className="flex justify-between gap-3 py-1.5">
              <dt className="text-muted-foreground">Role</dt>
              <dd className="text-card-foreground">
                {toTitleCase(user.role)}
              </dd>
            </div>
            <div className="flex justify-between gap-3 py-1.5">
              <dt className="text-muted-foreground">Account</dt>
              <dd
                className={
                  user.activeStatus === "BLOCKED"
                    ? "text-destructive"
                    : "text-card-foreground"
                }
              >
                {toTitleCase(user.activeStatus)}
              </dd>
            </div>
            <div className="flex justify-between gap-3 py-1.5">
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="text-card-foreground">
                {optimisticUser.profile?.phone ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-3 py-1.5">
              <dt className="text-muted-foreground">Address</dt>
              <dd className="max-w-40 truncate text-card-foreground">
                {optimisticUser.profile?.address ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-3 py-1.5">
              <dt className="text-muted-foreground">Member since</dt>
              <dd className="text-card-foreground">
                {formatDate(user.createdAt)}
              </dd>
            </div>
          </dl>
        </div>

        {technicianProfile && (
          <div>
            <h2 className="font-heading text-lg font-semibold tracking-tight">
              Technician details
            </h2>
            <dl className="mt-4 rounded-xl border border-border bg-card p-4 text-sm">
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-muted-foreground">Verification</dt>
                <dd className="text-card-foreground">
                  {technicianProfile.verified ? "Verified" : "Pending"}
                </dd>
              </div>
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-muted-foreground">Experience</dt>
                <dd className="text-card-foreground">
                  {technicianProfile.experience} yrs
                </dd>
              </div>
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-muted-foreground">Hourly rate</dt>
                <dd className="text-card-foreground">
                  ৳{technicianProfile.hourlyRate}
                </dd>
              </div>
              <div className="flex justify-between gap-3 py-1.5">
                <dt className="text-muted-foreground">Rating</dt>
                <dd className="text-card-foreground">
                  {technicianProfile.totalReviews > 0
                    ? `${technicianProfile.averageRating.toFixed(1)} (${technicianProfile.totalReviews})`
                    : "—"}
                </dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-muted-foreground">
              Bio, skills and rate are not editable through this endpoint.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
};

export default ProfileEditor;
