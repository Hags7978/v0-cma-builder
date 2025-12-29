"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Upload, X, Check } from "lucide-react"
import type { Profile } from "@/lib/types"

interface ProfileFormProps {
  profile: Profile | null
  userId: string
  userEmail: string
}

export function ProfileForm({ profile, userId, userEmail }: ProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Profile fields
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [companyName, setCompanyName] = useState(profile?.company_name || "")
  const [phone, setPhone] = useState(profile?.phone || "")
  const [website, setWebsite] = useState(profile?.website || "")
  const [licenseNumber, setLicenseNumber] = useState(profile?.license_number || "")

  // Image URLs (for demo, using placeholder system)
  const [profileImageUrl, setProfileImageUrl] = useState(profile?.profile_image_url || "")
  const [logoLightUrl, setLogoLightUrl] = useState(profile?.logo_light_url || "")
  const [logoDarkUrl, setLogoDarkUrl] = useState(profile?.logo_dark_url || "")

  // Brand colors
  const [primaryColor, setPrimaryColor] = useState(profile?.brand_primary_color || "#1e40af")
  const [secondaryColor, setSecondaryColor] = useState(profile?.brand_secondary_color || "#3b82f6")
  const [accentColor, setAccentColor] = useState(profile?.brand_accent_color || "#f59e0b")

  const profileImageRef = useRef<HTMLInputElement>(null)
  const logoLightRef = useRef<HTMLInputElement>(null)
  const logoDarkRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void,
    type: string,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      if (type === "logo-light" || type === "logo-dark") {
        formData.append("logoType", type === "logo-light" ? "light" : "dark")
        const response = await fetch("/api/upload-logo", {
          method: "POST",
          body: formData,
        })

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server error: Invalid response format")
        }

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Upload failed")
        }

        if (data.url && data.url.includes("blob.vercel-storage.com")) {
          setter(data.url)
        } else {
          throw new Error("Invalid upload URL received")
        }
      } else {
        // For profile images, use logo upload endpoint with 'light' as default
        formData.append("logoType", "light")
        const response = await fetch("/api/upload-logo", {
          method: "POST",
          body: formData,
        })

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server error: Invalid response format")
        }

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Upload failed")
        }

        if (data.url && data.url.includes("blob.vercel-storage.com")) {
          setter(data.url)
        } else {
          throw new Error("Invalid upload URL received")
        }
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert(error instanceof Error ? error.message : "Upload failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setSuccess(false)

    const supabase = createClient()

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        email: userEmail,
        full_name: fullName,
        company_name: companyName,
        phone,
        website,
        license_number: licenseNumber,
        profile_image_url: profileImageUrl,
        logo_light_url: logoLightUrl,
        logo_dark_url: logoDarkUrl,
        brand_primary_color: primaryColor,
        brand_secondary_color: secondaryColor,
        brand_accent_color: accentColor,
        updated_at: new Date().toISOString(),
      })
      .select()

    setIsLoading(false)

    if (!error) {
      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : userEmail.slice(0, 2).toUpperCase()

  return (
    <Tabs defaultValue="profile" className="max-w-4xl">
      <TabsList className="mb-6">
        <TabsTrigger value="profile">Profile Information</TabsTrigger>
        <TabsTrigger value="branding">Branding & Logos</TabsTrigger>
        <TabsTrigger value="colors">Brand Colors</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>This information will appear on your reports and presentations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Photo */}
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileImageUrl || undefined} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <input
                  ref={profileImageRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, setProfileImageUrl, "profile")}
                />
                <Button variant="outline" onClick={() => profileImageRef.current?.click()} className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </Button>
                {profileImageUrl && (
                  <Button variant="ghost" size="sm" onClick={() => setProfileImageUrl("")} className="ml-2">
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <p className="mt-2 text-xs text-muted-foreground">Recommended: Square image, at least 200x200px</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company/Brokerage</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="ABC Real Estate"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="DRE# 01234567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={userEmail} disabled className="bg-muted" />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="branding">
        <Card>
          <CardHeader>
            <CardTitle>Logos</CardTitle>
            <CardDescription>Upload your company logos for light and dark backgrounds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Light */}
            <div className="space-y-3">
              <Label>Logo for Light Backgrounds</Label>
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-48 items-center justify-center rounded-lg border border-dashed border-border bg-card">
                  {logoLightUrl ? (
                    <img
                      src={logoLightUrl || "/placeholder.svg"}
                      alt="Logo Light"
                      className="max-h-20 max-w-44 object-contain"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">No logo</span>
                  )}
                </div>
                <div>
                  <input
                    ref={logoLightRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, setLogoLightUrl, "logo-light")}
                  />
                  <Button variant="outline" onClick={() => logoLightRef.current?.click()} className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Logo
                  </Button>
                  {logoLightUrl && (
                    <Button variant="ghost" size="sm" onClick={() => setLogoLightUrl("")} className="ml-2">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Use on light/white backgrounds. PNG with transparency works best.
              </p>
            </div>

            {/* Logo Dark */}
            <div className="space-y-3">
              <Label>Logo for Dark Backgrounds</Label>
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-48 items-center justify-center rounded-lg border border-dashed border-sidebar-border bg-sidebar">
                  {logoDarkUrl ? (
                    <img
                      src={logoDarkUrl || "/placeholder.svg"}
                      alt="Logo Dark"
                      className="max-h-20 max-w-44 object-contain"
                    />
                  ) : (
                    <span className="text-sm text-sidebar-foreground/60">No logo</span>
                  )}
                </div>
                <div>
                  <input
                    ref={logoDarkRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, setLogoDarkUrl, "logo-dark")}
                  />
                  <Button variant="outline" onClick={() => logoDarkRef.current?.click()} className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Logo
                  </Button>
                  {logoDarkUrl && (
                    <Button variant="ghost" size="sm" onClick={() => setLogoDarkUrl("")} className="ml-2">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Use on dark/colored backgrounds. Light colors work best.</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="colors">
        <Card>
          <CardHeader>
            <CardTitle>Brand Colors</CardTitle>
            <CardDescription>Choose colors that match your brand identity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-3">
              {/* Primary Color */}
              <div className="space-y-3">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    id="primaryColor"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-10 cursor-pointer rounded border-0 bg-transparent"
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 font-mono text-sm uppercase"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Main brand color for headers and accents</p>
              </div>

              {/* Secondary Color */}
              <div className="space-y-3">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    id="secondaryColor"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="h-10 w-10 cursor-pointer rounded border-0 bg-transparent"
                  />
                  <Input
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1 font-mono text-sm uppercase"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Supporting color for backgrounds</p>
              </div>

              {/* Accent Color */}
              <div className="space-y-3">
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    id="accentColor"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-10 w-10 cursor-pointer rounded border-0 bg-transparent"
                  />
                  <Input
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1 font-mono text-sm uppercase"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Highlight color for CTAs and emphasis</p>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-3">
              <Label>Preview</Label>
              <div className="overflow-hidden rounded-lg border border-border">
                <div className="p-4" style={{ backgroundColor: primaryColor }}>
                  <p className="font-semibold text-white">Header with Primary Color</p>
                </div>
                <div className="p-4" style={{ backgroundColor: secondaryColor }}>
                  <p className="text-white">Section with Secondary Color</p>
                </div>
                <div className="flex items-center justify-between bg-card p-4">
                  <p className="text-foreground">Content area</p>
                  <button
                    type="button"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    Accent Button
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Save Button */}
      <div className="mt-6 flex items-center gap-4">
        <Button onClick={handleSave} disabled={isLoading} className="gap-2">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : success ? (
            <>
              <Check className="h-4 w-4" />
              Saved!
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
        {success && <span className="text-sm text-chart-3">Your changes have been saved successfully.</span>}
      </div>
    </Tabs>
  )
}
