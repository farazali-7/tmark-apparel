// Temporary preview only.
// I will remove this import later and use the sidebar inside my admin layout.
import { AdminSidebar, AdminSidebarProvider } from "@/components/admin/sidebar";

export default function Home() {
  return (
    <AdminSidebarProvider>
      <div className="flex min-h-svh w-full">
        <AdminSidebar />
        <main className="flex flex-1 flex-col items-center justify-center gap-2 p-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Admin Dashboard Preview
          </h1>
          <p className="text-sm text-muted-foreground">
            This preview is temporary.
          </p>
        </main>
      </div>
    </AdminSidebarProvider>
  );
}
