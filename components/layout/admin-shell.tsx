import type { ReactNode } from "react"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { CommandMenu } from "@/components/layout/command-menu"
import { Topbar } from "@/components/layout/topbar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

interface AdminShellProps {
  children: ReactNode
}

export function AdminShell({ children }: AdminShellProps) {
  return (
    <SidebarProvider
      style={{ "--sidebar-width": "16rem" } as React.CSSProperties}
    >
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <Topbar />
        <main className="flex flex-1 flex-col gap-6 py-6">{children}</main>
      </SidebarInset>
      <CommandMenu />
    </SidebarProvider>
  )
}
