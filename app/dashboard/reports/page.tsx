import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, FileText, Search, MoreVertical, Copy, Download } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Report } from "@/lib/types"
import { DeleteReportButton } from "@/components/dashboard/delete-report-button"

export default async function ReportsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: reports } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })

  const userReports = (reports || []) as Report[]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Reports</h1>
          <p className="mt-1 text-muted-foreground">Manage and edit your CMA reports</p>
        </div>
        <Link href="/editor/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Report
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search reports..." className="pl-9" />
        </div>
      </div>

      {/* Reports Grid */}
      {userReports.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {userReports.map((report) => (
            <Card key={report.id} className="group overflow-hidden">
              <Link href={`/editor/${report.id}`}>
                <div className="relative w-full bg-muted" style={{ paddingBottom: `${(11 / 8.5) * 100}%` }}>
                  {report.thumbnail_url ? (
                    <img
                      src={report.thumbnail_url || "/placeholder.svg"}
                      alt={report.name}
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                  ) : (
                    <div className="absolute inset-0 flex h-full items-center justify-center">
                      <FileText className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              </Link>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium text-foreground">{report.name}</h3>
                    <p className="text-sm text-muted-foreground">{new Date(report.updated_at).toLocaleDateString()}</p>
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        report.status === "draft" ? "bg-muted text-muted-foreground" : "bg-chart-3/10 text-chart-3"
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/editor/${report.id}`}>Edit</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Export PDF
                      </DropdownMenuItem>
                      <DeleteReportButton reportId={report.id} reportName={report.name} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="mb-4 h-16 w-16 text-muted-foreground/30" />
            <h3 className="mb-2 text-lg font-medium text-foreground">No reports yet</h3>
            <p className="mb-6 text-center text-muted-foreground">Create your first report to get started</p>
            <Link href="/editor/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Report
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
