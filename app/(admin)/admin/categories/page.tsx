import { AdminShell } from "@/components/layout/admin-shell";
import { CategoriesView } from "@/features/categories/categories-view";

export default function CategoriesPage() {
  return (
    <AdminShell>
      <CategoriesView />
    </AdminShell>
  );
}
