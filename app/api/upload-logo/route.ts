import { put } from "@vercel/blob"
import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Logo upload API called")

    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const userId = user?.id || "00000000-0000-0000-0000-000000000000"

    const formData = await request.formData()
    const file = formData.get("file") as File
    const logoType = formData.get("logoType") as string

    console.log("[v0] Received file:", { name: file?.name, size: file?.size, type: file?.type, logoType })

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!logoType || !["light", "dark"].includes(logoType)) {
      return NextResponse.json({ error: "Invalid logo type" }, { status: 400 })
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size is 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB` },
        { status: 400 },
      )
    }

    const fileExtension = file.name.split(".").pop()
    const filename = `logos/${userId}/${logoType}-${Date.now()}.${fileExtension}`

    console.log("[v0] Uploading to Vercel Blob:", filename)

    const blob = await put(filename, file, {
      access: "public",
    })

    console.log("[v0] Upload successful:", blob.url)

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("[v0] Logo upload error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 })
  }
}
