import Navbar from "@/components/shared/Navbar";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-svh w-full flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
