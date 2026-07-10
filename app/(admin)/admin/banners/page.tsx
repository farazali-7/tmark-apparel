import type { Metadata } from "next"

import { BannersView } from "@/features/banners/banners-view"

export const metadata: Metadata = {
  title: "Campaigns",
}

export default function BannersPage() {
  return <BannersView />
}
