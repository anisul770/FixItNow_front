import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "../_components/LoginForm";

export const metadata: Metadata = {
  title: "Log in | FixItNow",
  description: "Log in to your FixItNow account to book and manage services.",
};

const HIGHLIGHTS = [
  "Background-checked pros in your area",
  "Upfront pricing, no surprise callout fees",
  "Same-day slots for urgent repairs",
];

function BoltMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <main className="grid w-full min-h-svh lg:grid-cols-2">
      {/* Brand panel — always dark, so it reads as a poster in either theme */}
      <section className="relative hidden overflow-hidden bg-[oklch(0.17_0.01_107)] p-12 text-[oklch(0.98_0.003_106)] lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(60% 55% at 15% 0%, color-mix(in oklch, var(--primary), transparent 78%), transparent 70%), radial-gradient(45% 45% at 100% 100%, color-mix(in oklch, var(--chart-3), transparent 85%), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(70% 60% at 50% 40%, #000, transparent)",
          }}
        />

        <div className="relative flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <BoltMark className="size-5" />
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight">
            FixItNow
          </span>
        </div>

        <div className="relative max-w-md">
          <h2 className="font-heading text-4xl leading-[1.1] font-semibold tracking-tight text-balance">
            Fix it now.
            <span className="block text-primary">Not next week.</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[oklch(0.98_0.003_106_/_0.65)]">
            Book a trusted technician in minutes, track the job from your
            dashboard, and pay only when the work is done.
          </p>

          <ul className="mt-8 flex flex-col gap-3.5">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                    className="size-3"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span className="text-[oklch(0.98_0.003_106_/_0.8)]">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-[oklch(0.98_0.003_106_/_0.45)]">
          &copy; {new Date().getFullYear()} FixItNow. All rights reserved.
        </p>
      </section>

      {/* Form panel */}
      <section className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-2.5 lg:hidden"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <BoltMark className="size-5" />
            </span>
            <span className="font-heading text-lg font-semibold tracking-tight">
              FixItNow
            </span>
          </Link>

          <Card className="border-border/70 shadow-xl shadow-black/[0.03]">
            <CardHeader className="text-center">
              <CardTitle className="font-heading text-2xl tracking-tight">
                Welcome back
              </CardTitle>
              <CardDescription>
                Log in to book a technician or manage your jobs.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-6">
              <Button variant="outline" size="lg" className="w-full">
                <svg viewBox="0 0 18 18" aria-hidden className="size-4">
                  <path
                    fill="#4285F4"
                    d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.909c1.702-1.567 2.683-3.874 2.683-6.614Z"
                  />
                  <path
                    fill="#34A853"
                    d="M9 18c2.43 0 4.467-.806 5.956-2.181l-2.909-2.258c-.806.54-1.837.859-3.047.859-2.344 0-4.328-1.583-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M3.964 10.71a5.41 5.41 0 0 1 0-3.42V4.958H.957a9.003 9.003 0 0 0 0 8.084l3.007-2.332Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M9 3.58c1.321 0 2.508.454 3.44 1.346l2.582-2.582C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
                  />
                </svg>
                Continue with Google
              </Button>

              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  or
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>
                {/* Login Form */}
              <LoginForm/>
            </CardContent>

            <CardFooter className="justify-center border-t pt-6">
              <p className="text-sm text-muted-foreground">
                New to FixItNow?{" "}
                <Link
                  href="/register"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </CardFooter>
          </Card>

          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
            By logging in you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
