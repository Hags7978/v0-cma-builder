import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AssetLibrary } from "@/components/dashboard/asset-library"
import type { Asset } from "@/lib/types"

export default async function AssetsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user's assets
  const { data: userAssets } = await supabase
    .from("assets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch system assets
  const { data: systemAssets } = await supabase.from("assets").select("*").eq("is_system_asset", true).order("category")

  return (
    <div className="p-8">
      <AssetLibrary
        userAssets={(userAssets || []) as Asset[]}
        systemAssets={(systemAssets || []) as Asset[]}
        userId={user.id}
      />
    </div>
  )
}
