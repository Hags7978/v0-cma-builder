"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, FileText } from "lucide-react"
import type { Template } from "@/lib/types"
import Link from "next/link"

interface TemplatePreviewModalProps {
  template: Template | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TemplatePreviewModal({ template, open, onOpenChange }: TemplatePreviewModalProps) {
  const [currentPage, setCurrentPage] = useState(0)

  if (!template) return null

  const pages = template.pages || []
  const totalPages = pages.length

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{template.name}</DialogTitle>
          <DialogDescription>{template.description}</DialogDescription>
        </DialogHeader>

        <div className="flex gap-6">
          {/* Preview Area */}
          <div className="flex-1">
            <div className="relative aspect-[8.5/11] overflow-hidden rounded-lg border border-border bg-muted">
              {/* Page Preview Placeholder */}
              <div className="flex h-full flex-col items-center justify-center p-8">
                <FileText className="mb-4 h-16 w-16 text-muted-foreground/30" />
                <p className="text-center text-sm text-muted-foreground">
                  {pages[currentPage]?.name || `Page ${currentPage + 1}`}
                </p>
              </div>

              {/* Navigation Arrows */}
              {totalPages > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                    onClick={prevPage}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                    onClick={nextPage}
                    disabled={currentPage === totalPages - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Page Indicator */}
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {totalPages}
              </span>
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="w-64 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-foreground">Category</h4>
              <Badge variant="outline" className="mt-1">
                {template.category}
              </Badge>
            </div>

            <div>
              <h4 className="text-sm font-medium text-foreground">Pages</h4>
              <p className="text-sm text-muted-foreground">{totalPages} pages</p>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium text-foreground">Page List</h4>
              <div className="space-y-1">
                {pages.map((page, index) => (
                  <button
                    key={page.id}
                    onClick={() => setCurrentPage(index)}
                    className={`w-full rounded px-2 py-1 text-left text-sm transition-colors ${
                      currentPage === index
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {page.name || `Page ${index + 1}`}
                  </button>
                ))}
              </div>
            </div>

            <Link href={`/editor/new?template=${template.id}`} className="block">
              <Button className="w-full">Use This Template</Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
