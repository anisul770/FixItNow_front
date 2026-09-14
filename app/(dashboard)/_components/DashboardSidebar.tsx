"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { INavItem, IUser, TUserRole } from "@/lib/types";

const SIDEBAR_BY_ROLE: Record<TUserRole, { group: string; items: INavItem[] }> =
  {
    CUSTOMER: {
      group: "My account",
      items: [
        { label: "Overview", href: "/dashboard" },
        { label: "My bookings", href: "/dashboard/bookings" },
        { label: "My payments", href: "/dashboard/payments" },
        { label: "My reviews", href: "/dashboard/reviews" },
      ],
    },
    TECHNICIAN: {
      group: "My work",
      items: [
        { label: "Overview", href: "/technician-dashbaord" },
        { label: "My services", href: "/technician-dashbaord/services" },
        { label: "My slots", href: "/technician-dashbaord/slots" },
        { label: "Booking requests", href: "/technician-dashbaord/bookings" },
      ],
    },
    ADMIN: {
      group: "Administration",
      items: [
        { label: "Overview", href: "/admin-dashboard" },
        { label: "Users", href: "/admin-dashboard/users" },
        { label: "Technicians", href: "/admin-dashboard/technicians" },
        { label: "Bookings", href: "/admin-dashboard/bookings" },
        { label: "Payments", href: "/admin-dashboard/payments" },
        { label: "Categories", href: "/admin-dashboard/categories" },
      ],
    },
  };

const ACCOUNT_ITEMS: INavItem[] = [{ label: "Profile", href: "/profile" }];

const BROWSE_ITEMS: INavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Technicians", href: "/technicians" },
];

interface IDashboardSidebarProps {
  user: IUser;
  pendingReviews?: number;
}

const DashboardSidebar = ({
  user,
  pendingReviews = 0,
}: IDashboardSidebarProps) => {
  const pathname = usePathname();
  const { group, items } = SIDEBAR_BY_ROLE[user.role];

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2.5 px-2 py-1.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
              <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
            </svg>
          </span>
          <span className="font-heading text-base font-semibold tracking-tight">
            FixItNow
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{group}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    render={<Link href={item.href} />}
                  >
                    {item.label}
                  </SidebarMenuButton>

                  {item.href === "/dashboard/reviews" && pendingReviews > 0 && (
                    <SidebarMenuBadge>{pendingReviews}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ACCOUNT_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    render={<Link href={item.href} />}
                  >
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Browse</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {BROWSE_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton render={<Link href={item.href} />}>
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
