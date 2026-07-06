import { AdminShell } from "@/components/layout/admin-shell";
import { HomepageView } from "@/features/homepage/homepage-view";

export default function HomepageBuilderPage() {
  return (
    <AdminShell>
      <HomepageView />
    </AdminShell>
  );
}
