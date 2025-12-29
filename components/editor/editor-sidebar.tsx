"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Type, Square, ImageIcon, LayoutGrid, Table, BarChart3, Shapes } from "lucide-react"
import type { Asset, Element, Profile } from "@/lib/types"

interface EditorSidebarProps {
  activeTab: string
  onTabChange: (tab: "elements" | "assets" | "text" | "shapes") => void
  onAddElement: (element: Omit<Element, "id">) => void
  assets: Asset[]
  profile: Profile | null
}

const textPresets = [
  { label: "Heading 1", fontSize: 36, fontWeight: "bold" },
  { label: "Heading 2", fontSize: 28, fontWeight: "bold" },
  { label: "Heading 3", fontSize: 22, fontWeight: "semibold" },
  { label: "Subheading", fontSize: 18, fontWeight: "medium" },
  { label: "Body Text", fontSize: 14, fontWeight: "normal" },
  { label: "Caption", fontSize: 12, fontWeight: "normal" },
]

const shapePresets = [
  { label: "Rectangle", width: 200, height: 100, fill: "#e5e7eb", borderRadius: 0 },
  { label: "Rounded Rectangle", width: 200, height: 100, fill: "#e5e7eb", borderRadius: 12 },
  { label: "Square", width: 100, height: 100, fill: "#e5e7eb", borderRadius: 0 },
  { label: "Circle", width: 100, height: 100, fill: "#e5e7eb", borderRadius: 50 },
  { label: "Line", width: 200, height: 4, fill: "#374151", borderRadius: 0 },
]

export function EditorSidebar({ activeTab, onTabChange, onAddElement, assets, profile }: EditorSidebarProps) {
  const addTextElement = (preset: (typeof textPresets)[0]) => {
    onAddElement({
      type: "text",
      x: 100,
      y: 100,
      width: 300,
      height: preset.fontSize * 2,
      content: preset.label,
      fontSize: preset.fontSize,
      fontWeight: preset.fontWeight,
      color: "#1f2937",
      textAlign: "left",
    })
  }

  const addShapeElement = (preset: (typeof shapePresets)[0]) => {
    onAddElement({
      type: "shape",
      x: 100,
      y: 100,
      width: preset.width,
      height: preset.height,
      fill: preset.fill,
      borderRadius: preset.borderRadius,
    })
  }

  const addImageElement = (src: string) => {
    if (src && src.startsWith("blob:")) {
      console.error("[v0] Attempting to add image with blob: URL, using fallback instead")
      src = "/real-estate-property.png"
    }

    console.log("[v0] Adding image element with src:", src)
    onAddElement({
      type: "image",
      x: 100,
      y: 100,
      width: 300,
      height: 200,
      src: src || "/real-estate-property.png",
      objectFit: "cover",
    })
  }

  const addTableElement = () => {
    onAddElement({
      type: "table",
      x: 100,
      y: 100,
      width: 500,
      height: 200,
      columns: ["Column 1", "Column 2", "Column 3"],
      data: [
        ["Cell 1", "Cell 2", "Cell 3"],
        ["Cell 4", "Cell 5", "Cell 6"],
      ],
    })
  }

  const addLogoElement = (logoType: "light" | "dark") => {
    const logoUrl = logoType === "light" ? profile?.logo_light_url : profile?.logo_dark_url

    const validUrl = logoUrl
    if (validUrl && validUrl.startsWith("blob:")) {
      console.error("[v0] Profile has blob: URL, cannot add logo. Please re-upload logos in profile settings.")
      alert("Please re-upload your logos in Profile settings to use them in reports.")
      return
    }

    onAddElement({
      type: "logo",
      x: 100,
      y: 100,
      width: 200,
      height: 70,
      logoType,
      src: validUrl || undefined,
    })
  }

  return (
    <aside className="w-72 border-r border-border bg-card">
      <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as "elements" | "assets" | "text" | "shapes")}>
        <TabsList className="grid w-full grid-cols-4 rounded-none border-b border-border bg-transparent p-0">
          <TabsTrigger
            value="elements"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            <LayoutGrid className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger
            value="text"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            <Type className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger
            value="shapes"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            <Shapes className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger
            value="assets"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            <ImageIcon className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[calc(100vh-8rem)]">
          {/* Elements Tab */}
          <TabsContent value="elements" className="m-0 p-4">
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-medium text-foreground">Basic Elements</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 bg-transparent"
                    onClick={() => addTextElement(textPresets[0])}
                  >
                    <Type className="h-6 w-6" />
                    <span className="text-xs">Text</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 bg-transparent"
                    onClick={() => addShapeElement(shapePresets[0])}
                  >
                    <Square className="h-6 w-6" />
                    <span className="text-xs">Shape</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 bg-transparent"
                    onClick={() => addImageElement("/real-estate-property.png")}
                  >
                    <ImageIcon className="h-6 w-6" />
                    <span className="text-xs">Image</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" onClick={addTableElement}>
                    <Table className="h-6 w-6" />
                    <span className="text-xs">Table</span>
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium text-foreground">Branding</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="h-16 flex-col gap-1 bg-transparent"
                    onClick={() => addLogoElement("light")}
                  >
                    {profile?.logo_light_url ? (
                      <img
                        src={profile.logo_light_url || "/placeholder.svg"}
                        alt="Light Logo"
                        className="h-6 w-10 object-contain"
                      />
                    ) : (
                      <div className="h-6 w-10 rounded bg-muted" />
                    )}
                    <span className="text-xs">Light Logo</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 flex-col gap-1 bg-transparent"
                    onClick={() => addLogoElement("dark")}
                  >
                    {profile?.logo_dark_url ? (
                      <img
                        src={profile.logo_dark_url || "/placeholder.svg"}
                        alt="Dark Logo"
                        className="h-6 w-10 object-contain"
                      />
                    ) : (
                      <div className="h-6 w-10 rounded bg-sidebar" />
                    )}
                    <span className="text-xs">Dark Logo</span>
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium text-foreground">Data</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-16 flex-col gap-1 bg-transparent" onClick={addTableElement}>
                    <Table className="h-5 w-5" />
                    <span className="text-xs">Table</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col gap-1 bg-transparent" disabled>
                    <BarChart3 className="h-5 w-5" />
                    <span className="text-xs">Chart</span>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Text Tab */}
          <TabsContent value="text" className="m-0 p-4">
            <div className="space-y-2">
              <h3 className="mb-3 text-sm font-medium text-foreground">Text Styles</h3>
              {textPresets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => addTextElement(preset)}
                >
                  <span
                    style={{
                      fontSize: Math.min(preset.fontSize, 18),
                      fontWeight: preset.fontWeight === "bold" ? 700 : preset.fontWeight === "semibold" ? 600 : 400,
                    }}
                  >
                    {preset.label}
                  </span>
                </Button>
              ))}
            </div>
          </TabsContent>

          {/* Shapes Tab */}
          <TabsContent value="shapes" className="m-0 p-4">
            <div className="space-y-2">
              <h3 className="mb-3 text-sm font-medium text-foreground">Shapes</h3>
              <div className="grid grid-cols-2 gap-2">
                {shapePresets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    className="h-20 flex-col gap-2 bg-transparent"
                    onClick={() => addShapeElement(preset)}
                  >
                    <div
                      className="bg-muted"
                      style={{
                        width: Math.min(preset.width, 40),
                        height: Math.min(preset.height, 30),
                        borderRadius: preset.borderRadius,
                      }}
                    />
                    <span className="text-xs">{preset.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets" className="m-0 p-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">Asset Library</h3>
              <div className="grid grid-cols-2 gap-2">
                {assets.slice(0, 12).map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => addImageElement(asset.file_url)}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted transition-all hover:ring-2 hover:ring-primary"
                  >
                    <img
                      src={asset.file_url || "/placeholder.svg?height=300&width=300&query=real+estate+placeholder"}
                      alt={asset.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        console.error("[v0] Asset thumbnail load error:", asset.file_url)
                        e.currentTarget.src = "/abstract-geometric-placeholder.png"
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="truncate text-xs text-white">{asset.name}</span>
                    </div>
                  </button>
                ))}
              </div>
              {assets.length > 12 && (
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <a href="/dashboard/assets">View All Assets</a>
                </Button>
              )}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </aside>
  )
}
