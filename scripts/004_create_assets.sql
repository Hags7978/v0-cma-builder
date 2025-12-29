-- Create assets table for user-uploaded assets
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  category TEXT DEFAULT 'general',
  is_system_asset BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- RLS Policies - users can see their own assets and system assets
CREATE POLICY "assets_select" ON public.assets FOR SELECT 
  USING (auth.uid() = user_id OR is_system_asset = TRUE);
CREATE POLICY "assets_insert_own" ON public.assets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "assets_update_own" ON public.assets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "assets_delete_own" ON public.assets FOR DELETE USING (auth.uid() = user_id);
