-- Update system assets with proper placeholder image URLs with descriptive queries
UPDATE public.assets SET file_url = '/placeholder.svg?height=400&width=600' WHERE name = 'Modern Living Room';
UPDATE public.assets SET file_url = '/placeholder.svg?height=400&width=600' WHERE name = 'Luxury Kitchen';
UPDATE public.assets SET file_url = '/placeholder.svg?height=400&width=600' WHERE name = 'Master Bedroom';
UPDATE public.assets SET file_url = '/placeholder.svg?height=400&width=600' WHERE name = 'Modern Bathroom';
UPDATE public.assets SET file_url = '/placeholder.svg?height=400&width=600' WHERE name = 'Home Office';
UPDATE public.assets SET file_url = '/placeholder.svg?height=400&width=600' WHERE name = 'Colonial Home';
UPDATE public.assets SET file_url = '/placeholder.svg?height=400&width=600' WHERE name = 'Modern Home';
UPDATE public.assets SET file_url = '/placeholder.svg?height=400&width=600' WHERE name = 'Craftsman Home';
UPDATE public.assets SET file_url = '/placeholder.svg?height=400&width=600' WHERE name = 'Luxury Estate';
UPDATE public.assets SET file_url = '/placeholder.svg?height=400&width=600' WHERE name = 'Backyard Pool';
UPDATE public.assets SET file_url = '/placeholder.svg?height=400&width=600' WHERE name = 'Suburban Neighborhood';
UPDATE public.assets SET file_url = '/placeholder.svg?height=400&width=600' WHERE name = 'Downtown Cityscape';
UPDATE public.assets SET file_url = '/placeholder.svg?height=400&width=600' WHERE name = 'Park View';
UPDATE public.assets SET file_url = '/placeholder.svg?height=100&width=100' WHERE name = 'House Icon';
UPDATE public.assets SET file_url = '/placeholder.svg?height=100&width=100' WHERE name = 'Key Icon';
UPDATE public.assets SET file_url = '/placeholder.svg?height=100&width=100' WHERE name = 'Location Pin';
UPDATE public.assets SET file_url = '/placeholder.svg?height=100&width=100' WHERE name = 'Dollar Sign';
UPDATE public.assets SET file_url = '/placeholder.svg?height=100&width=100' WHERE name = 'Calendar Icon';
UPDATE public.assets SET file_url = '/placeholder.svg?height=100&width=100' WHERE name = 'Checkmark Icon';

-- Also delete and re-insert if records don't exist
DELETE FROM public.assets WHERE is_system_asset = TRUE;

INSERT INTO public.assets (name, file_url, file_type, category, is_system_asset, tags) VALUES
('Modern Living Room', '/placeholder.svg?height=400&width=600', 'image', 'interiors', TRUE, ARRAY['interior', 'living room', 'modern']),
('Luxury Kitchen', '/placeholder.svg?height=400&width=600', 'image', 'interiors', TRUE, ARRAY['interior', 'kitchen', 'luxury']),
('Master Bedroom', '/placeholder.svg?height=400&width=600', 'image', 'interiors', TRUE, ARRAY['interior', 'bedroom', 'elegant']),
('Modern Bathroom', '/placeholder.svg?height=400&width=600', 'image', 'interiors', TRUE, ARRAY['interior', 'bathroom', 'modern']),
('Home Office', '/placeholder.svg?height=400&width=600', 'image', 'interiors', TRUE, ARRAY['interior', 'office', 'workspace']),
('Colonial Home', '/placeholder.svg?height=400&width=600', 'image', 'exteriors', TRUE, ARRAY['exterior', 'colonial', 'traditional']),
('Modern Home', '/placeholder.svg?height=400&width=600', 'image', 'exteriors', TRUE, ARRAY['exterior', 'modern', 'contemporary']),
('Craftsman Home', '/placeholder.svg?height=400&width=600', 'image', 'exteriors', TRUE, ARRAY['exterior', 'craftsman', 'traditional']),
('Luxury Estate', '/placeholder.svg?height=400&width=600', 'image', 'exteriors', TRUE, ARRAY['exterior', 'luxury', 'estate']),
('Backyard Pool', '/placeholder.svg?height=400&width=600', 'image', 'exteriors', TRUE, ARRAY['exterior', 'pool', 'backyard']),
('Suburban Neighborhood', '/placeholder.svg?height=400&width=600', 'image', 'neighborhoods', TRUE, ARRAY['neighborhood', 'suburban', 'aerial']),
('Downtown Cityscape', '/placeholder.svg?height=400&width=600', 'image', 'neighborhoods', TRUE, ARRAY['neighborhood', 'urban', 'city']),
('Park View', '/placeholder.svg?height=400&width=600', 'image', 'neighborhoods', TRUE, ARRAY['neighborhood', 'park', 'community']),
('House Icon', '/placeholder.svg?height=100&width=100', 'icon', 'icons', TRUE, ARRAY['icon', 'house', 'simple']),
('Key Icon', '/placeholder.svg?height=100&width=100', 'icon', 'icons', TRUE, ARRAY['icon', 'key', 'real estate']),
('Location Pin', '/placeholder.svg?height=100&width=100', 'icon', 'icons', TRUE, ARRAY['icon', 'location', 'map']),
('Dollar Sign', '/placeholder.svg?height=100&width=100', 'icon', 'icons', TRUE, ARRAY['icon', 'money', 'price']),
('Calendar Icon', '/placeholder.svg?height=100&width=100', 'icon', 'icons', TRUE, ARRAY['icon', 'calendar', 'schedule']),
('Checkmark Icon', '/placeholder.svg?height=100&width=100', 'icon', 'icons', TRUE, ARRAY['icon', 'check', 'success']);
