"use client"

import type React from "react"
import { useRef, useCallback, useState } from "react"
import type { Page, Element, Profile } from "@/lib/types"

interface EditorCanvasProps {
  page: Page
  selectedElementId: string | null
  onSelectElement: (id: string | null) => void
  onUpdateElement: (id: string, updates: Partial<Element>) => void
  zoom: number
  profile: Profile | null
}

// 8.5 x 11 inches at 96 DPI = 816 x 1056 pixels
const PAGE_WIDTH = 816
const PAGE_HEIGHT = 1056

const SNAP_THRESHOLD = 5 // pixels

interface AlignmentGuide {
  type: "vertical" | "horizontal"
  position: number
  label?: string
}

export function EditorCanvas({
  page,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  zoom,
  profile,
}: EditorCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [elementStart, setElementStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [editingTextId, setEditingTextId] = useState<string | null>(null)
  const [editingTextValue, setEditingTextValue] = useState("")
  const [alignmentGuides, setAlignmentGuides] = useState<AlignmentGuide[]>([])

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains("canvas-bg")) {
      onSelectElement(null)
      if (editingTextId) {
        onUpdateElement(editingTextId, { content: editingTextValue })
        setEditingTextId(null)
      }
    }
  }

  const handleElementMouseDown = (e: React.MouseEvent, element: Element) => {
    e.stopPropagation()
    if (element.locked) return
    if (editingTextId === element.id) return

    onSelectElement(element.id)
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setElementStart({ x: element.x, y: element.y, width: element.width, height: element.height })
  }

  const handleElementDoubleClick = (e: React.MouseEvent, element: Element) => {
    e.stopPropagation()
    if (element.type === "text" && !element.locked) {
      setEditingTextId(element.id)
      setEditingTextValue(element.content || "")
    }
  }

  const handleTextBlur = (elementId: string) => {
    onUpdateElement(elementId, { content: editingTextValue })
    setEditingTextId(null)
  }

  const handleTextKeyDown = (e: React.KeyboardEvent, elementId: string) => {
    if (e.key === "Escape") {
      setEditingTextId(null)
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onUpdateElement(elementId, { content: editingTextValue })
      setEditingTextId(null)
    }
  }

  const handleResizeMouseDown = (e: React.MouseEvent, element: Element, handle: string) => {
    e.stopPropagation()
    if (element.locked) return

    setIsResizing(true)
    setResizeHandle(handle)
    setDragStart({ x: e.clientX, y: e.clientY })
    setElementStart({ x: element.x, y: element.y, width: element.width, height: element.height })
  }

  const getAlignmentGuides = useCallback(
    (element: Element, newX: number, newY: number): { x: number; y: number; guides: AlignmentGuide[] } => {
      const guides: AlignmentGuide[] = []
      let snappedX = newX
      let snappedY = newY

      const elementCenterX = newX + element.width / 2
      const elementCenterY = newY + element.height / 2
      const elementRight = newX + element.width
      const elementBottom = newY + element.height

      // Page center alignment
      const pageCenterX = PAGE_WIDTH / 2
      const pageCenterY = PAGE_HEIGHT / 2

      if (Math.abs(elementCenterX - pageCenterX) < SNAP_THRESHOLD) {
        snappedX = pageCenterX - element.width / 2
        guides.push({ type: "vertical", position: pageCenterX, label: "Center" })
      }

      if (Math.abs(elementCenterY - pageCenterY) < SNAP_THRESHOLD) {
        snappedY = pageCenterY - element.height / 2
        guides.push({ type: "horizontal", position: pageCenterY, label: "Center" })
      }

      // Page edge alignment
      if (Math.abs(newX) < SNAP_THRESHOLD) {
        snappedX = 0
        guides.push({ type: "vertical", position: 0 })
      }
      if (Math.abs(newY) < SNAP_THRESHOLD) {
        snappedY = 0
        guides.push({ type: "horizontal", position: 0 })
      }
      if (Math.abs(elementRight - PAGE_WIDTH) < SNAP_THRESHOLD) {
        snappedX = PAGE_WIDTH - element.width
        guides.push({ type: "vertical", position: PAGE_WIDTH })
      }
      if (Math.abs(elementBottom - PAGE_HEIGHT) < SNAP_THRESHOLD) {
        snappedY = PAGE_HEIGHT - element.height
        guides.push({ type: "horizontal", position: PAGE_HEIGHT })
      }

      // Alignment with other elements
      page.elements.forEach((other) => {
        if (other.id === element.id || other.locked) return

        const otherCenterX = other.x + other.width / 2
        const otherCenterY = other.y + other.height / 2
        const otherRight = other.x + other.width
        const otherBottom = other.y + other.height

        // Align centers
        if (Math.abs(elementCenterX - otherCenterX) < SNAP_THRESHOLD) {
          snappedX = otherCenterX - element.width / 2
          guides.push({ type: "vertical", position: otherCenterX })
        }
        if (Math.abs(elementCenterY - otherCenterY) < SNAP_THRESHOLD) {
          snappedY = otherCenterY - element.height / 2
          guides.push({ type: "horizontal", position: otherCenterY })
        }

        // Align edges
        if (Math.abs(newX - other.x) < SNAP_THRESHOLD) {
          snappedX = other.x
          guides.push({ type: "vertical", position: other.x })
        }
        if (Math.abs(newY - other.y) < SNAP_THRESHOLD) {
          snappedY = other.y
          guides.push({ type: "horizontal", position: other.y })
        }
        if (Math.abs(elementRight - otherRight) < SNAP_THRESHOLD) {
          snappedX = otherRight - element.width
          guides.push({ type: "vertical", position: otherRight })
        }
        if (Math.abs(elementBottom - otherBottom) < SNAP_THRESHOLD) {
          snappedY = otherBottom - element.height
          guides.push({ type: "horizontal", position: otherBottom })
        }
      })

      return { x: snappedX, y: snappedY, guides }
    },
    [page.elements],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!selectedElementId) return

      const element = page.elements.find((el) => el.id === selectedElementId)
      if (!element) return

      const dx = (e.clientX - dragStart.x) / zoom
      const dy = (e.clientY - dragStart.y) / zoom

      if (isDragging) {
        const newX = Math.max(0, Math.min(PAGE_WIDTH - element.width, elementStart.x + dx))
        const newY = Math.max(0, Math.min(PAGE_HEIGHT - element.height, elementStart.y + dy))

        const { x: snappedX, y: snappedY, guides } = getAlignmentGuides(element, newX, newY)
        setAlignmentGuides(guides)

        onUpdateElement(selectedElementId, {
          x: snappedX,
          y: snappedY,
        })
      } else if (isResizing && resizeHandle) {
        setAlignmentGuides([])

        let newWidth = elementStart.width
        let newHeight = elementStart.height
        let newX = elementStart.x
        let newY = elementStart.y

        if (resizeHandle.includes("e")) newWidth = Math.max(20, elementStart.width + dx)
        if (resizeHandle.includes("w")) {
          newWidth = Math.max(20, elementStart.width - dx)
          newX = elementStart.x + dx
        }
        if (resizeHandle.includes("s")) newHeight = Math.max(20, elementStart.height + dy)
        if (resizeHandle.includes("n")) {
          newHeight = Math.max(20, elementStart.height - dy)
          newY = elementStart.y + dy
        }

        onUpdateElement(selectedElementId, { x: newX, y: newY, width: newWidth, height: newHeight })
      }
    },
    [
      isDragging,
      isResizing,
      resizeHandle,
      selectedElementId,
      dragStart,
      elementStart,
      zoom,
      onUpdateElement,
      getAlignmentGuides,
      page.elements,
    ],
  )

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeHandle(null)
    setAlignmentGuides([])
  }

  const renderElement = (element: Element) => {
    const isSelected = selectedElementId === element.id
    const isEditing = editingTextId === element.id
    const commonStyle: React.CSSProperties = {
      position: "absolute",
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      cursor: element.locked ? "default" : isEditing ? "text" : "move",
      opacity: element.opacity !== undefined ? element.opacity : 1,
    }

    let content: React.ReactNode = null

    switch (element.type) {
      case "text":
        content = isEditing ? (
          <textarea
            value={editingTextValue}
            onChange={(e) => setEditingTextValue(e.target.value)}
            onBlur={() => handleTextBlur(element.id)}
            onKeyDown={(e) => handleTextKeyDown(e, element.id)}
            autoFocus
            style={{
              ...commonStyle,
              fontSize: element.fontSize,
              fontWeight: element.fontWeight === "bold" ? 700 : element.fontWeight === "semibold" ? 600 : 400,
              fontFamily: element.fontFamily,
              color: element.color,
              textAlign: element.textAlign,
              lineHeight: element.lineHeight || 1.4,
              resize: "none",
              border: "2px solid #3b82f6",
              borderRadius: 4,
              padding: 4,
              background: "white",
              outline: "none",
              overflow: "hidden",
            }}
          />
        ) : (
          <div
            style={{
              ...commonStyle,
              fontSize: element.fontSize,
              fontWeight: element.fontWeight === "bold" ? 700 : element.fontWeight === "semibold" ? 600 : 400,
              fontFamily: element.fontFamily,
              color: element.color,
              textAlign: element.textAlign,
              lineHeight: element.lineHeight || 1.4,
              whiteSpace: "pre-wrap",
              overflow: "hidden",
            }}
          >
            {element.content}
          </div>
        )
        break

      case "image":
        let imgSrc = element.src || "/real-estate-property.png"
        if (imgSrc.startsWith("blob:")) {
          console.warn("[v0] Image element has blob URL, using fallback:", element.id)
          imgSrc = "/real-estate-property.png"
        }

        content = (
          <img
            src={imgSrc || "/placeholder.svg"}
            alt={element.alt || ""}
            style={{
              ...commonStyle,
              objectFit: element.objectFit || "cover",
              borderRadius: element.borderRadius,
            }}
            onError={(e) => {
              console.error("[v0] Image load error:", imgSrc)
              e.currentTarget.src = "/abstract-geometric-placeholder.png"
            }}
          />
        )
        break

      case "shape": {
        const colorToRgba = (color: string, opacity = 1) => {
          const hex = color.replace("#", "")
          const r = Number.parseInt(hex.substring(0, 2), 16)
          const g = Number.parseInt(hex.substring(2, 4), 16)
          const b = Number.parseInt(hex.substring(4, 6), 16)
          return `rgba(${r}, ${g}, ${b}, ${opacity})`
        }

        const bgStyle = element.gradient
          ? `${element.gradient.type === "linear" ? "linear" : "radial"}-gradient(${
              element.gradient.type === "linear" ? `${element.gradient.angle}deg` : "circle"
            }, ${element.gradient.colors.map((c) => `${colorToRgba(c.color, c.opacity ?? 1)} ${c.stop}%`).join(", ")})`
          : element.fill

        content = (
          <div
            style={{
              ...commonStyle,
              background: bgStyle,
              border: element.stroke ? `${element.strokeWidth || 1}px solid ${element.stroke}` : undefined,
              borderRadius: element.borderRadius,
            }}
          />
        )
        break
      }

      case "logo":
        let logoSrc = element.src || ""

        // If element doesn't have stored src or it's a blob URL, try profile
        if (!logoSrc || logoSrc.startsWith("blob:")) {
          if (logoSrc.startsWith("blob:")) {
            console.warn("[v0] Logo element has blob URL, checking profile:", element.id)
          }
          logoSrc = element.logoType === "light" ? profile?.logo_light_url || "" : profile?.logo_dark_url || ""

          // If profile also has blob URL, clear it
          if (logoSrc.startsWith("blob:")) {
            console.warn("[v0] Profile also has blob URL, logo will not display. Please re-upload in Profile settings.")
            logoSrc = ""
          }
        }

        content = logoSrc ? (
          <img
            src={logoSrc || "/placeholder.svg"}
            alt="Logo"
            style={{
              ...commonStyle,
              objectFit: "contain",
            }}
            onError={(e) => {
              console.error("[v0] Logo load error:", logoSrc)
              const parent = e.currentTarget.parentElement
              if (parent) {
                e.currentTarget.remove()
                const fallback = document.createElement("div")
                fallback.textContent = "Logo"
                fallback.style.cssText = `
                  position: absolute;
                  left: ${element.x}px;
                  top: ${element.y}px;
                  width: ${element.width}px;
                  height: ${element.height}px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background-color: ${element.logoType === "light" ? "#f1f5f9" : "#1e293b"};
                  border-radius: 4px;
                  font-size: 12px;
                  color: ${element.logoType === "light" ? "#64748b" : "#94a3b8"};
                `
                parent.appendChild(fallback)
              }
            }}
          />
        ) : (
          <div
            style={{
              ...commonStyle,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: element.logoType === "light" ? "#f1f5f9" : "#1e293b",
              borderRadius: 4,
              fontSize: 12,
              color: element.logoType === "light" ? "#64748b" : "#94a3b8",
            }}
          >
            Logo
          </div>
        )
        break

      case "table":
        const columns = element.columns || []
        const data = typeof element.data === "string" ? [[element.data]] : (element.data as unknown[][]) || []
        content = (
          <div style={{ ...commonStyle, overflow: "hidden", border: "1px solid #e5e7eb", borderRadius: 4 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc" }}>
                  {columns.map((col, i) => (
                    <th key={i} style={{ padding: "8px", borderBottom: "1px solid #e5e7eb", textAlign: "left" }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {(row as string[]).map((cell, cellIdx) => (
                      <td key={cellIdx} style={{ padding: "8px", borderBottom: "1px solid #e5e7eb" }}>
                        {String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        break

      default:
        content = null
    }

    return (
      <div
        key={element.id}
        onMouseDown={(e) => handleElementMouseDown(e, element)}
        onDoubleClick={(e) => handleElementDoubleClick(e, element)}
        className={`group ${isSelected && !isEditing ? "ring-2 ring-primary" : ""}`}
        style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      >
        <div style={{ pointerEvents: "auto" }}>{content}</div>

        {/* Selection handles - hide when editing text */}
        {isSelected && !element.locked && !isEditing && (
          <>
            {/* Resize handles */}
            {["nw", "ne", "sw", "se", "n", "s", "e", "w"].map((handle) => {
              const positions: Record<string, React.CSSProperties> = {
                nw: { left: element.x - 4, top: element.y - 4, cursor: "nw-resize" },
                ne: { left: element.x + element.width - 4, top: element.y - 4, cursor: "ne-resize" },
                sw: { left: element.x - 4, top: element.y + element.height - 4, cursor: "sw-resize" },
                se: {
                  left: element.x + element.width - 4,
                  top: element.y + element.height - 4,
                  cursor: "se-resize",
                },
                n: { left: element.x + element.width / 2 - 4, top: element.y - 4, cursor: "n-resize" },
                s: {
                  left: element.x + element.width / 2 - 4,
                  top: element.y + element.height - 4,
                  cursor: "s-resize",
                },
                e: {
                  left: element.x + element.width - 4,
                  top: element.y + element.height / 2 - 4,
                  cursor: "e-resize",
                },
                w: { left: element.x - 4, top: element.y + element.height / 2 - 4, cursor: "w-resize" },
              }

              return (
                <div
                  key={handle}
                  onMouseDown={(e) => handleResizeMouseDown(e, element, handle)}
                  style={{
                    position: "absolute",
                    width: 8,
                    height: 8,
                    backgroundColor: "white",
                    border: "1px solid #3b82f6",
                    borderRadius: 2,
                    pointerEvents: "auto",
                    ...positions[handle],
                  }}
                />
              )
            })}
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex justify-center print-canvas">
      <div
        ref={canvasRef}
        data-page-index={0}
        className="relative bg-white shadow-xl print-page"
        style={{
          width: PAGE_WIDTH,
          height: PAGE_HEIGHT,
          transform: `scale(${zoom})`,
          transformOrigin: "top center",
          border: "1px solid rgba(0, 0, 0, 0.15)",
        }}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Canvas background */}
        <div
          className="canvas-bg absolute inset-0 no-print"
          style={{
            backgroundImage: `linear-gradient(90deg, #f1f5f9 1px, transparent 1px),
                            linear-gradient(#f1f5f9 1px, transparent 1px)`,
            backgroundSize: `${20 / zoom}px ${20 / zoom}px`,
            backgroundColor: page.backgroundColor || "white",
          }}
        />

        {alignmentGuides.map((guide, idx) => (
          <div
            key={`guide-${idx}`}
            className="pointer-events-none absolute"
            style={{
              [guide.type === "vertical" ? "left" : "top"]: guide.position,
              [guide.type === "vertical" ? "width" : "height"]: 1,
              [guide.type === "vertical" ? "height" : "width"]: "100%",
              backgroundColor: "#3b82f6",
              zIndex: 1000,
            }}
          >
            {guide.label && (
              <div
                className="absolute left-2 top-2 rounded bg-primary px-2 py-1 text-xs text-primary-foreground"
                style={{ whiteSpace: "nowrap" }}
              >
                {guide.label}
              </div>
            )}
          </div>
        ))}

        {/* Elements */}
        {page.elements.map(renderElement)}
      </div>
    </div>
  )
}
