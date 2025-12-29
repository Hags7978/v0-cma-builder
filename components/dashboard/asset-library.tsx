"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, Search, ImageIcon, Trash2, Eye, Loader2, Home, Building, Trees, Sparkles } from "lucide-react"
import type { Asset } from "@/lib/types"

interface AssetLibraryProps {
  userAssets: Asset[]
  systemAssets: Asset[]
  userId: string
}

const categories = [
  { value: "all", label: "All", icon: Sparkles },
  { value: "interiors", label: "Interiors", icon: Home },
  { value: "exteriors", label: "Exteriors", icon: Building },
  { value: "neighborhoods", label: "Neighborhoods", icon: Trees },
  { value: "icons", label: "Icons", icon: ImageIcon },
]

export function AssetLibrary({ userAssets, systemAssets, userId }: AssetLibraryProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isUploading, setIsUploading] = useState(false)
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null)
  const [assets, setAssets] = useState<Asset[]>(userAssets)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    for (const file of Array.from(files)) {
      try {
        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} is not a valid image file`)
        }

        if (file.size > 10 * 1024 * 1024) {
          // 10MB limit
          throw new Error(`${file.name} is too large. Maximum size is 10MB`)
        }

        console.log("[v0] Uploading asset:", file.name, file.type, file.size)

        const formData = new FormData()
        formData.append("file", file)
        formData.append("name", file.name.replace(/\.[^/.]+$/, ""))
        formData.append("category", "general")

        const response = await fetch("/api/upload-asset", {
          method: "POST",
          body: formData,
        })

        console.log("[v0] Upload response status:", response.status, response.statusText)

        const contentType = response.headers.get("content-type")
        console.log("[v0] Response content-type:", contentType)

        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text()
          console.error("[v0] Non-JSON response:", text.substring(0, 500))
          throw new Error(`Server error: Expected JSON but received ${contentType || "unknown"}`)
        }

        const data = await response.json()
        console.log("[v0] Upload response data:", data)

        if (!response.ok) {
          throw new Error(data.error || "Upload failed")
        }

        if (data.asset) {
          setAssets((prev) => [data.asset, ...prev])
          console.log("[v0] Asset uploaded successfully:", data.asset.id)
        }
      } catch (error) {
        console.error("[v0] Asset upload error:", error)
        alert(error instanceof Error ? error.message : "Upload failed. Please try again.")
      }
    }

    setIsUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    router.refresh()
  }

  const handleDelete = async (assetId: string) => {
    const supabase = createClient()
    await supabase.from("assets").delete().eq("id", assetId)
    setAssets((prev) => prev.filter((a) => a.id !== assetId))
    router.refresh()
  }

  const filteredUserAssets = assets.filter((asset) => {
    const matchesSearch =
      searchQuery === "" ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || asset.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredSystemAssets = systemAssets.filter((asset) => {
    const matchesSearch =
      searchQuery === "" ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || asset.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Asset Library</h1>
          <p className="mt-1 text-muted-foreground">Manage images and media for your reports</p>
        </div>
        <div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="gap-2">
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Assets
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={selectedCategory === cat.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.value)}
              className="gap-2"
            >
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="my-assets">
        <TabsList className="mb-6">
          <TabsTrigger value="my-assets">My Assets ({assets.length})</TabsTrigger>
          <TabsTrigger value="stock">Stock Library ({systemAssets.length})</TabsTrigger>
        </TabsList>

        {/* My Assets */}
        <TabsContent value="my-assets">
          {filteredUserAssets.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {filteredUserAssets.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  onPreview={() => setPreviewAsset(asset)}
                  onDelete={() => handleDelete(asset.id)}
                  canDelete
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <ImageIcon className="mb-4 h-16 w-16 text-muted-foreground/30" />
                <h3 className="mb-2 text-lg font-medium text-foreground">
                  {searchQuery ? "No matching assets" : "No assets yet"}
                </h3>
                <p className="mb-6 text-center text-muted-foreground">
                  {searchQuery ? "Try a different search term" : "Upload images to use in your reports"}
                </p>
                {!searchQuery && (
                  <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Assets
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Stock Library */}
        <TabsContent value="stock">
          {filteredSystemAssets.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {filteredSystemAssets.map((asset) => (
                <AssetCard key={asset.id} asset={asset} onPreview={() => setPreviewAsset(asset)} isStock />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <ImageIcon className="mb-4 h-16 w-16 text-muted-foreground/30" />
                <h3 className="mb-2 text-lg font-medium text-foreground">No matching assets</h3>
                <p className="text-muted-foreground">Try a different category or search term</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Preview Modal */}
      <Dialog open={!!previewAsset} onOpenChange={() => setPreviewAsset(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewAsset?.name}</DialogTitle>
            <DialogDescription>
              {previewAsset?.category} • {previewAsset?.file_type}
            </DialogDescription>
          </DialogHeader>
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
            {previewAsset && (
              <img
                src={previewAsset.file_url || "/placeholder.svg"}
                alt={previewAsset.name}
                className="h-full w-full object-contain"
              />
            )}
          </div>
          {previewAsset?.tags && previewAsset.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {previewAsset.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

interface AssetCardProps {
  asset: Asset
  onPreview: () => void
  onDelete?: () => void
  canDelete?: boolean
  isStock?: boolean
}

function AssetCard({ asset, onPreview, onDelete, canDelete, isStock }: AssetCardProps) {
  const [imgError, setImgError] = useState(false)
  const isBlobUrl = asset.file_url?.startsWith("blob:")
  const isPlaceholder = asset.file_url?.includes("/placeholder.svg")

  // For stock assets with placeholder URLs, keep the original URL with query parameter
  // For broken images or blob URLs, use fallback
  const imgSrc = imgError || isBlobUrl ? "/real-estate-property-image.jpg" : asset.file_url

  return (
    <Card className="group overflow-hidden">
      <div className="relative aspect-square bg-muted">
        {isPlaceholder && !imgError ? (
          <img
            src={asset.file_url || "/placeholder.svg?height=300&width=300&query=real+estate+placeholder"}
            alt={asset.name}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => {
              if (!imgError) {
                console.error("[v0] Asset card image load error:", asset.file_url)
                setImgError(true)
              }
            }}
          />
        ) : (
          <img
            src={imgSrc || "/real-estate-property-image.jpg"}
            alt={asset.name}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => {
              if (!imgError) {
                console.error("[v0] Asset card image load error:", asset.file_url)
                setImgError(true)
              }
            }}
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <Button variant="secondary" size="icon" className="h-8 w-8" onClick={onPreview}>
            <Eye className="h-4 w-4" />
          </Button>
          {canDelete && onDelete && (
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        {isStock && <Badge className="absolute left-2 top-2 bg-primary/90 text-xs">Stock</Badge>}
      </div>
      <CardContent className="p-3">
        <p className="truncate text-sm font-medium text-foreground">{asset.name}</p>
        <p className="text-xs text-muted-foreground">{asset.category}</p>
      </CardContent>
    </Card>
  )
}
