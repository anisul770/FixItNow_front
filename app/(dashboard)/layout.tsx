import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getCurrentUser } from "@/service/getCurrentUser";
import DashboardSidebar from "./_components/DashboardSidebar";
import DashboardUserMenu from "./_components/DashboardUserMenu";

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const result = await getCurrentUser();

  // getCurrentUser answers with a failure object when there is no session.
  const user = result && "id" in result ? result : null;

  // Pages redirect unauthenticated visitors themselves; render them bare so the
  // sidebar never flashes for a signed-out request.
  if (!user) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        {children}
      </main>
    );
  }

  // Completed jobs with no review yet — badged in the sidebar so the prompt
  // follows the customer across every dashboard page.
  const reviewedBookingIds = new Set(
    (user.customerReviews ?? []).map((review) => review.bookingId)
  );
  const pendingReviews = (user.customerBookings ?? []).filter(
    (booking) =>
      booking.status === "COMPLETED" && !reviewedBookingIds.has(booking.id)
  ).length;

  return (
    <SidebarProvider>
      <DashboardSidebar user={user} pendingReviews={pendingReviews} />

      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger />

          <div className="ml-auto">
            <DashboardUserMenu user={user} />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
