import { AdminShell } from "@/components/layout/admin-shell";
import { AnalyticsView } from "@/features/analytics/analytics-view";

export default function AnalyticsPage() {
  return (
    <AdminShell>
      <AnalyticsView />
    </AdminShell>
  );
}
