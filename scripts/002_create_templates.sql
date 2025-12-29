-- Create templates table for report templates
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  is_system_template BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  category TEXT DEFAULT 'custom',
  page_count INTEGER DEFAULT 1,
  pages JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies - users can see their own templates and public/system templates
CREATE POLICY "templates_select" ON public.templates FOR SELECT 
  USING (auth.uid() = user_id OR is_system_template = TRUE OR is_public = TRUE);
CREATE POLICY "templates_insert_own" ON public.templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "templates_update_own" ON public.templates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "templates_delete_own" ON public.templates FOR DELETE USING (auth.uid() = user_id);
