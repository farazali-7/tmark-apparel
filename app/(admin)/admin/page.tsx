import { AdminShell } from "@/components/layout/admin-shell";
import { DashboardView } from "@/features/dashboard/dashboard-view";

export default function DashboardPage() {
  return (
    <AdminShell>
      <DashboardView />
    </AdminShell>
  );
}
