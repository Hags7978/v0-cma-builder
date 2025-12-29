-- Fix stock assets with working image URLs
UPDATE assets
SET file_url = CASE 
  WHEN name = 'Colonial Home' THEN '/placeholder.svg?height=600&width=800'
  WHEN name = 'Backyard Pool' THEN '/placeholder.svg?height=600&width=800'
  WHEN name = 'Luxury Estate' THEN '/placeholder.svg?height=600&width=800'
  WHEN name = 'Craftsman Home' THEN '/placeholder.svg?height=600&width=800'
  WHEN name = 'Modern Home' THEN '/placeholder.svg?height=600&width=800'
  WHEN name = 'Victorian House' THEN '/placeholder.svg?height=600&width=800'
  WHEN name = 'Ranch House' THEN '/placeholder.svg?height=600&width=800'
  WHEN name = 'Tudor Home' THEN '/placeholder.svg?height=600&width=800'
  WHEN name = 'Mediterranean Villa' THEN '/placeholder.svg?height=600&width=800'
  WHEN name = 'Bungalow' THEN '/placeholder.svg?height=600&width=800'
  WHEN name = 'Living Room' THEN '/placeholder.svg?height=600&width=800'
  WHEN name = 'Kitchen' THEN '/placeholder.svg?height=600&width=800'
  WHEN name = 'Master Bedroom' THEN '/placeholder.svg?height=600&width=800'
  WHEN name = 'Bathroom' THEN '/placeholder.svg?height=600&width=800'
  WHEN name = 'Dining Room' THEN '/placeholder.svg?height=600&width=800'
  WHEN name = 'Home Office' THEN '/placeholder.svg?height=600&width=800'
  WHEN name = 'Suburban Street' THEN '/placeholder.svg?height=600&width=800'
  WHEN name = 'Park' THEN '/placeholder.svg?height=600&width=800'
  WHEN name = 'Shopping District' THEN '/placeholder.svg?height=600&width=800'
  ELSE file_url
END
WHERE is_system_asset = true;
