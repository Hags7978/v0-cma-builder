import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, FileText, Clock, TrendingUp } from "lucide-react"
import type { Report, Template } from "@/lib/types"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user's reports
  const { data: reports } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(6)

  // Fetch system templates
  const { data: templates } = await supabase.from("templates").select("*").eq("is_system_template", true).limit(3)

  // Fetch profile for name
  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single()

  const recentReports = (reports || []) as Report[]
  const systemTemplates = (templates || []) as Template[]
  const userName = profile?.full_name?.split(" ")[0] || "there"

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {userName}</h1>
        <p className="mt-1 text-muted-foreground">Create professional real estate reports in minutes</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/editor/new">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">New Report</p>
                <p className="text-sm text-muted-foreground">Start from scratch</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/templates">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Use Template</p>
                <p className="text-sm text-muted-foreground">Browse library</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
              <TrendingUp className="h-6 w-6 text-chart-3" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{recentReports.length}</p>
              <p className="text-sm text-muted-foreground">Total Reports</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/10">
              <Clock className="h-6 w-6 text-chart-1" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {recentReports.filter((r) => r.status === "draft").length}
              </p>
              <p className="text-sm text-muted-foreground">Drafts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Recent Reports</h2>
          <Link href="/dashboard/reports">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>

        {recentReports.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentReports.map((report) => (
              <Link key={report.id} href={`/editor/${report.id}`}>
                <Card className="cursor-pointer overflow-hidden transition-shadow hover:shadow-md">
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
                  <CardContent className="p-4">
                    <h3 className="truncate font-medium text-foreground">{report.name}</h3>
                    <p className="text-sm text-muted-foreground">{new Date(report.updated_at).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground/30" />
              <p className="mb-4 text-muted-foreground">No reports yet</p>
              <Link href="/editor/new">
                <Button>Create Your First Report</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Templates */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Start with a Template</h2>
          <Link href="/dashboard/templates">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {systemTemplates.map((template) => (
            <Link key={template.id} href={`/editor/new?template=${template.id}`}>
              <Card className="cursor-pointer overflow-hidden transition-shadow hover:shadow-md">
                <div className="relative w-full bg-muted" style={{ paddingBottom: `${(11 / 8.5) * 100}%` }}>
                  {template.thumbnail_url ? (
                    <img
                      src={template.thumbnail_url || "/placeholder.svg"}
                      alt={template.name}
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                  ) : (
                    <div className="absolute inset-0 flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                      <FileText className="h-12 w-12 text-primary/50" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="truncate font-medium text-foreground">{template.name}</h3>
                  <p className="truncate text-sm text-muted-foreground">{template.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
