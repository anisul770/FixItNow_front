"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { IUser } from "@/lib/types";
import { DASHBOARD_PATH_BY_ROLE } from "@/lib/routes";
import { logout } from "@/service/logout";

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

interface IDashboardUserMenuProps {
  user: IUser;
}

const DashboardUserMenu = ({ user }: IDashboardUserMenuProps) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-border py-1 pr-3 pl-1 transition-colors hover:bg-muted"
      >
        <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {getInitials(user.name)}
        </span>
        <span className="hidden max-w-28 truncate text-sm font-medium sm:block">
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
            open && "rotate-180"
          )}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
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
            <Link
              href={DASHBOARD_PATH_BY_ROLE[user.role]}
              className="px-4 py-2 text-sm text-popover-foreground transition-colors hover:bg-muted"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="px-4 py-2 text-sm text-popover-foreground transition-colors hover:bg-muted"
            >
              Profile
            </Link>
            <Link
              href="/"
              className="px-4 py-2 text-sm text-popover-foreground transition-colors hover:bg-muted"
            >
              Back to site
            </Link>
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
  );
};

export default DashboardUserMenu;
