import { AdminShell } from "@/components/layout/admin-shell";
import { BannersView } from "@/features/banners/banners-view";

export default function BannersPage() {
  return (
    <AdminShell>
      <BannersView />
    </AdminShell>
  );
}
