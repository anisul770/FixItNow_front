"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { INavItem, IUser, TUserRole } from "@/lib/types";
import { logout } from "@/service/logout";

const PUBLIC_LINKS: INavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Technicians", href: "/technicians" },
];

const DASHBOARD_BY_ROLE: Record<TUserRole, string> = {
  CUSTOMER: "/dashboard",
  TECHNICIAN: "/technician-dashbaord",
  ADMIN: "/admin-dashboard",
};

const MENU_BY_ROLE: Record<TUserRole, INavItem[]> = {
  CUSTOMER: [
    { label: "My bookings", href: "/dashboard/bookings" },
    { label: "My payments", href: "/dashboard/payments" },
    { label: "My reviews", href: "/dashboard/reviews" },
  ],
  TECHNICIAN: [
    { label: "My services", href: "/technician-dashbaord/services" },
    { label: "My slots", href: "/technician-dashbaord/slots" },
    { label: "Booking requests", href: "/technician-dashbaord/bookings" },
  ],
  ADMIN: [
    { label: "Users", href: "/admin-dashboard/users" },
    { label: "Bookings", href: "/admin-dashboard/bookings" },
    { label: "Payments", href: "/admin-dashboard/payments" },
    { label: "Categories", href: "/admin-dashboard/categories" },
  ],
};

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

interface INavbarClientProps {
  user: IUser | null;
}

const NavbarClient = ({ user }: INavbarClientProps) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Any navigation should leave both menus closed.
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!userMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [userMenuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const dashboardHref = user ? DASHBOARD_BY_ROLE[user.role] : null;
  const roleLinks = user ? MENU_BY_ROLE[user.role] : [];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
              <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
            </svg>
          </span>
          <span className="font-heading text-base font-semibold tracking-tight">
            FixItNow
          </span>
        </Link>

        <ul className="ml-4 hidden items-center gap-1 md:flex">
          {PUBLIC_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <div className="relative hidden md:block" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((open) => !open)}
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full border border-border py-1 pr-3 pl-1 transition-colors hover:bg-muted"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {getInitials(user.name)}
                </span>
                <span className="max-w-28 truncate text-sm font-medium">
                  {user.name}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className={cn(
                    "size-3.5 text-muted-foreground transition-transform",
                    userMenuOpen && "rotate-180"
                  )}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {userMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-border bg-popover shadow-lg"
                >
                  <div className="border-b border-border px-4 py-3">
                    <p className="truncate text-sm font-medium text-popover-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                    <span className="mt-2 inline-flex rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-foreground uppercase">
                      {user.role}
                    </span>
                  </div>

                  <div className="flex flex-col py-1">
                    {dashboardHref && (
                      <Link
                        href={dashboardHref}
                        className="px-4 py-2 text-sm text-popover-foreground transition-colors hover:bg-muted"
                      >
                        Dashboard
                      </Link>
                    )}
                    {roleLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="px-4 py-2 text-sm text-popover-foreground transition-colors hover:bg-muted"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  <form action={logout} className="border-t border-border">
                    <button
                      type="submit"
                      className="w-full px-4 py-2.5 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
                    >
                      Log out
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
                Log in
              </Link>
              <Link href="/register" className={buttonVariants()}>
                Sign up
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
            className="flex size-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              aria-hidden
              className="size-4"
            >
              {mobileOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <ul className="flex flex-col gap-1 px-4 py-3">
            {PUBLIC_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-t border-border px-4 py-3">
            {user ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2.5 px-3 pb-2">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {getInitials(user.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>

                {dashboardHref && (
                  <Link
                    href={dashboardHref}
                    className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    Dashboard
                  </Link>
                )}
                {roleLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}

                <form action={logout}>
                  <button
                    type="submit"
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
                  >
                    Log out
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  className={buttonVariants({ variant: "outline" })}
                >
                  Log in
                </Link>
                <Link href="/register" className={buttonVariants()}>
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavbarClient;
