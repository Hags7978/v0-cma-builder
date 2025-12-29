-- Fix system assets with proper placeholder URLs that include query parameter
-- First delete existing system assets
DELETE FROM public.assets WHERE is_system_asset = TRUE;

-- Re-insert with proper placeholder URLs
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
