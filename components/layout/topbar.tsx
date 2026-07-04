"use client"

import { toast } from "sonner"
import {
  Bell,
  FolderPlus,
  Image,
  LogOut,
  PackagePlus,
  Plus,
  Search,
  Settings,
  User,
} from "lucide-react"

import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { OPEN_COMMAND_EVENT } from "@/components/layout/command-menu"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { EntityAvatar } from "@/components/shared/entity-avatar"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { formatRelative } from "@/lib/constants"
import { activityEvents } from "@/lib/mock-data/dashboard"

function openCommand() {
  window.dispatchEvent(new Event(OPEN_COMMAND_EVENT))
}

const quickCreate = [
  { label: "New product", icon: PackagePlus },
  { label: "New category", icon: FolderPlus },
  { label: "New banner", icon: Image },
]

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/85 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/65 sm:px-4">
      <SidebarTrigger className="-ml-0.5" />
      <Separator orientation="vertical" className="mr-1 h-5" />
      <Breadcrumbs />

      <div className="flex flex-1 items-center justify-end gap-1.5">
        <button
          type="button"
          onClick={openCommand}
          className="mr-1 hidden h-9 w-56 items-center gap-2 rounded-lg border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted lg:flex"
        >
          <Search className="size-4" />
          <span className="flex-1 text-left">Search…</span>
          <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground">
            ⌘K
          </kbd>
        </button>

        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          onClick={openCommand}
          aria-label="Search"
        >
          <Search className="size-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="size-4" />
              <span className="hidden sm:inline">Create</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Quick create</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {quickCreate.map((item) => (
              <DropdownMenuItem
                key={item.label}
                onSelect={() => toast.success(`${item.label} — form ready`)}
              >
                <item.icon />
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="relative"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-gold ring-2 ring-background" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <p className="text-sm font-semibold">Notifications</p>
              <StatusBadge label="6 new" tone="gold" />
            </div>
            <div className="max-h-80 divide-y overflow-y-auto">
              {activityEvents.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col gap-0.5 px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <p className="text-sm leading-snug">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.meta} · {formatRelative(event.timestamp)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t p-2">
              <Button variant="ghost" size="sm" className="w-full">
                View all activity
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <ThemeToggle />

        <Separator orientation="vertical" className="mx-0.5 h-5" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-1.5">
              <EntityAvatar initials="TA" seed="tmark-admin" className="size-7" />
              <span className="hidden text-sm font-medium sm:inline">Owner</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">Owner</p>
              <p className="text-xs text-muted-foreground">
                owner@tmarkapparel.com
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOut /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
