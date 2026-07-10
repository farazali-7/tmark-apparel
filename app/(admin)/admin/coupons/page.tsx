import { AdminShell } from "@/components/layout/admin-shell";
import { PromotionsView } from "@/features/promotions/promotions-view";

export default function CouponsPage() {
  return (
    <AdminShell>
      <PromotionsView />
    </AdminShell>
  );
}
