import { AdminShell } from "@/components/layout/admin-shell";
import { CustomersView } from "@/features/customers/customers-view";

export default function CustomersPage() {
  return (
    <AdminShell>
      <CustomersView />
    </AdminShell>
  );
}
