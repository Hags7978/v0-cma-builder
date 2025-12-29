"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Download, Printer, CheckCircle2 } from "lucide-react"
import type { ExportDialogProps } from "@/lib/types"
import { generatePDF, generatePDFForPrint } from "./pdf-generator"

// 8.5 x 11 inches at 96 DPI = 816 x 1056 pixels
const PAGE_WIDTH = 816
const PAGE_HEIGHT = 1056
const PAGE_ASPECT_RATIO = PAGE_HEIGHT / PAGE_WIDTH // 1.294...

export function ExportDialog({
  open,
  onOpenChange,
  reportName,
  pages,
  profile,
  defaultExportType = "pdf",
}: ExportDialogProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportType, setExportType] = useState<"pdf" | "print">(defaultExportType)
  const [includePageNumbers, setIncludePageNumbers] = useState(true)
  const [exportSuccess, setExportSuccess] = useState(false)

  useEffect(() => {
    setExportType(defaultExportType)
    setExportSuccess(false)
  }, [defaultExportType, open])

  const previewWidth = 320
  const previewHeight = previewWidth * PAGE_ASPECT_RATIO // ~414px

  const handleExport = async () => {
    setIsExporting(true)
    setExportSuccess(false)

    try {
      if (exportType === "pdf") {
        await handlePDFExport()
      } else {
        await handlePrint()
      }

      setExportSuccess(true)
      setTimeout(() => {
        onOpenChange(false)
        setExportSuccess(false)
      }, 2000)
    } catch (error) {
      console.error("[v0] Export error:", error)
      alert(`Export failed: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`)
    } finally {
      setIsExporting(false)
    }
  }

  const handlePDFExport = async () => {
    console.log("[v0] Starting PDF export with jsPDF...")
    await generatePDF(reportName || "report", pages, profile, includePageNumbers)
    console.log("[v0] PDF export complete!")
  }

  const handlePrint = async () => {
    console.log("[v0] Starting print using jsPDF...")
    await generatePDFForPrint(reportName || "report", pages, profile, includePageNumbers)
    console.log("[v0] Print dialog opened!")
  }

  console.log("[v0] Export modal render - pages:", pages.length)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[1200px] !min-w-[1200px] w-[1200px] max-h-[90vh] overflow-hidden p-0">
        <div className="flex flex-col h-full max-h-[90vh]">
          <div className="px-6 pt-6 pb-4 border-b shrink-0">
            <DialogHeader>
              <DialogTitle>Export Report</DialogTitle>
              <DialogDescription>Export your report as a PDF or print directly</DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="flex gap-8 min-h-full">
              {/* LEFT COLUMN - Export Controls */}
              <div className="w-[400px] shrink-0 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="export-type">Export Type</Label>
                    <Select value={exportType} onValueChange={(v) => setExportType(v as "pdf" | "print")}>
                      <SelectTrigger id="export-type" className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">
                          <div className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Export as PDF
                          </div>
                        </SelectItem>
                        <SelectItem value="print">
                          <div className="flex items-center gap-2">
                            <Printer className="h-4 w-4" />
                            Print
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="page-numbers">Include Page Numbers</Label>
                    <Switch id="page-numbers" checked={includePageNumbers} onCheckedChange={setIncludePageNumbers} />
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4 space-y-2 text-sm">
                  <h4 className="font-semibold">Export Details</h4>
                  <p className="text-muted-foreground">Paper Size: Letter (8.5" × 11")</p>
                  <p className="text-muted-foreground">Pages: {pages.length}</p>
                  <p className="text-muted-foreground">Format: High-Quality PDF</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Using professional PDF generation with searchable text
                  </p>
                </div>

                <Button onClick={handleExport} disabled={isExporting || exportSuccess} className="w-full" size="lg">
                  {exportSuccess ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      {exportType === "print" ? "Opened!" : "PDF Opened!"}
                    </>
                  ) : isExporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {exportType === "print" ? "Preparing..." : "Generating PDF..."}
                    </>
                  ) : exportType === "print" ? (
                    <>
                      <Printer className="mr-2 h-4 w-4" />
                      Print Report
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export PDF
                    </>
                  )}
                </Button>

                {exportSuccess && exportType === "pdf" && (
                  <div className="space-y-2">
                    <p className="text-sm text-center text-green-600 font-medium">PDF opened in new tab!</p>
                    <p className="text-xs text-center text-muted-foreground">
                      You can now view, download, or print the PDF from your browser's PDF viewer.
                    </p>
                  </div>
                )}

                {exportSuccess && exportType === "print" && (
                  <p className="text-xs text-center text-green-600">
                    Print dialog opened. You can now print the report.
                  </p>
                )}
              </div>

              {/* RIGHT COLUMN - Preview */}
              <div className="flex-1 flex flex-col items-center justify-start space-y-4">
                <Label className="text-base font-semibold">Preview (First Page)</Label>
                {pages.length > 0 && (
                  <div
                    style={{
                      width: previewWidth,
                      height: previewHeight,
                      position: "relative",
                      backgroundColor: pages[0].backgroundColor || "white",
                      boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.3), 0 0 0 1px rgb(0 0 0 / 0.08)",
                      borderRadius: "6px",
                      overflow: "hidden",
                    }}
                  >
                    {pages[0].elements.map((element) => {
                      const previewScale = previewWidth / PAGE_WIDTH
                      const style: React.CSSProperties = {
                        position: "absolute",
                        left: element.x * previewScale,
                        top: element.y * previewScale,
                        width: element.width * previewScale,
                        height: element.height * previewScale,
                        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                      }

                      switch (element.type) {
                        case "text":
                          return (
                            <div
                              key={element.id}
                              style={{
                                ...style,
                                fontSize: (element.fontSize || 14) * previewScale,
                                fontWeight:
                                  element.fontWeight === "bold" ? 700 : element.fontWeight === "semibold" ? 600 : 400,
                                color: element.color,
                                textAlign: element.textAlign,
                                lineHeight: element.lineHeight || 1.4,
                                whiteSpace: "pre-wrap",
                                overflow: "hidden",
                                wordWrap: "break-word",
                              }}
                            >
                              {element.content}
                            </div>
                          )

                        case "image":
                          return (
                            <img
                              key={element.id}
                              src={element.src || "/real-estate-property-image.jpg"}
                              alt=""
                              style={{
                                ...style,
                                objectFit: element.objectFit || "cover",
                                borderRadius: (element.borderRadius || 0) * previewScale,
                              }}
                            />
                          )

                        case "shape":
                          return (
                            <div
                              key={element.id}
                              style={{
                                ...style,
                                backgroundColor: element.fill,
                                border: element.stroke
                                  ? `${(element.strokeWidth || 1) * previewScale}px solid ${element.stroke}`
                                  : undefined,
                                borderRadius: (element.borderRadius || 0) * previewScale,
                              }}
                            />
                          )

                        case "logo":
                          const logoSrc =
                            (element.logoType === "light" ? profile?.logo_light_url : profile?.logo_dark_url) ||
                            element.src
                          return logoSrc && !logoSrc.startsWith("blob:") ? (
                            <img
                              key={element.id}
                              src={logoSrc || "/placeholder.svg"}
                              alt="Logo"
                              style={{
                                ...style,
                                objectFit: "contain",
                              }}
                            />
                          ) : (
                            <div
                              key={element.id}
                              style={{
                                ...style,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: element.logoType === "light" ? "#f1f5f9" : "#1e293b",
                                color: element.logoType === "light" ? "#64748b" : "#94a3b8",
                                fontSize: 12 * previewScale,
                              }}
                            >
                              Logo
                            </div>
                          )

                        default:
                          return null
                      }
                    })}

                    {includePageNumbers && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 20 * (previewWidth / PAGE_WIDTH),
                          left: 0,
                          right: 0,
                          textAlign: "center",
                          fontSize: 10 * (previewWidth / PAGE_WIDTH),
                          color: "#94a3b8",
                        }}
                      >
                        Page 1 of {pages.length}
                      </div>
                    )}
                  </div>
                )}
                <p className="text-xs text-muted-foreground text-center">
                  This preview shows approximate layout. Actual PDF will be high quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
