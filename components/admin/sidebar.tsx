"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  MessageSquareQuote,
  BarChart3,
  Settings,
  ShirtIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard },
  { title: "Products", icon: Package },
  { title: "Categories", icon: FolderTree },
  { title: "Orders", icon: ShoppingCart },
  { title: "Customers", icon: Users },
  { title: "Reviews", icon: MessageSquareQuote },
  { title: "Analytics", icon: BarChart3 },
  { title: "Settings", icon: Settings },
] as const

export function AdminSidebar() {
  const [active, setActive] = React.useState<string>("Dashboard")

  return (
    <Sidebar
      collapsible="none"
      className="h-svh w-[260px] shrink-0 border-r border-sidebar-border"
    >
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <ShirtIcon className="size-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">
              T-Mark Apparel
            </span>
            <span className="text-xs text-sidebar-foreground/60">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const isActive = active === item.title
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => setActive(item.title)}
                      className="h-10 rounded-lg px-3 text-sm font-medium transition-all duration-200 data-active:shadow-sm hover:translate-x-0.5"
                    >
                      <item.icon className="size-4.5" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-4 py-3">
        <span className="text-xs font-medium text-sidebar-foreground/60">
          T-Mark Apparel Admin
        </span>
      </SidebarFooter>
    </Sidebar>
  )
}

export function AdminSidebarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <SidebarProvider className="min-h-svh">{children}</SidebarProvider>
}
