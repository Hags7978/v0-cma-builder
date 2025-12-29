import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Palette, Download, Users, ArrowRight, CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">CMA Builder</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Create Stunning Real Estate Reports in Minutes
            </h1>
            <p className="mt-6 text-pretty text-lg leading-8 text-muted-foreground">
              Professional CMA reports, listing presentations, and buyer consultations. Designed for real estate agents
              who want to stand out.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/auth/sign-up">
                <Button size="lg" className="gap-2">
                  Start Creating Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg">
                  See Features
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-16 sm:mt-24">
            <div className="relative mx-auto max-w-5xl">
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
                <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-destructive/60" />
                  <div className="h-3 w-3 rounded-full bg-accent/60" />
                  <div className="h-3 w-3 rounded-full bg-chart-3/60" />
                </div>
                <img src="/professional-real-estate-cma-report-editor-dashboa.jpg" alt="CMA Builder Dashboard Preview" className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything You Need to Impress Clients
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful tools designed specifically for real estate professionals
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group relative rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Template Library</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Start with professional templates for CMAs, listing presentations, and buyer consultations.
              </p>
            </div>

            <div className="group relative rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Palette className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Visual Editor</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Drag-and-drop editor like Canva. Customize colors, fonts, images, and layouts with ease.
              </p>
            </div>

            <div className="group relative rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
                <Users className="h-6 w-6 text-chart-3" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Personal Branding</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Add your logo, brand colors, and contact info. Every report reflects your professional image.
              </p>
            </div>

            <div className="group relative rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/10">
                <Download className="h-6 w-6 text-chart-1" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Print & Export</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Export to PDF or print directly. Perfect 8.5x11 formatting every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to Create Your First Report?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of real estate professionals using CMA Builder
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/auth/sign-up">
                <Button size="lg" className="gap-2">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-chart-3" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-chart-3" />
                <span>Free templates included</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">CMA Builder</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CMA Builder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
