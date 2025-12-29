import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as Blob
    const reportId = formData.get("reportId") as string

    if (!file || !reportId) {
      return NextResponse.json({ error: "Missing file or reportId" }, { status: 400 })
    }

    console.log("[v0] API: Uploading thumbnail for report:", reportId)

    const { url } = await put(`thumbnails/${reportId}.jpg`, file, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true, // Allow replacing existing thumbnail
    })

    console.log("[v0] API: Thumbnail uploaded:", url)
    return NextResponse.json({ url })
  } catch (error) {
    console.error("[v0] API: Failed to upload thumbnail:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
