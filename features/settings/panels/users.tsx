"use client"

import * as React from "react"
import { toast } from "sonner"
import { Check, Mail, MoreHorizontal, Send, ShieldCheck, UserPlus } from "lucide-react"

import { EntityAvatar } from "@/components/shared/entity-avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  SettingsSection,
  StatusIndicator,
} from "@/features/settings/components/settings-primitives"
import { formatRelative } from "@/lib/constants"
import {
  permissionMatrix,
  roles,
  staff,
  type StaffRole,
  type StaffStatus,
} from "@/lib/mock-data/settings"
import { cn } from "@/lib/utils"

const STATUS_TONE: Record<StaffStatus, "success" | "info" | "danger"> = {
  active: "success",
  invited: "info",
  suspended: "danger",
}
const STATUS_LABEL: Record<StaffStatus, string> = {
  active: "Active",
  invited: "Invited",
  suspended: "Suspended",
}
const ROLE_COLS: StaffRole[] = ["Owner", "Admin", "Manager", "Support", "Staff"]

export function StaffPanel() {
  return (
    <SettingsSection
      title="Staff members"
      description={`${staff.length} people have access to this store.`}
      action={
        <Button size="sm" onClick={() => toast.success("Invite sent")}>
          <UserPlus className="size-4" /> Invite
        </Button>
      }
    >
      {staff.map((member) => (
        <div key={member.id} className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
          <EntityAvatar initials={member.initials} seed={member.id} className="size-9" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium">{member.name}</p>
              <span className="rounded-md border px-1.5 py-0.5 text-[0.7rem] text-muted-foreground">{member.role}</span>
            </div>
            <p className="truncate text-xs text-muted-foreground">{member.email}</p>
          </div>
          <div className="hidden text-right sm:block">
            <StatusIndicator label={STATUS_LABEL[member.status]} tone={STATUS_TONE[member.status]} />
            <p className="mt-0.5 text-[0.7rem] text-muted-foreground">
              {member.lastActive ? `Active ${formatRelative(member.lastActive)}` : "Never signed in"}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="text-muted-foreground data-[state=open]:bg-muted">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Manage {member.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onSelect={() => toast.success("Role updated")}>Change role</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toast.success("Access reset link sent")}>Reset access</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => toast(`${member.name} removed`)}>Remove</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </SettingsSection>
  )
}

export function RolesPanel() {
  return (
    <div className="space-y-5">
      <SettingsSection
        title="Roles"
        description="Predefined access levels for your team."
        action={<Button variant="outline" size="sm" onClick={() => toast.success("New role created")}><ShieldCheck className="size-4" /> New role</Button>}
      >
        {roles.map((role) => (
          <div key={role.id} className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{role.name}</p>
                {role.system ? (
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[0.7rem] text-muted-foreground">System</span>
                ) : null}
              </div>
              <p className="truncate text-xs text-muted-foreground">{role.description}</p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <span className="hidden text-xs text-muted-foreground tabular sm:inline">
                {role.members} member{role.members === 1 ? "" : "s"}
              </span>
              <span className="text-xs text-muted-foreground tabular">
                {role.permissions}/{role.totalPermissions} perms
              </span>
              <Button variant="ghost" size="sm" disabled={role.system} onClick={() => toast.success(`Editing ${role.name}`)}>
                Edit
              </Button>
            </div>
          </div>
        ))}
      </SettingsSection>

      <SettingsSection title="Permission matrix" description="What each role can do across the admin.">
        <div className="overflow-x-auto p-4 sm:p-5">
          <table className="w-full min-w-[34rem] border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="pb-2 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">Capability</th>
                {ROLE_COLS.map((r) => (
                  <th key={r} className="pb-2 text-center text-xs font-medium text-muted-foreground">{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissionMatrix.map((group) => (
                <React.Fragment key={group.area}>
                  <tr>
                    <td colSpan={ROLE_COLS.length + 1} className="pt-3 pb-1 text-xs font-semibold">{group.area}</td>
                  </tr>
                  {group.actions.map((action) => (
                    <tr key={action.label} className="group">
                      <td className="border-t py-2 pr-4 text-muted-foreground">{action.label}</td>
                      {ROLE_COLS.map((r) => (
                        <td key={r} className="border-t py-2 text-center">
                          {action.roles.includes(r) ? (
                            <Check className="mx-auto size-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <span className="text-muted-foreground/30">·</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsSection>
    </div>
  )
}

export function InvitationsPanel() {
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState<StaffRole>("Staff")
  const pending = staff.filter((s) => s.status === "invited")

  return (
    <div className="space-y-5">
      <SettingsSection title="Invite a teammate" description="Send an email invitation to join the admin.">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:p-5">
          <div className="flex-1 space-y-1.5">
            <label className="text-xs text-muted-foreground" htmlFor="invite-email">Email address</label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="invite-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" className="h-9 pl-9" />
            </div>
          </div>
          <div className="space-y-1.5 sm:w-40">
            <label className="text-xs text-muted-foreground">Role</label>
            <Select value={role} onValueChange={(v) => setRole(v as StaffRole)}>
              <SelectTrigger className="h-9 w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Admin", "Manager", "Support", "Staff"].map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            className="sm:mb-0"
            disabled={!email.trim()}
            onClick={() => {
              toast.success(`Invitation sent to ${email}`)
              setEmail("")
            }}
          >
            <Send className="size-4" /> Send invite
          </Button>
        </div>
      </SettingsSection>

      <SettingsSection title="Pending invitations" description={`${pending.length} awaiting acceptance.`}>
        {pending.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">No pending invitations.</p>
        ) : (
          pending.map((member) => (
            <div key={member.id} className={cn("flex items-center gap-3 px-4 py-3.5 sm:px-5")}>
              <span className="flex size-9 items-center justify-center rounded-full border border-dashed text-muted-foreground">
                <Mail className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{member.email}</p>
                <p className="text-xs text-muted-foreground">Invited as {member.role}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => toast.success("Invitation resent")}>Resend</Button>
              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => toast("Invitation revoked")}>Revoke</Button>
            </div>
          ))
        )}
      </SettingsSection>
    </div>
  )
}
