import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getCurrentUser } from "@/service/getCurrentUser";
import DashboardSidebar from "./_components/DashboardSidebar";

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

  return (
    <SidebarProvider>
      <DashboardSidebar user={user} />

      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger />
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
