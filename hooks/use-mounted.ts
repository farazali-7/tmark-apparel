"use client"

import * as React from "react"

/**
 * `false` on the server and the first client render, `true` after mount. Use it
 * to defer client-only widgets (e.g. Recharts' ResponsiveContainer, which
 * measures the DOM) so they never render — and warn about a -1 size — during
 * static prerendering.
 */
export function useMounted() {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  return mounted
}
