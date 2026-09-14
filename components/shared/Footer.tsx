import Link from "next/link";

import { DASHBOARD_PATH_BY_ROLE } from "@/lib/routes";
import { getCurrentUser } from "@/service/getCurrentUser";

const EXPLORE_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Technicians", href: "/technicians" },
];

const GUEST_LINKS = [
  { label: "Log in", href: "/login" },
  { label: "Create account", href: "/register" },
];

function BoltMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
    </svg>
  );
}

const Footer = async () => {
  const result = await getCurrentUser();
  const user = result && "id" in result ? result : null;

  const accountLinks = user
    ? [
        { label: "Dashboard", href: DASHBOARD_PATH_BY_ROLE[user.role] },
        { label: "Profile", href: "/profile" },
      ]
    : GUEST_LINKS;

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BoltMark className="size-4" />
              </span>
              <span className="font-heading text-base font-semibold tracking-tight">
                FixItNow
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Book a trusted technician in minutes, track the job, and pay
              only when the work is done.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-16">
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Explore
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {EXPLORE_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Account
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {accountLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} FixItNow. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
