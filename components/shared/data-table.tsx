"use client"

import type { ReactNode } from "react"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export type SortDir = "asc" | "desc"

export interface SortState {
  id: string
  dir: SortDir
}

export interface Column<T> {
  id: string
  header: string
  cell: (row: T) => ReactNode
  align?: "left" | "right" | "center"
  sortable?: boolean
  headerClassName?: string
  cellClassName?: string
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  getRowId: (row: T) => string
  loading?: boolean
  skeletonRows?: number
  empty?: ReactNode
  onRowClick?: (row: T) => void
  selectable?: boolean
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  sort?: SortState | null
  onSortChange?: (id: string) => void
  stickyHeader?: boolean
  rowActions?: (row: T) => ReactNode
  className?: string
}

const alignClass = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const

export function DataTable<T>({
  columns,
  data,
  getRowId,
  loading = false,
  skeletonRows = 6,
  empty,
  onRowClick,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  sort,
  onSortChange,
  stickyHeader = false,
  rowActions,
  className,
}: DataTableProps<T>) {
  const allIds = data.map(getRowId)
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id))
  const someSelected = selectedIds.length > 0 && !allSelected

  function toggleAll() {
    onSelectionChange?.(allSelected ? [] : allIds)
  }

  function toggleOne(id: string) {
    onSelectionChange?.(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id]
    )
  }

  const colSpan =
    columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)

  return (
    <div className={cn("relative w-full overflow-x-auto", className)}>
      <Table>
        <TableHeader
          className={cn(
            stickyHeader && "sticky top-0 z-10 bg-card [&_th]:bg-card"
          )}
        >
          <TableRow className="hover:bg-transparent">
            {selectable ? (
              <TableHead className="w-10">
                <Checkbox
                  checked={allSelected ? true : someSelected ? "indeterminate" : false}
                  onCheckedChange={toggleAll}
                  aria-label="Select all rows"
                />
              </TableHead>
            ) : null}
            {columns.map((col) => {
              const active = sort?.id === col.id
              return (
                <TableHead
                  key={col.id}
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    "text-xs font-medium tracking-wide text-muted-foreground uppercase",
                    col.align && alignClass[col.align],
                    col.headerClassName
                  )}
                >
                  {col.sortable && onSortChange ? (
                    <button
                      type="button"
                      onClick={() => onSortChange(col.id)}
                      className={cn(
                        "-mx-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-1 transition-colors hover:text-foreground",
                        col.align === "right" && "flex-row-reverse",
                        active && "text-foreground"
                      )}
                    >
                      {col.header}
                      {active ? (
                        sort?.dir === "asc" ? (
                          <ArrowUp className="size-3" />
                        ) : (
                          <ArrowDown className="size-3" />
                        )
                      ) : (
                        <ChevronsUpDown className="size-3 opacity-40" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              )
            })}
            {rowActions ? <TableHead className="w-12" /> : null}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {selectable ? (
                  <TableCell>
                    <Skeleton className="size-4 rounded" />
                  </TableCell>
                ) : null}
                {columns.map((col) => (
                  <TableCell key={col.id}>
                    <Skeleton className="h-4 w-full max-w-[8rem]" />
                  </TableCell>
                ))}
                {rowActions ? (
                  <TableCell>
                    <Skeleton className="size-6 rounded" />
                  </TableCell>
                ) : null}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={colSpan} className="h-px p-0">
                {empty}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => {
              const id = getRowId(row)
              const selected = selectedIds.includes(id)
              return (
                <TableRow
                  key={id}
                  data-state={selected ? "selected" : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "group/row transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {selectable ? (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected}
                        onCheckedChange={() => toggleOne(id)}
                        aria-label="Select row"
                      />
                    </TableCell>
                  ) : null}
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      className={cn(
                        col.align && alignClass[col.align],
                        col.cellClassName
                      )}
                    >
                      {col.cell(row)}
                    </TableCell>
                  ))}
                  {rowActions ? (
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {rowActions(row)}
                    </TableCell>
                  ) : null}
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
