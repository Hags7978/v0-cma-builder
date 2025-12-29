"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowLeft, Save, Download, Printer, MoreHorizontal, FileText, Loader2, Check } from "lucide-react"
import Link from "next/link"
import type { Page, Profile } from "@/lib/types"
import { ExportDialog } from "./export-dialog"

interface EditorHeaderProps {
  reportName: string
  onReportNameChange: (name: string) => void
  onSave: () => void
  isSaving: boolean
  hasUnsavedChanges: boolean
  onBack: () => void
  pages?: Page[]
  profile?: Profile | null
}

export function EditorHeader({
  reportName,
  onReportNameChange,
  onSave,
  isSaving,
  hasUnsavedChanges,
  onBack,
  pages = [],
  profile = null,
}: EditorHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [defaultExportType, setDefaultExportType] = useState<"pdf" | "print">("pdf")

  const handlePrint = () => {
    setDefaultExportType("print")
    setShowExportDialog(true)
  }

  const handleExportPDF = () => {
    setDefaultExportType("pdf")
    setShowExportDialog(true)
  }

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 no-print">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            {isEditing ? (
              <Input
                value={reportName}
                onChange={(e) => onReportNameChange(e.target.value)}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
                autoFocus
                className="h-8 w-64 text-lg font-semibold"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-lg font-semibold text-foreground hover:text-primary"
              >
                {reportName}
              </button>
            )}
          </div>

          {hasUnsavedChanges && <span className="text-xs text-muted-foreground">Unsaved changes</span>}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onSave} disabled={isSaving} className="gap-2">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {hasUnsavedChanges ? <Save className="h-4 w-4" /> : <Check className="h-4 w-4 text-chart-3" />}
                {hasUnsavedChanges ? "Save" : "Saved"}
              </>
            )}
          </Button>

          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2 bg-transparent">
            <Printer className="h-4 w-4" />
            Print
          </Button>

          <Button variant="outline" size="sm" onClick={handleExportPDF} className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPDF}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Save as Template</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/dashboard">
            <Button>Done</Button>
          </Link>
        </div>
      </header>

      {/* Export Dialog - now handles both PDF and Print */}
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        reportName={reportName}
        pages={pages}
        profile={profile}
        defaultExportType={defaultExportType}
      />
    </>
  )
}
