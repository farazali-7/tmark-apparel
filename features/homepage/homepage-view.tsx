"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  Eye,
  History,
  Redo2,
  RotateCcw,
  Save,
  Settings2,
  Undo2,
  UploadCloud,
} from "lucide-react"

import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { PreviewSwitcher, type PreviewDevice } from "@/components/shared/device-preview"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AddSectionDialog } from "@/features/homepage/components/add-section-dialog"
import { GlobalSettings } from "@/features/homepage/components/global-settings"
import { HistoryDrawer } from "@/features/homepage/components/history-drawer"
import { HomepagePreview } from "@/features/homepage/components/homepage-preview"
import { PublishDialog } from "@/features/homepage/components/publish-dialog"
import { SectionEditor } from "@/features/homepage/components/section-editor"
import { SectionList } from "@/features/homepage/components/section-list"
import { SECTION_FIELDS } from "@/features/homepage/section-config"
import { useHistoryState } from "@/features/homepage/use-history-state"
import { SECTION_META } from "@/lib/constants"
import { homepageDraft, homepageRevisions } from "@/lib/mock-data/homepage"
import { cn } from "@/lib/utils"
import type {
  HomepageDraft,
  HomepageGlobals,
  HomepageSection,
  HomepageSectionType,
  SectionSettings,
} from "@/types"

function makeSection(type: HomepageSectionType): HomepageSection {
  const settings: Record<string, unknown> = {}
  for (const field of SECTION_FIELDS[type]) {
    if (field.options?.length) {
      settings[field.key] = field.numeric
        ? Number(field.options[0].value)
        : field.options[0].value
    } else if (field.placeholder) {
      settings[field.key] = field.placeholder
    }
  }
  return {
    id: `sec_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    type,
    name: SECTION_META[type].label,
    visible: true,
    locked: false,
    settings: settings as SectionSettings,
  }
}

export function HomepageView() {
  const [draft, setDraft, history] = useHistoryState<HomepageDraft>(homepageDraft)
  const [published, setPublished] = React.useState<HomepageDraft>(homepageDraft)
  const [selectedId, setSelectedId] = React.useState<string | null>(
    homepageDraft.sections[0]?.id ?? null
  )
  const [device, setDevice] = React.useState<PreviewDevice>("desktop")
  const [loading, setLoading] = React.useState(true)

  const [globalsOpen, setGlobalsOpen] = React.useState(false)
  const [historyOpen, setHistoryOpen] = React.useState(false)
  const [publishOpen, setPublishOpen] = React.useState(false)
  const [addOpen, setAddOpen] = React.useState(false)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650)
    return () => clearTimeout(t)
  }, [])

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!(e.metaKey || e.ctrlKey)) return
      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        history.undo()
      } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
        e.preventDefault()
        history.redo()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [history])

  const dirty = React.useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(published),
    [draft, published]
  )

  const selectedSection = React.useMemo(
    () => draft.sections.find((s) => s.id === selectedId) ?? null,
    [draft.sections, selectedId]
  )

  /* ── Mutations ─────────────────────────────────────────────────── */
  function reorder(from: number, to: number) {
    setDraft((d) => {
      if (to < 0 || to >= d.sections.length) return d
      const arr = [...d.sections]
      const [moved] = arr.splice(from, 1)
      arr.splice(to, 0, moved)
      return { ...d, sections: arr }
    })
  }
  function toggleVisible(id: string) {
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)),
    }))
  }
  function updateSettings(id: string, patch: Partial<SectionSettings>) {
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) =>
        s.id === id ? { ...s, settings: { ...s.settings, ...patch } } : s
      ),
    }))
  }
  function renameSection(id: string, name: string) {
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) => (s.id === id ? { ...s, name } : s)),
    }))
  }
  function duplicateSection(id: string) {
    setDraft((d) => {
      const index = d.sections.findIndex((s) => s.id === id)
      if (index < 0) return d
      const original = d.sections[index]
      const copy: HomepageSection = {
        ...original,
        id: `sec_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
        name: `${original.name} copy`,
        locked: false,
      }
      const arr = [...d.sections]
      arr.splice(index + 1, 0, copy)
      return { ...d, sections: arr }
    })
    toast.success("Section duplicated")
  }
  function deleteSection(id: string) {
    setDraft((d) => ({ ...d, sections: d.sections.filter((s) => s.id !== id) }))
    setSelectedId((cur) =>
      cur === id ? draft.sections.find((s) => s.id !== id)?.id ?? null : cur
    )
    toast.success("Section removed")
  }
  function addSection(type: HomepageSectionType) {
    const section = makeSection(type)
    setDraft((d) => ({ ...d, sections: [...d.sections, section] }))
    setSelectedId(section.id)
    toast.success(`${SECTION_META[type].label} added`)
  }
  function updateGlobals(patch: Partial<HomepageGlobals>) {
    setDraft((d) => ({ ...d, globals: { ...d.globals, ...patch } }))
  }

  /* ── Lifecycle actions ─────────────────────────────────────────── */
  function saveDraft() {
    toast.success("Draft saved", { description: "Your changes are safe but not yet live." })
  }
  function publish() {
    setPublished(draft)
    history.commit(draft)
    toast.success("Homepage published", { description: "Your changes are now live." })
  }
  function discard() {
    history.commit(published)
    setSelectedId(published.sections[0]?.id ?? null)
    toast("Changes discarded")
  }

  const panelHeight = "xl:h-[72vh]"

  return (
    <PageContainer className="space-y-6">
      <PageHeader
        eyebrow="Storefront / Homepage Builder"
        title="Homepage"
        description="Manage your storefront homepage — no code required."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setHistoryOpen(true)}>
              <History className="size-4" /> History
            </Button>
            <Button variant="outline" size="sm" onClick={discard} disabled={!dirty}>
              <RotateCcw className="size-4" /> Discard
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("Opened storefront preview")}>
              <Eye className="size-4" /> Preview
            </Button>
            <Button variant="outline" size="sm" onClick={saveDraft}>
              <Save className="size-4" /> Save Draft
            </Button>
            <Button size="sm" onClick={() => setPublishOpen(true)} disabled={!dirty}>
              <UploadCloud className="size-4" /> Publish
            </Button>
          </>
        }
      />

      {/* Builder toolbar */}
      <div className="flex items-center justify-between gap-3 rounded-xl border bg-card px-3 py-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setGlobalsOpen(true)}>
            <Settings2 className="size-4" /> Global Settings
          </Button>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className={cn(
                "size-1.5 rounded-full",
                dirty ? "bg-amber-500" : "bg-emerald-500"
              )}
            />
            {dirty ? "Unsaved changes" : "All changes published"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={history.undo}
                  disabled={!history.canUndo}
                  aria-label="Undo"
                >
                  <Undo2 className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo · ⌘Z</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={history.redo}
                  disabled={!history.canRedo}
                  aria-label="Redo"
                >
                  <Redo2 className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo · ⌘⇧Z</TooltipContent>
            </Tooltip>
          </div>
          <PreviewSwitcher device={device} onDeviceChange={setDevice} />
        </div>
      </div>

      {/* Builder grid */}
      {loading ? (
        <div className="grid gap-4 xl:grid-cols-12">
          <Skeleton className="h-[72vh] rounded-xl xl:col-span-3" />
          <Skeleton className="h-[72vh] rounded-xl xl:col-span-6" />
          <Skeleton className="h-[72vh] rounded-xl xl:col-span-3" />
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-12">
          <div className={cn("overflow-hidden rounded-xl border bg-card xl:col-span-3", panelHeight)}>
            <SectionList
              sections={draft.sections}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onReorder={reorder}
              onToggleVisible={toggleVisible}
              onDuplicate={duplicateSection}
              onDelete={deleteSection}
              onAdd={() => setAddOpen(true)}
            />
          </div>

          <div className="xl:col-span-6">
            <HomepagePreview
              draft={draft}
              device={device}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onToggleVisible={toggleVisible}
            />
          </div>

          <div className={cn("overflow-hidden rounded-xl border bg-card xl:col-span-3", panelHeight)}>
            <SectionEditor
              section={selectedSection}
              onChange={updateSettings}
              onRename={renameSection}
              onDuplicate={duplicateSection}
              onDelete={deleteSection}
            />
          </div>
        </div>
      )}

      <Separator className="xl:hidden" />

      <GlobalSettings
        open={globalsOpen}
        onOpenChange={setGlobalsOpen}
        globals={draft.globals}
        onChange={updateGlobals}
      />
      <HistoryDrawer open={historyOpen} onOpenChange={setHistoryOpen} revisions={homepageRevisions} />
      <PublishDialog open={publishOpen} onOpenChange={setPublishOpen} draft={draft} onPublish={publish} />
      <AddSectionDialog open={addOpen} onOpenChange={setAddOpen} onAdd={addSection} />
    </PageContainer>
  )
}
