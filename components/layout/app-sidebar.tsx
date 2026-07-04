"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Scissors } from "lucide-react"

import { NAV_GROUPS } from "@/config/nav"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="h-14 justify-center border-b px-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 overflow-hidden rounded-md px-1 py-1"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background shadow-sm">
            <Scissors className="size-4" />
          </span>
          <span
            className={cn(
              "flex min-w-0 flex-col leading-none transition-opacity",
              collapsed && "opacity-0"
            )}
          >
            <span className="font-display truncate text-[0.95rem] font-medium tracking-tight">
              T-Mark
            </span>
            <span className="truncate text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase">
              Apparel
            </span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-1">
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label} className="py-1">
            <SidebarGroupLabel className="text-[0.65rem] tracking-[0.12em] uppercase">
              {group.label}
            </SidebarGroupLabel>
            <SidebarMenu className="gap-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href)

                if (item.disabled) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        tooltip={`${item.title} — coming soon`}
                        className="h-9 cursor-not-allowed text-muted-foreground/50 hover:bg-transparent hover:text-muted-foreground/50"
                        aria-disabled
                      >
                        <item.icon />
                        <span>{item.title}</span>
                        {item.badge ? (
                          <span className="ml-auto text-[0.65rem] text-muted-foreground/40 tabular">
                            {item.badge}
                          </span>
                        ) : null}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "group/nav relative h-9 font-medium",
                        isActive &&
                          "before:absolute before:top-1/2 before:-left-2 before:h-5 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-gold"
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                        {item.badge ? (
                          <span
                            className={cn(
                              "ml-auto rounded-md px-1.5 py-0.5 text-[0.65rem] tabular",
                              isActive
                                ? "bg-background/80 text-foreground"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {item.badge}
                          </span>
                        ) : null}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
