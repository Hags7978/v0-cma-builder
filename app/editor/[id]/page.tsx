import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { ReportEditor } from "@/components/editor/report-editor"
import type { Report, Template, Profile, Asset } from "@/lib/types"

interface EditorPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ template?: string }>
}

export default async function EditorPage({ params, searchParams }: EditorPageProps) {
  const { id } = await params
  const { template: templateId } = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch assets for the library
  const { data: assets } = await supabase
    .from("assets")
    .select("*")
    .or(`user_id.eq.${user.id},is_system_asset.eq.true`)
    .order("created_at", { ascending: false })

  let report: Report | null = null
  let template: Template | null = null

  if (id === "new") {
    // Creating a new report
    if (templateId) {
      // Fetch template to use as base
      const { data: templateData } = await supabase.from("templates").select("*").eq("id", templateId).single()

      template = templateData as Template | null
    }
  } else {
    // Editing existing report
    const { data: reportData, error } = await supabase.from("reports").select("*").eq("id", id).single()

    if (error || !reportData) {
      notFound()
    }

    // Verify ownership
    if (reportData.user_id !== user.id) {
      notFound()
    }

    report = reportData as Report
  }

  return (
    <ReportEditor
      report={report}
      template={template}
      profile={profile as Profile | null}
      assets={(assets || []) as Asset[]}
      userId={user.id}
      isNew={id === "new"}
    />
  )
}
