import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Search, Plus, Star } from "lucide-react"
import type { Template } from "@/lib/types"

const categories = [
  { value: "all", label: "All Templates" },
  { value: "cma", label: "CMA Reports" },
  { value: "listing", label: "Listing Presentations" },
  { value: "buyer", label: "Buyer Guides" },
  { value: "custom", label: "My Templates" },
]

export default async function TemplatesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch system templates
  const { data: systemTemplates } = await supabase
    .from("templates")
    .select("*")
    .eq("is_system_template", true)
    .order("name")

  // Fetch user's custom templates
  const { data: userTemplates } = await supabase
    .from("templates")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_system_template", false)
    .order("updated_at", { ascending: false })

  const allSystemTemplates = (systemTemplates || []) as Template[]
  const allUserTemplates = (userTemplates || []) as Template[]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Template Library</h1>
          <p className="mt-1 text-muted-foreground">Choose a template to start your report</p>
        </div>
        <Link href="/editor/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Blank Template
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search templates..." className="pl-9" />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          {categories.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <TemplateGrid templates={[...allSystemTemplates, ...allUserTemplates]} showCategory />
        </TabsContent>

        <TabsContent value="cma">
          <TemplateGrid templates={allSystemTemplates.filter((t) => t.category === "cma")} />
        </TabsContent>

        <TabsContent value="listing">
          <TemplateGrid templates={allSystemTemplates.filter((t) => t.category === "listing")} />
        </TabsContent>

        <TabsContent value="buyer">
          <TemplateGrid templates={allSystemTemplates.filter((t) => t.category === "buyer")} />
        </TabsContent>

        <TabsContent value="custom">
          {allUserTemplates.length > 0 ? (
            <TemplateGrid templates={allUserTemplates} isUserTemplates />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <FileText className="mb-4 h-16 w-16 text-muted-foreground/30" />
                <h3 className="mb-2 text-lg font-medium text-foreground">No custom templates</h3>
                <p className="mb-6 text-center text-muted-foreground">
                  Save any report as a template to reuse it later
                </p>
                <Link href="/dashboard/reports">
                  <Button variant="outline">Go to My Reports</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TemplateGrid({
  templates,
  showCategory = false,
  isUserTemplates = false,
}: {
  templates: Template[]
  showCategory?: boolean
  isUserTemplates?: boolean
}) {
  if (templates.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileText className="mb-4 h-16 w-16 text-muted-foreground/30" />
          <h3 className="mb-2 text-lg font-medium text-foreground">No templates found</h3>
          <p className="text-muted-foreground">Try a different category or search term</p>
        </CardContent>
      </Card>
    )
  }

  const getCategoryLabel = (category: string) => {
    const cat = categories.find((c) => c.value === category)
    return cat?.label || category
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {templates.map((template) => (
        <Link key={template.id} href={`/editor/new?template=${template.id}`}>
          <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:ring-2 hover:ring-primary/20">
            <div className="relative aspect-[8.5/11] bg-muted">
              {template.thumbnail_url ? (
                <img
                  src={template.thumbnail_url || "/placeholder.svg"}
                  alt={template.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-accent/5 to-chart-3/10">
                  <FileText className="mb-2 h-16 w-16 text-primary/40" />
                  <span className="text-sm font-medium text-primary/60">{template.page_count} pages</span>
                </div>
              )}
              {template.is_system_template && (
                <div className="absolute right-2 top-2">
                  <Badge variant="secondary" className="gap-1 bg-background/90 backdrop-blur-sm">
                    <Star className="h-3 w-3" />
                    Featured
                  </Badge>
                </div>
              )}
              <div className="absolute inset-0 bg-primary/0 transition-colors group-hover:bg-primary/5" />
            </div>
            <CardContent className="p-4">
              <h3 className="truncate font-semibold text-foreground group-hover:text-primary">{template.name}</h3>
              {template.description && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{template.description}</p>
              )}
              <div className="mt-3 flex items-center justify-between">
                {showCategory && (
                  <Badge variant="outline" className="text-xs">
                    {getCategoryLabel(template.category)}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">{template.page_count} pages</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
