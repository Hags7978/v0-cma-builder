import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/dashboard/profile-form"
import type { Profile } from "@/lib/types"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Profile & Branding</h1>
        <p className="mt-1 text-muted-foreground">Customize your profile and brand settings for your reports</p>
      </div>

      <ProfileForm profile={profile as Profile | null} userId={user.id} userEmail={user.email || ""} />
    </div>
  )
}
