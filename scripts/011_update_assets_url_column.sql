-- Update seed data with proper placeholder URLs that include query parameters
UPDATE public.assets
SET file_url = '/placeholder.svg?height=800&width=1200&query=' || 
  CASE 
    WHEN name LIKE '%Living Room%' THEN 'modern+minimalist+living+room+interior'
    WHEN name LIKE '%Kitchen%' THEN 'modern+open+concept+kitchen+design'
    WHEN name LIKE '%Bedroom%' THEN 'luxury+master+bedroom+interior'
    WHEN name LIKE '%Bathroom%' THEN 'spa+like+luxury+bathroom'
    WHEN name LIKE '%Colonial%' THEN 'classic+colonial+style+house+exterior'
    WHEN name LIKE '%Backyard%' THEN 'beautiful+backyard+with+swimming+pool'
    WHEN name LIKE '%Luxury%' THEN 'luxury+estate+mansion+exterior'
    WHEN name LIKE '%Craftsman%' THEN 'craftsman+style+home+exterior'
    WHEN name LIKE '%Modern%' THEN 'modern+contemporary+house+design'
    WHEN name LIKE '%Suburban%' THEN 'beautiful+suburban+neighborhood'
    WHEN name LIKE '%Downtown%' THEN 'vibrant+downtown+urban+area'
    WHEN name LIKE '%Park%' THEN 'family+friendly+park+with+trees'
    WHEN name LIKE '%Shopping%' THEN 'upscale+shopping+district'
    WHEN name LIKE '%School%' THEN 'modern+school+building+exterior'
    ELSE 'real+estate+property+image'
  END
WHERE is_system_asset = TRUE
  AND (file_url LIKE '/placeholder.svg%' OR file_url NOT LIKE 'http%');
