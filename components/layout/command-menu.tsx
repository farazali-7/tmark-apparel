"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  LayoutDashboard,
  Moon,
  Package,
  PackagePlus,
  ShoppingCart,
  Sun,
} from "lucide-react"
import { useTheme } from "next-themes"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { ADMIN_ROOT } from "@/config/nav"

export const OPEN_COMMAND_EVENT = "tmark:open-command"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { setTheme } = useTheme()

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener("keydown", onKey)
    window.addEventListener(OPEN_COMMAND_EVENT, onOpen)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener(OPEN_COMMAND_EVENT, onOpen)
    }
  }, [])

  const run = React.useCallback((fn: () => void) => {
    setOpen(false)
    fn()
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search or jump to…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => run(() => router.push(ADMIN_ROOT))}>
            <LayoutDashboard />
            Dashboard
          </CommandItem>
          <CommandItem
            onSelect={() => run(() => router.push(`${ADMIN_ROOT}/products`))}
          >
            <Package />
            Products
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() =>
              run(() => toast.success("Opening new product form…"))
            }
          >
            <PackagePlus />
            Add product
          </CommandItem>
          <CommandItem
            onSelect={() => run(() => toast("Orders module coming soon"))}
          >
            <ShoppingCart />
            View orders
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => run(() => setTheme("light"))}>
            <Sun />
            Light
          </CommandItem>
          <CommandItem onSelect={() => run(() => setTheme("dark"))}>
            <Moon />
            Dark
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
