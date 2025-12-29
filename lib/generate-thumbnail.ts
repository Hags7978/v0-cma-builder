import html2canvas from "html2canvas"

export async function generateReportThumbnail(reportElement: HTMLElement, reportId: string): Promise<string | null> {
  try {
    console.log("[v0] Generating thumbnail for report:", reportId)
    console.log("[v0] Element dimensions:", reportElement.offsetWidth, "x", reportElement.offsetHeight)

    const originalTransform = reportElement.style.transform || ""
    const originalTransformOrigin = reportElement.style.transformOrigin || ""

    // Temporarily remove scale transform to capture full page
    console.log("[v0] Removing transform for capture...")
    reportElement.style.transform = "none"
    reportElement.style.transformOrigin = "top left"

    // Wait for layout to stabilize
    await new Promise((resolve) => setTimeout(resolve, 50))

    console.log("[v0] Capturing canvas at full size...")
    const canvas = await html2canvas(reportElement, {
      scale: 0.6, // Capture at 60% for good quality but manageable size
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
      width: 816, // Force full page width
      height: 1056, // Force full page height
      windowWidth: 816,
      windowHeight: 1056,
    })

    console.log("[v0] Restoring transform...")
    reportElement.style.transform = originalTransform
    reportElement.style.transformOrigin = originalTransformOrigin

    console.log("[v0] Canvas captured, size:", canvas.width, "x", canvas.height)

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error("Failed to create thumbnail blob"))
        },
        "image/jpeg",
        0.95,
      )
    })

    console.log("[v0] Blob created, size:", blob.size, "bytes")

    const formData = new FormData()
    formData.append("file", blob)
    formData.append("reportId", reportId)

    console.log("[v0] Uploading to API...")
    const response = await fetch("/api/thumbnails", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Upload failed")
    }

    const { url } = await response.json()
    console.log("[v0] Uploaded successfully:", url)
    return url
  } catch (error) {
    console.error("[v0] Failed to generate thumbnail:", error)
    return null
  }
}
