"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreVertical, Copy, Trash2 } from "lucide-react"
import type { Page, Element } from "@/lib/types"

interface PagesSidebarProps {
  pages: Page[]
  currentPageIndex: number
  onSelectPage: (index: number) => void
  onAddPage: () => void
  onDeletePage: (index: number) => void
  onDuplicatePage: (index: number) => void
  onReorderPages: (from: number, to: number) => void
}

function MiniPagePreview({ page }: { page: Page }) {
  const scale = 0.12
  const scaledWidth = 816 * scale
  const scaledHeight = 1056 * scale

  return (
    <div
      className="relative"
      style={{
        width: scaledWidth,
        height: scaledHeight,
        overflow: "hidden",
        backgroundColor: page.backgroundColor || "white",
        border: "1px solid rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          width: 816,
          height: 1056,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {page.elements.map((element) => (
          <MiniElement key={element.id} element={element} />
        ))}
      </div>
    </div>
  )
}

function MiniElement({ element }: { element: Element }) {
  const style: React.CSSProperties = {
    position: "absolute",
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
  }

  switch (element.type) {
    case "text":
      return <div style={{ ...style, backgroundColor: "#e5e7eb", borderRadius: 2 }} />
    case "image":
    case "logo":
      return <div style={{ ...style, backgroundColor: "#cbd5e1", borderRadius: element.borderRadius || 0 }} />
    case "shape":
      return (
        <div
          style={{ ...style, backgroundColor: element.fill || "#e5e7eb", borderRadius: element.borderRadius || 0 }}
        />
      )
    case "table":
      return <div style={{ ...style, backgroundColor: "#f1f5f9", border: "1px solid #e5e7eb" }} />
    default:
      return null
  }
}

export function PagesSidebar({
  pages,
  currentPageIndex,
  onSelectPage,
  onAddPage,
  onDeletePage,
  onDuplicatePage,
}: PagesSidebarProps) {
  return (
    <aside className="w-48 border-l border-border bg-card">
      <div className="flex h-12 items-center justify-between border-b border-border px-3">
        <span className="text-sm font-medium text-foreground">Pages</span>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onAddPage}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="space-y-2 p-3">
          {pages.map((page, index) => (
            <div
              key={page.id}
              className={`group relative cursor-pointer rounded-lg border transition-all ${
                currentPageIndex === index
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-muted-foreground/50"
              }`}
              onClick={() => onSelectPage(index)}
            >
              {/* Page thumbnail - shows mini preview */}
              <div className="aspect-[8.5/11] overflow-hidden rounded-t-lg bg-muted">
                <div className="h-full w-full" style={{ width: 816 * 0.12, height: 1056 * 0.12, overflow: "hidden" }}>
                  <MiniPagePreview page={page} />
                </div>
              </div>

              {/* Page info */}
              <div className="flex items-center justify-between p-2">
                <span className="truncate text-xs font-medium text-foreground">{page.name || `Page ${index + 1}`}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onDuplicatePage(index)
                      }}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    {pages.length > 1 && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeletePage(index)
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Page number badge */}
              <div className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded bg-background/80 text-xs font-medium text-foreground backdrop-blur-sm">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  )
}
