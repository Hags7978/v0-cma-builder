import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your account and application preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Export Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Export Preferences</CardTitle>
            <CardDescription>Configure default settings for PDF exports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Default Paper Size</Label>
                <p className="text-sm text-muted-foreground">Standard size for all exports</p>
              </div>
              <Select defaultValue="letter">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="letter">Letter (8.5x11)</SelectItem>
                  <SelectItem value="a4">A4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>High Quality Images</Label>
                <p className="text-sm text-muted-foreground">Use higher resolution for print</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Include Page Numbers</Label>
                <p className="text-sm text-muted-foreground">Add page numbers to exports</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage email and app notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Updates</Label>
                <p className="text-sm text-muted-foreground">Receive product updates and tips</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>New Template Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified when new templates are added</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible and destructive actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Delete All Reports</Label>
                <p className="text-sm text-muted-foreground">Permanently delete all your reports</p>
              </div>
              <Button variant="destructive" size="sm">
                Delete All
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Delete Account</Label>
                <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
              </div>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
