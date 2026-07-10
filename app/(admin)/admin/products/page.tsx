import { AdminShell } from "@/components/layout/admin-shell";
import { ProductsView } from "@/features/products/products-view";

export default function ProductsPage() {
  return (
    <AdminShell>
      <ProductsView />
    </AdminShell>
  );
}
