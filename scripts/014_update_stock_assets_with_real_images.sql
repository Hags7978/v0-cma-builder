-- Phase 1: Update all stock assets with real image URLs
-- This replaces placeholder URLs with actual images stored in the public directory

-- Update Exteriors
UPDATE assets SET file_url = '/assets/stock/exteriors/backyard-pool.jpg' 
WHERE id = '00ff1049-8e56-4609-84b8-d285eec9b734';

UPDATE assets SET file_url = '/assets/stock/exteriors/colonial-home.jpg' 
WHERE id = '29553d30-f24a-433c-a4de-5de3c25645cf';

UPDATE assets SET file_url = '/assets/stock/exteriors/craftsman-home.jpg' 
WHERE id = 'a6226290-8a4b-4608-ae15-f8ceceaedda6';

UPDATE assets SET file_url = '/assets/stock/exteriors/luxury-estate.jpg' 
WHERE id = '838f1d00-eb34-44ee-822a-b95183dda28e';

UPDATE assets SET file_url = '/assets/stock/exteriors/modern-home.jpg' 
WHERE id = 'f93808cb-5f5f-4c50-8dcc-52d55c82e319';

-- Update Icons
UPDATE assets SET file_url = '/assets/stock/icons/calendar.svg' 
WHERE id = 'bec3531f-9435-4c47-8312-22b97384a605';

UPDATE assets SET file_url = '/assets/stock/icons/checkmark.svg' 
WHERE id = '0d0ece58-c101-4724-b37d-e5a7ac18a9e1';

UPDATE assets SET file_url = '/assets/stock/icons/dollar-sign.svg' 
WHERE id = '3599bb59-5670-4c6b-865c-12f0ed7092d2';

UPDATE assets SET file_url = '/assets/stock/icons/house.svg' 
WHERE id = '3bce0d60-ece8-4e58-baa2-714a960506da';

UPDATE assets SET file_url = '/assets/stock/icons/key.svg' 
WHERE id = '0ea28ad8-cb58-4552-9d9b-7996c8dd94df';

UPDATE assets SET file_url = '/assets/stock/icons/location-pin.svg' 
WHERE id = '4076b91f-817c-42f5-892a-419eca4a3cb3';

-- Update Interiors
UPDATE assets SET file_url = '/assets/stock/interiors/home-office.jpg' 
WHERE id = 'c9dda730-980d-457c-b55f-0adbb71bd31a';

UPDATE assets SET file_url = '/assets/stock/interiors/luxury-kitchen.jpg' 
WHERE id = 'e93e21a5-a175-437c-8b3a-1c52810fdb72';

UPDATE assets SET file_url = '/assets/stock/interiors/master-bedroom.jpg' 
WHERE id = 'd8c72cbe-f67a-48ed-a88f-19976e8ae94b';

UPDATE assets SET file_url = '/assets/stock/interiors/modern-bathroom.jpg' 
WHERE id = '6dfccedf-ff0c-445c-abf9-b9b3a72bf49d';

UPDATE assets SET file_url = '/assets/stock/interiors/living-room.jpg' 
WHERE id = 'b7d1f3c0-7dc1-4fe3-9b04-373fbb7aedda';

-- Update Neighborhoods
UPDATE assets SET file_url = '/assets/stock/neighborhoods/downtown-cityscape.jpg' 
WHERE id = '0d96cd17-60a3-4f1c-bbf8-ff7e72dd9fa2';

UPDATE assets SET file_url = '/assets/stock/neighborhoods/park-view.jpg' 
WHERE id = '4dc493d4-1ed8-4cf5-9999-a40c6ee40664';

UPDATE assets SET file_url = '/assets/stock/neighborhoods/suburban-neighborhood.jpg' 
WHERE id = '46460c44-9bc6-484f-b8a9-3c1f4f5446a7';

-- Verify the updates
SELECT id, name, category, file_url FROM assets WHERE is_system_asset = true ORDER BY category, name;
