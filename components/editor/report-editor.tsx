"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { EditorHeader } from "./editor-header"
import { EditorSidebar } from "./editor-sidebar"
import { EditorCanvas } from "./editor-canvas"
import { EditorToolbar } from "./editor-toolbar"
import { PagesSidebar } from "./pages-sidebar"
import { generateReportThumbnail } from "@/lib/generate-thumbnail"
import type { Report, Template, Profile, Asset, Page, Element } from "@/lib/types"

interface ReportEditorProps {
  report: Report | null
  template: Template | null
  profile: Profile | null
  assets: Asset[]
  userId: string
  isNew: boolean
}

// Default blank page
const createBlankPage = (index: number): Page => ({
  id: `page-${Date.now()}-${index}`,
  name: `Page ${index + 1}`,
  elements: [],
})

export function ReportEditor({ report, template, profile, assets, userId, isNew }: ReportEditorProps) {
  console.log("[v0] ReportEditor rendering")
  const router = useRouter()
  const [reportName, setReportName] = useState(report?.name || template?.name || "Untitled Report")
  const [pages, setPages] = useState<Page[]>(() => {
    if (report?.pages && report.pages.length > 0) {
      return report.pages
    }
    if (template?.pages && template.pages.length > 0) {
      return template.pages
    }
    return [createBlankPage(0)]
  })
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [sidebarTab, setSidebarTab] = useState<"elements" | "assets" | "text" | "shapes">("elements")
  const [zoom, setZoom] = useState(0.75)
  const [isSaving, setIsSaving] = useState(false)
  const [reportId, setReportId] = useState<string | null>(report?.id || null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const canvasRef = useRef<HTMLDivElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout>()

  // Use refs to keep latest values without triggering re-renders
  const reportNameRef = useRef(reportName)
  const pagesRef = useRef(pages)
  const reportIdRef = useRef(reportId)

  useEffect(() => {
    reportNameRef.current = reportName
  }, [reportName])

  useEffect(() => {
    pagesRef.current = pages
  }, [pages])

  useEffect(() => {
    reportIdRef.current = reportId
  }, [reportId])

  const currentPage = pages[currentPageIndex]
  const selectedElement = currentPage?.elements.find((el) => el.id === selectedElementId) || null

  const markUnsaved = useCallback(() => {
    setHasUnsavedChanges(true)
  }, [])

  // Create a stable save function that reads from refs
  const saveReport = useCallback(async () => {
    console.log("[v0] Starting save report")
    setIsSaving(true)
    const supabase = createClient()

    const reportData = {
      name: reportNameRef.current,
      pages: pagesRef.current,
      user_id: userId,
      template_id: template?.id || null,
      status: "draft",
      updated_at: new Date().toISOString(),
    }

    let currentReportId = reportIdRef.current

    try {
      if (currentReportId) {
        // Update existing
        console.log("[v0] Updating existing report:", currentReportId)
        await supabase.from("reports").update(reportData).eq("id", currentReportId)
      } else {
        // Create new
        console.log("[v0] Creating new report")
        const { data } = await supabase.from("reports").insert(reportData).select().single()

        if (data) {
          console.log("[v0] New report created with ID:", data.id)
          currentReportId = data.id
          setReportId(data.id)
          reportIdRef.current = data.id
          // Update URL without reload
          window.history.replaceState(null, "", `/editor/${data.id}`)
        }
      }

      // Generate thumbnail after successful save
      if (currentReportId && canvasRef.current) {
        console.log("[v0] Starting thumbnail generation for report:", currentReportId)
        // Wait a bit for DOM to update
        await new Promise((resolve) => setTimeout(resolve, 100))

        const canvasElement = canvasRef.current.querySelector(".print-page") as HTMLElement
        if (canvasElement) {
          console.log(
            "[v0] Found canvas element, dimensions:",
            canvasElement.offsetWidth,
            "x",
            canvasElement.offsetHeight,
          )
          const thumbnailUrl = await generateReportThumbnail(canvasElement, currentReportId)
          console.log("[v0] Generated thumbnail URL:", thumbnailUrl)
          if (thumbnailUrl) {
            const cacheBustedUrl = `${thumbnailUrl}?t=${Date.now()}`
            await supabase.from("reports").update({ thumbnail_url: cacheBustedUrl }).eq("id", currentReportId)
            console.log("[v0] Thumbnail URL saved to database with cache-busting")
          }
        } else {
          console.log("[v0] Canvas element not found, available classes:", canvasRef.current.className)
        }
      }

      setIsSaving(false)
      setHasUnsavedChanges(false)
      console.log("[v0] Save complete")
    } catch (error) {
      console.error("[v0] Save failed:", error)
      setIsSaving(false)
    }
  }, [userId, template?.id]) // Only depend on stable props

  // Debounced auto-save with proper dependencies
  useEffect(() => {
    if (hasUnsavedChanges) {
      console.log("[v0] Changes detected, scheduling auto-save in 2 seconds")
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      saveTimeoutRef.current = setTimeout(() => {
        console.log("[v0] Auto-save triggered")
        saveReport()
      }, 2000)
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [hasUnsavedChanges, saveReport])

  // Update element
  const updateElement = useCallback(
    (elementId: string, updates: Partial<Element>) => {
      setPages((prev) =>
        prev.map((page, idx) =>
          idx === currentPageIndex
            ? {
                ...page,
                elements: page.elements.map((el) => (el.id === elementId ? { ...el, ...updates } : el)),
              }
            : page,
        ),
      )
      markUnsaved()
    },
    [currentPageIndex, markUnsaved],
  )

  // Add element
  const addElement = useCallback(
    (element: Omit<Element, "id">) => {
      const newElement: Element = {
        ...element,
        id: `el-${Date.now()}`,
      }
      setPages((prev) =>
        prev.map((page, idx) =>
          idx === currentPageIndex
            ? {
                ...page,
                elements: [...page.elements, newElement],
              }
            : page,
        ),
      )
      setSelectedElementId(newElement.id)
      markUnsaved()
    },
    [currentPageIndex, markUnsaved],
  )

  // Delete element
  const deleteElement = useCallback(
    (elementId: string) => {
      setPages((prev) =>
        prev.map((page, idx) =>
          idx === currentPageIndex
            ? {
                ...page,
                elements: page.elements.filter((el) => el.id !== elementId),
              }
            : page,
        ),
      )
      if (selectedElementId === elementId) {
        setSelectedElementId(null)
      }
      markUnsaved()
    },
    [pages.length, currentPageIndex, selectedElementId, markUnsaved],
  )

  // Duplicate element
  const duplicateElement = useCallback(
    (elementId: string) => {
      const element = currentPage.elements.find((el) => el.id === elementId)
      if (element) {
        addElement({
          ...element,
          x: element.x + 20,
          y: element.y + 20,
        })
      }
    },
    [currentPage, addElement],
  )

  // Add page
  const addPage = useCallback(() => {
    const newPage = createBlankPage(pages.length)
    setPages((prev) => [...prev, newPage])
    setCurrentPageIndex(pages.length)
    markUnsaved()
  }, [pages.length, markUnsaved])

  // Delete page
  const deletePage = useCallback(
    (pageIndex: number) => {
      if (pages.length <= 1) return
      setPages((prev) => prev.filter((_, idx) => idx !== pageIndex))
      if (currentPageIndex >= pageIndex && currentPageIndex > 0) {
        setCurrentPageIndex((prev) => prev - 1)
      }
      markUnsaved()
    },
    [pages.length, currentPageIndex, markUnsaved],
  )

  // Duplicate page
  const duplicatePage = useCallback(
    (pageIndex: number) => {
      const page = pages[pageIndex]
      const newPage: Page = {
        ...page,
        id: `page-${Date.now()}`,
        name: `${page.name} (Copy)`,
        elements: page.elements.map((el) => ({ ...el, id: `el-${Date.now()}-${Math.random()}` })),
      }
      setPages((prev) => [...prev.slice(0, pageIndex + 1), newPage, ...prev.slice(pageIndex + 1)])
      setCurrentPageIndex(pageIndex + 1)
      markUnsaved()
    },
    [pages, markUnsaved],
  )

  // Reorder pages
  const reorderPages = useCallback(
    (fromIndex: number, toIndex: number) => {
      setPages((prev) => {
        const newPages = [...prev]
        const [removed] = newPages.splice(fromIndex, 1)
        newPages.splice(toIndex, 0, removed)
        return newPages
      })
      if (currentPageIndex === fromIndex) {
        setCurrentPageIndex(toIndex)
      }
      markUnsaved()
    },
    [currentPageIndex, markUnsaved],
  )

  // Move element layer
  const moveElementLayer = useCallback(
    (elementId: string, direction: "up" | "down" | "top" | "bottom") => {
      setPages((prev) =>
        prev.map((page, idx) => {
          if (idx !== currentPageIndex) return page

          const elements = [...page.elements]
          const index = elements.findIndex((el) => el.id === elementId)
          if (index === -1) return page

          const element = elements[index]
          elements.splice(index, 1)

          switch (direction) {
            case "up":
              elements.splice(Math.min(index + 1, elements.length), 0, element)
              break
            case "down":
              elements.splice(Math.max(index - 1, 0), 0, element)
              break
            case "top":
              elements.push(element)
              break
            case "bottom":
              elements.unshift(element)
              break
          }

          return { ...page, elements }
        }),
      )
      markUnsaved()
    },
    [currentPageIndex, markUnsaved],
  )

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete selected element
      if ((e.key === "Delete" || e.key === "Backspace") && selectedElementId) {
        const target = e.target as HTMLElement
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          e.preventDefault()
          deleteElement(selectedElementId)
        }
      }

      // Save (Ctrl/Cmd + S)
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        saveReport()
      }

      // Duplicate (Ctrl/Cmd + D)
      if ((e.ctrlKey || e.metaKey) && e.key === "d" && selectedElementId) {
        e.preventDefault()
        duplicateElement(selectedElementId)
      }

      // Deselect (Escape)
      if (e.key === "Escape") {
        setSelectedElementId(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedElementId, deleteElement, saveReport, duplicateElement])

  return (
    <div className="flex h-screen flex-col bg-muted/30">
      <EditorHeader
        reportName={reportName}
        onReportNameChange={(name) => {
          setReportName(name)
          markUnsaved()
        }}
        onSave={saveReport}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        onBack={() => router.push("/dashboard")}
        pages={pages}
        profile={profile}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Elements */}
        <EditorSidebar
          activeTab={sidebarTab}
          onTabChange={setSidebarTab}
          onAddElement={addElement}
          assets={assets}
          profile={profile}
        />

        {/* Center - Canvas Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Toolbar */}
          <EditorToolbar
            selectedElement={selectedElement}
            onUpdateElement={(updates) => selectedElementId && updateElement(selectedElementId, updates)}
            onDeleteElement={() => selectedElementId && deleteElement(selectedElementId)}
            onDuplicateElement={() => selectedElementId && duplicateElement(selectedElementId)}
            onMoveLayer={(dir) => selectedElementId && moveElementLayer(selectedElementId, dir)}
            zoom={zoom}
            onZoomChange={setZoom}
          />

          {/* Canvas */}
          <div ref={canvasRef} className="flex-1 overflow-auto bg-muted/50 p-8">
            <EditorCanvas
              page={currentPage}
              selectedElementId={selectedElementId}
              onSelectElement={setSelectedElementId}
              onUpdateElement={updateElement}
              zoom={zoom}
              profile={profile}
            />
          </div>
        </div>

        {/* Right Sidebar - Pages */}
        <PagesSidebar
          pages={pages}
          currentPageIndex={currentPageIndex}
          onSelectPage={setCurrentPageIndex}
          onAddPage={addPage}
          onDeletePage={deletePage}
          onDuplicatePage={duplicatePage}
          onReorderPages={reorderPages}
        />
      </div>
    </div>
  )
}
