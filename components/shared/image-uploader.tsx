"use client"

import * as React from "react"
import { ImagePlus, Star, UploadCloud, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageUploaderProps {
  className?: string
}

/**
 * UI-only uploader: simulates drag-and-drop, thumbnail + gallery, and a
 * primary-image selector. No files are persisted.
 */
export function ImageUploader({ className }: ImageUploaderProps) {
  const [images, setImages] = React.useState<string[]>([])
  const [dragging, setDragging] = React.useState(false)

  function addPlaceholder() {
    setImages((prev) => [...prev, `img-${prev.length + 1}`])
  }

  function remove(id: string) {
    setImages((prev) => prev.filter((x) => x !== id))
  }

  return (
    <div className={cn("space-y-3", className)}>
      <button
        type="button"
        onClick={addPlaceholder}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          addPlaceholder()
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/30 px-4 py-8 text-center transition-colors hover:bg-muted/50",
          dragging && "border-foreground/40 bg-muted"
        )}
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-background text-muted-foreground">
          <UploadCloud className="size-5" />
        </span>
        <span className="text-sm font-medium">
          Drag & drop images, or click to browse
        </span>
        <span className="text-xs text-muted-foreground">
          PNG, JPG or WEBP up to 5MB · first image becomes the thumbnail
        </span>
      </button>

      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((id, i) => (
            <div
              key={id}
              className="group relative aspect-square overflow-hidden rounded-lg border bg-gradient-to-br from-muted to-muted/40"
            >
              <div className="flex size-full items-center justify-center text-muted-foreground/40">
                <ImagePlus className="size-6" />
              </div>
              {i === 0 ? (
                <span className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded-md bg-background/85 px-1.5 py-0.5 text-[0.65rem] font-medium text-gold backdrop-blur">
                  <Star className="size-3 fill-current" /> Thumbnail
                </span>
              ) : null}
              <Button
                type="button"
                variant="secondary"
                size="icon-xs"
                onClick={() => remove(id)}
                className="absolute top-1.5 right-1.5 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="size-3" />
                <span className="sr-only">Remove image</span>
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
