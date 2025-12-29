-- Update stock assets with real image query parameters
UPDATE assets
SET file_url = '/placeholder.svg?height=600&width=800&query=' || 
  CASE name
    WHEN 'Modern Living Room' THEN 'modern+minimalist+living+room+interior'
    WHEN 'Luxury Kitchen' THEN 'luxury+modern+kitchen+with+island'
    WHEN 'Master Bedroom' THEN 'elegant+master+bedroom+interior'
    WHEN 'Elegant Bathroom' THEN 'luxury+spa+bathroom+marble'
    WHEN 'Home Office' THEN 'contemporary+home+office+workspace'
    WHEN 'Dining Room' THEN 'modern+dining+room+with+table'
    WHEN 'Colonial Home' THEN 'colonial+style+house+exterior'
    WHEN 'Backyard Pool' THEN 'luxury+backyard+swimming+pool'
    WHEN 'Luxury Estate' THEN 'luxury+estate+home+exterior'
    WHEN 'Craftsman Home' THEN 'craftsman+style+house'
    WHEN 'Modern Home' THEN 'modern+contemporary+house+exterior'
    WHEN 'Victorian Home' THEN 'victorian+style+house'
    WHEN 'Family Neighborhood' THEN 'suburban+neighborhood+street'
    WHEN 'Downtown District' THEN 'urban+downtown+buildings'
    WHEN 'Waterfront Community' THEN 'waterfront+homes+lakeside'
    WHEN 'Golf Course Community' THEN 'golf+course+community+homes'
    WHEN 'Historic District' THEN 'historic+district+architecture'
    WHEN 'Key Icon' THEN 'house+key+icon+real+estate'
    WHEN 'Home Icon' THEN 'home+house+icon+simple'
    ELSE 'real+estate+property'
  END
WHERE is_system_asset = true;
