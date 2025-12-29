export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  company_name: string | null
  phone: string | null
  website: string | null
  license_number: string | null
  profile_image_url: string | null
  logo_light_url: string | null
  logo_dark_url: string | null
  brand_primary_color: string
  brand_secondary_color: string
  brand_accent_color: string
  created_at: string
  updated_at: string
}

export interface Template {
  id: string
  user_id: string | null
  name: string
  description: string | null
  thumbnail_url: string | null
  is_system_template: boolean
  is_public: boolean
  category: string
  page_count: number
  pages: Page[]
  created_at: string
  updated_at: string
}

export interface Report {
  id: string
  user_id: string
  template_id: string | null
  name: string
  description: string | null
  thumbnail_url: string | null
  status: string
  pages: Page[]
  property_data: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Asset {
  id: string
  user_id: string | null
  name: string
  file_url: string
  file_type: string
  file_size: number | null
  category: string
  is_system_asset: boolean
  tags: string[]
  created_at: string
}

export interface Page {
  id: string
  name: string
  elements: Element[]
}

export interface Element {
  id: string
  type: "text" | "image" | "shape" | "logo" | "table" | "chart"
  x: number
  y: number
  width: number
  height: number
  rotation?: number
  locked?: boolean
  // Text properties
  content?: string
  fontSize?: number
  fontWeight?: string
  fontFamily?: string
  color?: string
  textAlign?: "left" | "center" | "right" | "justify" // Added justify option
  lineHeight?: number
  // Image properties
  src?: string
  alt?: string
  objectFit?: "cover" | "contain" | "fill"
  borderRadius?: number
  opacity?: number // 0-1
  gradient?: {
    type: "linear" | "radial"
    angle: number
    colors: Array<{ color: string; stop: number; opacity?: number }> // Now supports opacity per color stop
  }
  // Shape properties
  fill?: string
  stroke?: string
  strokeWidth?: number
  // Logo properties
  logoType?: "light" | "dark"
  // Table properties
  columns?: string[]
  data?: string | unknown[][]
  // Chart properties
  chartType?: "bar" | "line" | "pie"
  chartData?: unknown
}

export interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reportName: string
  pages: Page[]
  profile: Profile | null
  defaultExportType?: "pdf" | "print"
}
