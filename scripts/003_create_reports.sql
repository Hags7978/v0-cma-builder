-- Create reports table for user-created reports
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.templates(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  status TEXT DEFAULT 'draft',
  pages JSONB DEFAULT '[]'::JSONB,
  property_data JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "reports_select_own" ON public.reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "reports_insert_own" ON public.reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reports_update_own" ON public.reports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reports_delete_own" ON public.reports FOR DELETE USING (auth.uid() = user_id);
