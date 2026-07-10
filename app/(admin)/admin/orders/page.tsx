import { AdminShell } from "@/components/layout/admin-shell";
import { OrdersView } from "@/features/orders/orders-view";

export default function OrdersPage() {
  return (
    <AdminShell>
      <OrdersView />
    </AdminShell>
  );
}
