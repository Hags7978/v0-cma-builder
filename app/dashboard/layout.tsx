import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/dashboard/sidebar"
import type { Profile } from "@/lib/types"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null // Let middleware handle redirect
  }

  const userId = user.id

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar profile={profile as Profile | null} userEmail={user.email || ""} />
      <main className="pl-64">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  )
}
