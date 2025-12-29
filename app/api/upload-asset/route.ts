import { put } from "@vercel/blob"
import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Asset upload API called")

    const supabase = await createServerClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("[v0] User auth check:", user?.id, authError?.message)

    if (authError || !user) {
      console.error("[v0] Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const name = (formData.get("name") as string) || file.name
    const category = (formData.get("category") as string) || "uncategorized"

    console.log("[v0] Upload details:", { name, category, fileSize: file?.size, fileType: file?.type })

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Generate a unique filename with user ID
    const fileExtension = file.name.split(".").pop()
    const filename = `assets/${user.id}/${Date.now()}-${file.name}`

    console.log("[v0] Uploading to Vercel Blob:", filename)

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    })

    console.log("[v0] Blob upload successful:", blob.url)

    // Save asset metadata to database
    const { data: asset, error: dbError } = await supabase
      .from("assets")
      .insert({
        user_id: user.id,
        name,
        category,
        file_url: blob.url,
        file_type: file.type,
        tags: [],
        is_system_asset: false,
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Database error:", dbError)
      return NextResponse.json({ error: "Failed to save asset to database: " + dbError.message }, { status: 500 })
    }

    console.log("[v0] Asset saved to database:", asset?.id)

    return NextResponse.json({
      asset,
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("[v0] Asset upload error:", error)
    const errorMessage = error instanceof Error ? error.message : "Upload failed"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
