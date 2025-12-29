"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bold,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
  ZoomIn,
  ZoomOut,
  Lock,
  Unlock,
  Plus,
  X,
} from "lucide-react"
import type { Element } from "@/lib/types"
import { useState } from "react"

interface EditorToolbarProps {
  selectedElement: Element | null
  onUpdateElement: (updates: Partial<Element>) => void
  onDeleteElement: () => void
  onDuplicateElement: () => void
  onMoveLayer: (direction: "up" | "down" | "top" | "bottom") => void
  zoom: number
  onZoomChange: (zoom: number) => void
}

const fontFamilies = [
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Helvetica", value: "Helvetica, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
  { label: "Palatino", value: "Palatino, serif" },
  { label: "Garamond", value: "Garamond, serif" },
]

export function EditorToolbar({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onMoveLayer,
  zoom,
  onZoomChange,
}: EditorToolbarProps) {
  console.log("[v0] EditorToolbar rendering, selectedElement:", selectedElement?.type)

  const zoomOptions = [0.5, 0.75, 1, 1.25, 1.5]

  return (
    <div className="flex items-center justify-between border-b bg-background px-4 py-2">
      {/* Element-specific tools */}
      <div className="flex items-center gap-2">
        {selectedElement ? (
          <>
            {/* Text tools */}
            {selectedElement.type === "text" && (
              <>
                <Select
                  value={selectedElement.fontFamily || "Inter, sans-serif"}
                  onValueChange={(v) => onUpdateElement({ fontFamily: v })}
                >
                  <SelectTrigger className="h-8 w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map((font) => (
                      <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={String(selectedElement.fontSize || 14)}
                  onValueChange={(v) => onUpdateElement({ fontSize: Number(v) })}
                >
                  <SelectTrigger className="h-8 w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72].map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Separator orientation="vertical" className="h-6" />

                <Button
                  variant={selectedElement.fontWeight === "bold" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    onUpdateElement({
                      fontWeight: selectedElement.fontWeight === "bold" ? "normal" : "bold",
                    })
                  }
                >
                  <Bold className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <div className="flex items-center">
                  <Button
                    variant={selectedElement.textAlign === "left" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onUpdateElement({ textAlign: "left" })}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedElement.textAlign === "center" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onUpdateElement({ textAlign: "center" })}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedElement.textAlign === "right" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onUpdateElement({ textAlign: "right" })}
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedElement.textAlign === "justify" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onUpdateElement({ textAlign: "justify" })}
                    title="Justify"
                  >
                    <AlignJustify className="h-4 w-4" />
                  </Button>
                </div>

                <Separator orientation="vertical" className="h-6" />

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <div
                        className="h-4 w-4 rounded border border-border"
                        style={{ backgroundColor: selectedElement.color || "#000000" }}
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3">
                    <div className="space-y-2">
                      <Label>Text Color</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={selectedElement.color || "#000000"}
                          onChange={(e) => onUpdateElement({ color: e.target.value })}
                          className="h-8 w-8 cursor-pointer rounded border-0"
                        />
                        <Input
                          value={selectedElement.color || "#000000"}
                          onChange={(e) => onUpdateElement({ color: e.target.value })}
                          className="h-8 w-24 font-mono text-xs uppercase"
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Separator orientation="vertical" className="h-6" />

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8">
                      Opacity: {Math.round((selectedElement.opacity ?? 1) * 100)}%
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-3">
                    <div className="space-y-2">
                      <Label>Opacity</Label>
                      <Slider
                        value={[(selectedElement.opacity ?? 1) * 100]}
                        onValueChange={([v]) => onUpdateElement({ opacity: v / 100 })}
                        max={100}
                        step={1}
                      />
                      <div className="text-xs text-muted-foreground">
                        {Math.round((selectedElement.opacity ?? 1) * 100)}%
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </>
            )}

            {/* Shape tools */}
            {selectedElement.type === "shape" && (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 gap-2">
                      <div
                        className="h-4 w-4 rounded border border-border"
                        style={{
                          background: selectedElement.gradient
                            ? `linear-gradient(${selectedElement.gradient.angle}deg, ${selectedElement.gradient.colors.map((c) => `${c.color} ${c.stop}%`).join(", ")})`
                            : selectedElement.fill || "#e5e7eb",
                        }}
                      />
                      Fill
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-3">
                    <Tabs defaultValue={selectedElement.gradient ? "gradient" : "solid"}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="solid">Solid</TabsTrigger>
                        <TabsTrigger value="gradient">Gradient</TabsTrigger>
                      </TabsList>
                      <TabsContent value="solid" className="space-y-3">
                        <div className="space-y-2">
                          <Label>Fill Color</Label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={selectedElement.fill || "#e5e7eb"}
                              onChange={(e) => {
                                onUpdateElement({ fill: e.target.value, gradient: undefined })
                              }}
                              className="h-8 w-8 cursor-pointer rounded border-0"
                            />
                            <Input
                              value={selectedElement.fill || "#e5e7eb"}
                              onChange={(e) => {
                                onUpdateElement({ fill: e.target.value, gradient: undefined })
                              }}
                              className="h-8 flex-1 font-mono text-xs uppercase"
                            />
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="gradient" className="space-y-3">
                        <GradientEditor
                          gradient={
                            selectedElement.gradient || {
                              type: "linear",
                              angle: 90,
                              colors: [
                                { color: "#3b82f6", stop: 0 },
                                { color: "#8b5cf6", stop: 100 },
                              ],
                            }
                          }
                          onChange={(gradient) => onUpdateElement({ gradient })}
                        />
                      </TabsContent>
                    </Tabs>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8">
                      Corner Radius
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-3">
                    <div className="space-y-2">
                      <Label>Corner Radius</Label>
                      <Slider
                        value={[selectedElement.borderRadius || 0]}
                        onValueChange={([v]) => onUpdateElement({ borderRadius: v })}
                        max={50}
                        step={1}
                      />
                    </div>
                  </PopoverContent>
                </Popover>

                <Separator orientation="vertical" className="h-6" />

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8">
                      Opacity: {Math.round((selectedElement.opacity ?? 1) * 100)}%
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-3">
                    <div className="space-y-2">
                      <Label>Opacity</Label>
                      <Slider
                        value={[(selectedElement.opacity ?? 1) * 100]}
                        onValueChange={([v]) => onUpdateElement({ opacity: v / 100 })}
                        max={100}
                        step={1}
                      />
                      <div className="text-xs text-muted-foreground">
                        {Math.round((selectedElement.opacity ?? 1) * 100)}%
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </>
            )}

            {/* Image tools */}
            {selectedElement.type === "image" && (
              <>
                <Select
                  value={selectedElement.objectFit || "cover"}
                  onValueChange={(v) => onUpdateElement({ objectFit: v as "cover" | "contain" | "fill" })}
                >
                  <SelectTrigger className="h-8 w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cover">Cover</SelectItem>
                    <SelectItem value="contain">Contain</SelectItem>
                    <SelectItem value="fill">Fill</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8">
                      Corner Radius
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-3">
                    <div className="space-y-2">
                      <Label>Corner Radius</Label>
                      <Slider
                        value={[selectedElement.borderRadius || 0]}
                        onValueChange={([v]) => onUpdateElement({ borderRadius: v })}
                        max={50}
                        step={1}
                      />
                    </div>
                  </PopoverContent>
                </Popover>

                <Separator orientation="vertical" className="h-6" />

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8">
                      Opacity: {Math.round((selectedElement.opacity ?? 1) * 100)}%
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-3">
                    <div className="space-y-2">
                      <Label>Opacity</Label>
                      <Slider
                        value={[(selectedElement.opacity ?? 1) * 100]}
                        onValueChange={([v]) => onUpdateElement({ opacity: v / 100 })}
                        max={100}
                        step={1}
                      />
                      <div className="text-xs text-muted-foreground">
                        {Math.round((selectedElement.opacity ?? 1) * 100)}%
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </>
            )}

            <Separator orientation="vertical" className="h-6" />

            {/* Layer controls */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onMoveLayer("top")}
                title="Bring to front"
              >
                <ChevronsUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onMoveLayer("up")}
                title="Bring forward"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onMoveLayer("down")}
                title="Send backward"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onMoveLayer("bottom")}
                title="Send to back"
              >
                <ChevronsDown className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Lock */}
            <Button
              variant={selectedElement.locked ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateElement({ locked: !selectedElement.locked })}
            >
              {selectedElement.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
            </Button>

            {/* Duplicate */}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDuplicateElement}>
              <Copy className="h-4 w-4" />
            </Button>

            {/* Delete */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              onClick={onDeleteElement}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">Select an element to edit</span>
        )}
      </div>

      {/* Zoom controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onZoomChange(Math.max(0.25, zoom - 0.25))}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Select value={String(zoom)} onValueChange={(v) => onZoomChange(Number(v))}>
          <SelectTrigger className="h-8 w-20">
            <SelectValue>{Math.round(zoom * 100)}%</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {zoomOptions.map((z) => (
              <SelectItem key={z} value={String(z)}>
                {Math.round(z * 100)}%
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onZoomChange(Math.min(2, zoom + 0.25))}>
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function GradientEditor({
  gradient,
  onChange,
}: {
  gradient: {
    type: "linear" | "radial"
    angle: number
    colors: Array<{ color: string; stop: number; opacity?: number }>
  }
  onChange: (gradient: {
    type: "linear" | "radial"
    angle: number
    colors: Array<{ color: string; stop: number; opacity?: number }>
  }) => void
}) {
  const [localGradient, setLocalGradient] = useState(gradient)

  const updateGradient = (updates: Partial<typeof gradient>) => {
    const newGradient = { ...localGradient, ...updates }
    setLocalGradient(newGradient)
    onChange(newGradient)
  }

  const addColorStop = () => {
    const newColors = [
      ...localGradient.colors,
      {
        color: "#000000",
        stop: 50,
        opacity: 1, // Default opacity for new color stops
      },
    ].sort((a, b) => a.stop - b.stop)
    updateGradient({ colors: newColors })
  }

  const removeColorStop = (index: number) => {
    if (localGradient.colors.length <= 2) return
    const newColors = localGradient.colors.filter((_, i) => i !== index)
    updateGradient({ colors: newColors })
  }

  const updateColorStop = (index: number, updates: Partial<{ color: string; stop: number; opacity: number }>) => {
    const newColors = localGradient.colors.map((c, i) => (i === index ? { ...c, ...updates } : c))
    updateGradient({ colors: newColors })
  }

  const colorToRgba = (color: string, opacity = 1) => {
    // Convert hex to rgba
    const hex = color.replace("#", "")
    const r = Number.parseInt(hex.substring(0, 2), 16)
    const g = Number.parseInt(hex.substring(2, 4), 16)
    const b = Number.parseInt(hex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>Gradient Type</Label>
        <Select value={localGradient.type} onValueChange={(v) => updateGradient({ type: v as "linear" | "radial" })}>
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linear">Linear</SelectItem>
            <SelectItem value="radial">Radial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {localGradient.type === "linear" && (
        <div className="space-y-2">
          <Label>Angle: {localGradient.angle}°</Label>
          <Slider
            value={[localGradient.angle]}
            onValueChange={([v]) => updateGradient({ angle: v })}
            max={360}
            step={1}
          />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Color Stops</Label>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={addColorStop}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-3">
          {localGradient.colors.map((colorStop, index) => (
            <div key={index} className="space-y-2 rounded border border-border p-2">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorStop.color}
                  onChange={(e) => updateColorStop(index, { color: e.target.value })}
                  className="h-6 w-6 cursor-pointer rounded border-0"
                />
                <Input
                  type="number"
                  value={colorStop.stop}
                  onChange={(e) => updateColorStop(index, { stop: Number(e.target.value) })}
                  className="h-6 w-16 text-xs"
                  min={0}
                  max={100}
                />
                <span className="text-xs text-muted-foreground">%</span>
                {localGradient.colors.length > 2 && (
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeColorStop(index)}>
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Opacity: {Math.round((colorStop.opacity ?? 1) * 100)}%</Label>
                <Slider
                  value={[(colorStop.opacity ?? 1) * 100]}
                  onValueChange={([v]) => updateColorStop(index, { opacity: v / 100 })}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="h-12 w-full rounded border border-border"
        style={{
          background:
            localGradient.type === "linear"
              ? `linear-gradient(${localGradient.angle}deg, ${localGradient.colors.map((c) => `${colorToRgba(c.color, c.opacity ?? 1)} ${c.stop}%`).join(", ")})`
              : `radial-gradient(circle, ${localGradient.colors.map((c) => `${colorToRgba(c.color, c.opacity ?? 1)} ${c.stop}%`).join(", ")})`,
        }}
      />
    </div>
  )
}
