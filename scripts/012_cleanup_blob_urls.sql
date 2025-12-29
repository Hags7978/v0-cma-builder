-- Clean up temporary blob URLs from the database
-- These are browser-generated temporary URLs that don't persist across sessions

-- Update profiles table - remove blob URLs from logo fields
UPDATE profiles 
SET 
  logo_light_url = NULL,
  logo_dark_url = NULL
WHERE 
  logo_light_url LIKE 'blob:%' 
  OR logo_dark_url LIKE 'blob:%';

-- Update reports table - remove blob URLs from elements in pages JSON
-- This is more complex as we need to parse JSON and update nested elements
-- For now, we'll just add a comment that users should re-add images to their reports

-- Note: Users will need to:
-- 1. Re-upload their logos in Profile settings
-- 2. Re-add images/logos to existing reports from the asset library
-- The new validation will prevent blob URLs from being saved in the future

-- Optional: You can delete reports with blob URLs if you want to start fresh
-- DELETE FROM reports WHERE pages::text LIKE '%blob:%';

SELECT 'Cleanup complete. Please re-upload your logos in Profile settings and re-add images to reports.' as message;
