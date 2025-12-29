"use client"

import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import type { Page as ReportPage, Profile } from "@/lib/types"

// 8.5 x 11 inches
const PAGE_WIDTH_INCHES = 8.5
const PAGE_HEIGHT_INCHES = 11
const PAGE_WIDTH_PX = 816 // 8.5 * 96 DPI
const PAGE_HEIGHT_PX = 1056 // 11 * 96 DPI

const oklchToRgbMap: Record<string, string> = {
  "oklch(0.98 0.005 250)": "rgb(251, 251, 253)",
  "oklch(0.15 0.02 250)": "rgb(33, 36, 43)",
  "oklch(1 0 0)": "rgb(255, 255, 255)",
  "oklch(0.45 0.15 250)": "rgb(43, 82, 190)",
  "oklch(0.95 0.01 250)": "rgb(245, 245, 248)",
  "oklch(0.25 0.03 250)": "rgb(54, 56, 66)",
  "oklch(0.65 0.18 45)": "rgb(255, 167, 38)",
  "oklch(0.55 0.22 25)": "rgb(220, 69, 51)",
  "oklch(0.9 0.01 250)": "rgb(231, 232, 238)",
  "oklch(0.13 0.02 250)": "rgb(28, 30, 37)",
  "oklch(0.17 0.02 250)": "rgb(38, 41, 49)",
  "oklch(0.6 0.18 250)": "rgb(87, 130, 255)",
  "oklch(0.12 0.02 250)": "rgb(26, 28, 34)",
  "oklch(0.22 0.025 250)": "rgb(49, 52, 61)",
  "oklch(0.28 0.025 250)": "rgb(63, 66, 77)",
  "oklch(0 0 0)": "rgb(0, 0, 0)",
  "oklch(0.5 0 0)": "rgb(128, 128, 128)",
  "oklch(0.75 0 0)": "rgb(191, 191, 191)",
}

function convertOklchColorsToRgb(element: HTMLElement): {
  styleSheet: HTMLStyleElement | null
  originalStyles: Map<Element, { prop: string; original: string }[]>
} {
  const originalStyles = new Map<Element, { prop: string; original: string }[]>()

  // Create a global style override
  const styleSheet = document.createElement("style")
  let cssRules = ""

  const allElements = [element, ...Array.from(element.querySelectorAll("*"))]
  allElements.forEach((el, index) => {
    // Add a unique class to target this element
    const uniqueClass = `pdf-export-${index}`
    el.classList.add(uniqueClass)

    const computed = window.getComputedStyle(el as HTMLElement)
    const changes: { prop: string; original: string }[] = []

    // Check all color-related properties
    const colorProps = [
      "color",
      "backgroundColor",
      "background",
      "borderColor",
      "borderTopColor",
      "borderRightColor",
      "borderBottomColor",
      "borderLeftColor",
      "outlineColor",
      "fill",
      "stroke",
      "caretColor",
      "columnRuleColor",
      "textDecorationColor",
    ]

    const elementCssRules: string[] = []

    colorProps.forEach((prop) => {
      const value = computed.getPropertyValue(prop)
      if (value && value.includes("oklch")) {
        console.log(`[v0] Converting ${prop}: ${value}`)
        // Try to find RGB equivalent
        const rgbValue = oklchToRgbMap[value] || convertOklchToRgbFallback(value)
        if (rgbValue) {
          changes.push({ prop, original: (el as HTMLElement).style.getPropertyValue(prop) || "" })
          // Set inline style
          ;(el as HTMLElement).style.setProperty(prop, rgbValue, "important")
          // Also add CSS rule
          const cssProp = prop.replace(/([A-Z])/g, "-$1").toLowerCase()
          elementCssRules.push(`${cssProp}: ${rgbValue} !important;`)
        }
      }
    })

    if (elementCssRules.length > 0) {
      cssRules += `.${uniqueClass} { ${elementCssRules.join(" ")} }\n`
    }

    if (changes.length > 0) {
      originalStyles.set(el, changes)
    }
  })

  // Add the style sheet to the document
  if (cssRules) {
    styleSheet.textContent = cssRules
    document.head.appendChild(styleSheet)
  }

  return { styleSheet: cssRules ? styleSheet : null, originalStyles }
}

function convertOklchToRgbFallback(oklch: string): string {
  // Extract lightness value from oklch string
  const match = oklch.match(/oklch\(([\d.]+)/)
  if (match) {
    const lightness = Number.parseFloat(match[1])
    const gray = Math.round(lightness * 255)
    return `rgb(${gray}, ${gray}, ${gray})`
  }
  return "rgb(128, 128, 128)" // Default gray
}

function restoreOriginalStyles(
  originalStyles: Map<Element, { prop: string; original: string }[]>,
  styleSheet: HTMLStyleElement | null,
) {
  // Remove the style sheet
  if (styleSheet && styleSheet.parentNode) {
    styleSheet.parentNode.removeChild(styleSheet)
  }

  // Restore original inline styles
  originalStyles.forEach((changes, el) => {
    // Remove the unique class
    el.className = el.className.replace(/pdf-export-\d+/g, "").trim()

    changes.forEach(({ prop, original }) => {
      if (original) {
        ;(el as HTMLElement).style.setProperty(prop, original)
      } else {
        ;(el as HTMLElement).style.removeProperty(prop)
      }
    })
  })
}

export async function generatePDF(
  reportName: string,
  pages: ReportPage[],
  profile: Profile | null,
  includePageNumbers = true,
): Promise<void> {
  console.log("[v0] Starting Canva-style PDF generation...")

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "in",
    format: "letter",
    compress: true,
  })

  for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
    const page = pages[pageIndex]
    console.log(`[v0] Rendering page ${pageIndex + 1}/${pages.length}...`)

    // Create temporary render container
    const container = document.createElement("div")
    container.style.position = "fixed"
    container.style.left = "-9999px"
    container.style.top = "0"
    container.style.width = `${PAGE_WIDTH_PX}px`
    container.style.height = `${PAGE_HEIGHT_PX}px`
    container.style.background = page.backgroundColor || "white"
    document.body.appendChild(container)

    // Render page elements
    page.elements.forEach((element) => {
      const el = document.createElement("div")
      el.style.position = "absolute"
      el.style.left = `${element.x}px`
      el.style.top = `${element.y}px`
      el.style.width = `${element.width}px`
      el.style.height = `${element.height}px`
      if (element.rotation) el.style.transform = `rotate(${element.rotation}deg)`
      if (element.opacity !== undefined) el.style.opacity = String(element.opacity)

      switch (element.type) {
        case "text":
          el.style.fontSize = `${element.fontSize || 14}px`
          el.style.fontWeight =
            element.fontWeight === "bold" ? "700" : element.fontWeight === "semibold" ? "600" : "400"
          el.style.fontFamily = element.fontFamily || "inherit"
          el.style.color = element.color || "#000000"
          el.style.textAlign = element.textAlign || "left"
          el.style.lineHeight = String(element.lineHeight || 1.4)
          el.style.whiteSpace = "pre-wrap"
          el.style.overflow = "hidden"
          el.style.wordWrap = "break-word"
          el.textContent = element.content || ""
          break

        case "image":
          const img = document.createElement("img")
          img.src = element.src || "/placeholder.svg?height=200&width=300"
          img.style.width = "100%"
          img.style.height = "100%"
          img.style.objectFit = "contain"
          if (element.borderRadius) img.style.borderRadius = `${element.borderRadius}px`
          img.crossOrigin = "anonymous"
          el.appendChild(img)
          break

        case "shape":
          if (element.gradient) {
            const { type, angle, colors } = element.gradient
            if (type === "linear") {
              const colorStops = colors
                .map((c) => {
                  const opacity = c.opacity !== undefined ? c.opacity / 100 : 1
                  const rgbaColor = hexToRgba(c.color, opacity)
                  return `${rgbaColor} ${c.stop}%`
                })
                .join(", ")
              el.style.background = `linear-gradient(${angle}deg, ${colorStops})`
            } else if (type === "radial") {
              const colorStops = colors
                .map((c) => {
                  const opacity = c.opacity !== undefined ? c.opacity / 100 : 1
                  const rgbaColor = hexToRgba(c.color, opacity)
                  return `${rgbaColor} ${c.stop}%`
                })
                .join(", ")
              el.style.background = `radial-gradient(circle, ${colorStops})`
            }
          } else if (element.fill) {
            el.style.backgroundColor = element.fill
          }
          if (element.stroke) {
            el.style.border = `${element.strokeWidth || 1}px solid ${element.stroke}`
          }
          if (element.borderRadius) el.style.borderRadius = `${element.borderRadius}px`
          break

        case "logo":
          el.style.display = "flex"
          el.style.alignItems = "center"
          el.style.justifyContent = "center"

          const logoSrc =
            (element.logoType === "light" ? profile?.logo_light_url : profile?.logo_dark_url) || element.src
          if (logoSrc && !logoSrc.startsWith("blob:")) {
            const logoImg = document.createElement("img")
            logoImg.src = logoSrc
            logoImg.style.maxWidth = "100%"
            logoImg.style.maxHeight = "100%"
            logoImg.style.objectFit = "contain"
            logoImg.crossOrigin = "anonymous"
            el.appendChild(logoImg)
          }
          break
      }

      container.appendChild(el)
    })

    // Add page number if enabled
    if (includePageNumbers) {
      const pageNum = document.createElement("div")
      pageNum.style.position = "absolute"
      pageNum.style.bottom = "20px"
      pageNum.style.left = "0"
      pageNum.style.right = "0"
      pageNum.style.textAlign = "center"
      pageNum.style.fontSize = "10px"
      pageNum.style.color = "#94a3b8"
      pageNum.textContent = `Page ${pageIndex + 1} of ${pages.length}`
      container.appendChild(pageNum)
    }

    // Wait for images to load
    await new Promise((resolve) => setTimeout(resolve, 500))

    const { styleSheet, originalStyles } = convertOklchColorsToRgb(container)

    await new Promise((resolve) => setTimeout(resolve, 100))

    try {
      // Capture with html2canvas
      const canvas = await html2canvas(container, {
        scale: 2, // High quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: page.backgroundColor || "#ffffff",
        logging: false,
      })

      // Add page to PDF
      if (pageIndex > 0) {
        pdf.addPage()
      }

      const imgData = canvas.toDataURL("image/jpeg", 0.95)
      pdf.addImage(imgData, "JPEG", 0, 0, PAGE_WIDTH_INCHES, PAGE_HEIGHT_INCHES, undefined, "FAST")

      console.log(`[v0] Page ${pageIndex + 1} captured successfully`)
    } catch (error) {
      console.error(`[v0] Failed to capture page ${pageIndex + 1}:`, error)
      throw error
    } finally {
      restoreOriginalStyles(originalStyles, styleSheet)
      document.body.removeChild(container)
    }
  }

  // Open PDF in new tab
  try {
    const pdfBlob = pdf.output("blob")
    const url = URL.createObjectURL(pdfBlob)
    const newWindow = window.open(url, "_blank")

    if (!newWindow) {
      const link = document.createElement("a")
      link.href = url
      link.download = `${reportName || "report"}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    setTimeout(() => URL.revokeObjectURL(url), 10000)
    console.log("[v0] PDF generated and opened successfully!")
  } catch (error) {
    console.error("[v0] PDF output failed:", error)
    throw new Error("Failed to generate PDF. Please try again.")
  }
}

export async function generatePDFForPrint(
  reportName: string,
  pages: ReportPage[],
  profile: Profile | null,
  includePageNumbers = true,
): Promise<void> {
  // Use the same generation logic for print
  await generatePDF(reportName, pages, profile, includePageNumbers)
}

function hexToRgba(hex: string, opacity: number): string {
  // Remove # if present
  hex = hex.replace("#", "")

  // Parse hex values
  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}
