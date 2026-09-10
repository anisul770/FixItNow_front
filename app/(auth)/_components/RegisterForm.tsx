"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAction } from "../_actions/authActions";

const ROLES = [
  { value: "customer", title: "I need a technician" },
  { value: "technician", title: "I am a technician" },
];

const RegisterForm = () => {
  const [state, action, pending] = useActionState(registerAction, null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <form action={action} className="flex flex-col gap-4">
      <fieldset>
        <legend className="text-sm font-medium text-card-foreground">
          I am signing up to
        </legend>
        <div className="mt-1.5 grid grid-cols-2 gap-2.5">
          {ROLES.map((role, index) => (
            <label key={role.value} className="cursor-pointer">
              <input
                type="radio"
                name="role"
                value={role.value}
                defaultChecked={index === 0}
                className="peer sr-only"
              />
              <span className="block rounded-lg border border-input bg-background px-3 py-2 text-center text-sm text-muted-foreground transition-colors peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:font-medium peer-checked:text-card-foreground peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50">
                {role.title}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Anisul Haque"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+880 1XXX XXXXXX"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            minLength={4}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            minLength={4}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            aria-invalid={passwordsMismatch}
            required
          />
        </div>
      </div>

      {passwordsMismatch && (
        <p className="text-xs text-destructive">Passwords do not match.</p>
      )}

      <div className="flex items-center gap-2.5">
        <Checkbox id="terms" name="terms" required />
        <Label
          htmlFor="terms"
          className="text-xs font-normal text-muted-foreground"
        >
          I agree to the{" "}
          <Link
            href="/terms"
            className="text-foreground underline underline-offset-4"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-foreground underline underline-offset-4"
          >
            Privacy Policy
          </Link>
        </Label>
      </div>

      {state && (
        <p
          aria-live="polite"
          className={`rounded-lg border px-3 py-2 text-xs ${
            state.success
              ? "border-primary/40 bg-primary/10 text-card-foreground"
              : "border-destructive/40 bg-destructive/10 text-destructive"
          }`}
        >
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        className="mt-1 w-full"
        disabled={pending || passwordsMismatch}
      >
        {pending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
};

export default RegisterForm;
