import type { Metadata } from "next"

import { AuthView } from "@/features/auth/components/auth-view"

export const metadata: Metadata = {
  title: "Sign In — T-Mark Apparel",
  description:
    "Sign in to your T-Mark Apparel account or create one to begin your made-to-measure journey.",
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams
  return <AuthView initialTab={tab === "signup" ? "signup" : "signin"} />
}
