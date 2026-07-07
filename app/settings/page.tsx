import { AdminShell } from "@/components/layout/admin-shell";
import { SettingsView } from "@/features/settings/settings-view";

export default function SettingsPage() {
  return (
    <AdminShell>
      <SettingsView />
    </AdminShell>
  );
}
