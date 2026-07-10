import type { Metadata } from "next"

import { HomepageView } from "@/features/homepage/homepage-view"

export const metadata: Metadata = {
  title: "Homepage Builder",
}

export default function HomepageBuilderPage() {
  return <HomepageView />
}
