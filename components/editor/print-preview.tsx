"use client"
import type { Page, Profile } from "@/lib/types"

interface PrintPreviewProps {
  pages: Page[]
  profile: Profile | null
  includePageNumbers: boolean
  reportName: string
}

export function PrintPreview({ pages, profile, includePageNumbers, reportName }: PrintPreviewProps) {
  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold">Print Preview Deprecated</h2>
        <p className="text-muted-foreground">
          This component has been replaced with PDF-based printing.
          <br />
          Please use the Export dialog to print your reports.
        </p>
      </div>
    </div>
  )
}
