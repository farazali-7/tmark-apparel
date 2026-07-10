import { AdminShell } from "@/components/layout/admin-shell";
import { ReviewsView } from "@/features/reviews/reviews-view";

export default function ReviewsPage() {
  return (
    <AdminShell>
      <ReviewsView />
    </AdminShell>
  );
}
