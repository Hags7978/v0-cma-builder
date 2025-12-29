import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/30 p-6">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <FileText className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-2xl font-semibold text-foreground">CMA Builder</span>
      </Link>

      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>We've sent you a confirmation link</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please check your email and click the confirmation link to activate your account. Once confirmed, you can
            sign in and start creating reports.
          </p>
          <Link href="/auth/login">
            <Button variant="outline" className="w-full bg-transparent">
              Back to Sign In
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
