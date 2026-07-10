import { AdminShell } from "@/components/layout/admin-shell";
import { CollectionsView } from "@/features/collections/collections-view";

export default function CollectionsPage() {
  return (
    <AdminShell>
      <CollectionsView />
    </AdminShell>
  );
}
