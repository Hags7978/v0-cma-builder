-- Seed system templates based on the CMA PDF provided
INSERT INTO public.templates (id, name, description, is_system_template, is_public, category, page_count, pages) VALUES
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Comparative Market Analysis',
  'Professional CMA template for real estate agents with property details, market analysis, and comparable sales.',
  TRUE,
  TRUE,
  'cma',
  8,
  '[
    {
      "id": "page-1",
      "name": "Cover Page",
      "elements": [
        {"id": "el-1", "type": "image", "x": 0, "y": 0, "width": 816, "height": 1056, "src": "/placeholder.svg?height=1056&width=816", "locked": true},
        {"id": "el-2", "type": "shape", "x": 0, "y": 700, "width": 816, "height": 356, "fill": "rgba(0,0,0,0.7)"},
        {"id": "el-3", "type": "text", "x": 40, "y": 750, "width": 736, "height": 60, "content": "Comparative Market Analysis", "fontSize": 36, "fontWeight": "bold", "color": "#ffffff"},
        {"id": "el-4", "type": "text", "x": 40, "y": 830, "width": 736, "height": 40, "content": "{{property_address}}", "fontSize": 24, "color": "#ffffff"},
        {"id": "el-5", "type": "text", "x": 40, "y": 880, "width": 736, "height": 30, "content": "Prepared for: {{client_name}}", "fontSize": 18, "color": "#cccccc"},
        {"id": "el-6", "type": "text", "x": 40, "y": 920, "width": 736, "height": 30, "content": "Prepared by: {{agent_name}}", "fontSize": 18, "color": "#cccccc"},
        {"id": "el-7", "type": "logo", "x": 40, "y": 980, "width": 150, "height": 50, "logoType": "light"}
      ]
    },
    {
      "id": "page-2",
      "name": "Property Details",
      "elements": [
        {"id": "el-8", "type": "text", "x": 40, "y": 40, "width": 736, "height": 50, "content": "Subject Property Details", "fontSize": 28, "fontWeight": "bold", "color": "#1e3a5f"},
        {"id": "el-9", "type": "image", "x": 40, "y": 110, "width": 400, "height": 280, "src": "/placeholder.svg?height=280&width=400"},
        {"id": "el-10", "type": "shape", "x": 460, "y": 110, "width": 316, "height": 280, "fill": "#f8fafc", "borderRadius": 8},
        {"id": "el-11", "type": "text", "x": 480, "y": 130, "width": 276, "height": 240, "content": "Address: {{property_address}}\n\nBedrooms: {{bedrooms}}\nBathrooms: {{bathrooms}}\nSq. Footage: {{sqft}}\nLot Size: {{lot_size}}\nYear Built: {{year_built}}\nGarage: {{garage}}", "fontSize": 14, "color": "#334155"},
        {"id": "el-12", "type": "text", "x": 40, "y": 420, "width": 736, "height": 30, "content": "Property Features", "fontSize": 20, "fontWeight": "bold", "color": "#1e3a5f"},
        {"id": "el-13", "type": "text", "x": 40, "y": 460, "width": 736, "height": 200, "content": "{{property_features}}", "fontSize": 14, "color": "#334155"}
      ]
    },
    {
      "id": "page-3",
      "name": "Market Overview",
      "elements": [
        {"id": "el-14", "type": "text", "x": 40, "y": 40, "width": 736, "height": 50, "content": "Local Market Overview", "fontSize": 28, "fontWeight": "bold", "color": "#1e3a5f"},
        {"id": "el-15", "type": "shape", "x": 40, "y": 110, "width": 230, "height": 140, "fill": "#1e3a5f", "borderRadius": 8},
        {"id": "el-16", "type": "text", "x": 60, "y": 130, "width": 190, "height": 100, "content": "Average Days\non Market\n{{avg_dom}}", "fontSize": 16, "color": "#ffffff", "textAlign": "center"},
        {"id": "el-17", "type": "shape", "x": 293, "y": 110, "width": 230, "height": 140, "fill": "#2563eb", "borderRadius": 8},
        {"id": "el-18", "type": "text", "x": 313, "y": 130, "width": 190, "height": 100, "content": "Median Sale\nPrice\n{{median_price}}", "fontSize": 16, "color": "#ffffff", "textAlign": "center"},
        {"id": "el-19", "type": "shape", "x": 546, "y": 110, "width": 230, "height": 140, "fill": "#0ea5e9", "borderRadius": 8},
        {"id": "el-20", "type": "text", "x": 566, "y": 130, "width": 190, "height": 100, "content": "List to Sale\nRatio\n{{list_sale_ratio}}", "fontSize": 16, "color": "#ffffff", "textAlign": "center"}
      ]
    },
    {
      "id": "page-4",
      "name": "Comparable Sales",
      "elements": [
        {"id": "el-21", "type": "text", "x": 40, "y": 40, "width": 736, "height": 50, "content": "Comparable Sales", "fontSize": 28, "fontWeight": "bold", "color": "#1e3a5f"},
        {"id": "el-22", "type": "table", "x": 40, "y": 110, "width": 736, "height": 400, "columns": ["Address", "Beds", "Baths", "Sq Ft", "Sale Price", "$/Sq Ft"], "data": "{{comparables}}"}
      ]
    },
    {
      "id": "page-5",
      "name": "Price Analysis",
      "elements": [
        {"id": "el-23", "type": "text", "x": 40, "y": 40, "width": 736, "height": 50, "content": "Suggested Price Range", "fontSize": 28, "fontWeight": "bold", "color": "#1e3a5f"},
        {"id": "el-24", "type": "shape", "x": 40, "y": 110, "width": 736, "height": 200, "fill": "#f1f5f9", "borderRadius": 8},
        {"id": "el-25", "type": "text", "x": 60, "y": 150, "width": 696, "height": 140, "content": "Based on our comprehensive market analysis, the suggested listing price range for your property is:\n\n{{price_range_low}} - {{price_range_high}}", "fontSize": 18, "color": "#1e3a5f", "textAlign": "center"}
      ]
    },
    {
      "id": "page-6",
      "name": "Agent Info",
      "elements": [
        {"id": "el-26", "type": "text", "x": 40, "y": 40, "width": 736, "height": 50, "content": "Your Real Estate Professional", "fontSize": 28, "fontWeight": "bold", "color": "#1e3a5f"},
        {"id": "el-27", "type": "image", "x": 40, "y": 110, "width": 200, "height": 200, "src": "{{agent_photo}}", "borderRadius": 100},
        {"id": "el-28", "type": "text", "x": 270, "y": 110, "width": 506, "height": 200, "content": "{{agent_name}}\n{{agent_title}}\n\n{{agent_phone}}\n{{agent_email}}\n{{agent_website}}", "fontSize": 16, "color": "#334155"},
        {"id": "el-29", "type": "logo", "x": 40, "y": 950, "width": 200, "height": 70, "logoType": "dark"}
      ]
    }
  ]'::JSONB
),
(
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'Property Listing Presentation',
  'Elegant listing presentation template to showcase properties to potential buyers.',
  TRUE,
  TRUE,
  'listing',
  6,
  '[
    {
      "id": "page-1",
      "name": "Cover",
      "elements": [
        {"id": "el-1", "type": "image", "x": 0, "y": 0, "width": 816, "height": 1056, "src": "/placeholder.svg?height=1056&width=816"},
        {"id": "el-2", "type": "shape", "x": 0, "y": 0, "width": 816, "height": 1056, "fill": "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)"},
        {"id": "el-3", "type": "text", "x": 40, "y": 850, "width": 736, "height": 60, "content": "{{property_address}}", "fontSize": 32, "fontWeight": "bold", "color": "#ffffff"},
        {"id": "el-4", "type": "text", "x": 40, "y": 920, "width": 736, "height": 40, "content": "{{price}}", "fontSize": 28, "color": "#f59e0b"}
      ]
    }
  ]'::JSONB
),
(
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  'Buyer Consultation',
  'Professional buyer consultation template to help guide potential homebuyers.',
  TRUE,
  TRUE,
  'buyer',
  5,
  '[
    {
      "id": "page-1",
      "name": "Welcome",
      "elements": [
        {"id": "el-1", "type": "shape", "x": 0, "y": 0, "width": 816, "height": 1056, "fill": "#1e3a5f"},
        {"id": "el-2", "type": "text", "x": 40, "y": 400, "width": 736, "height": 80, "content": "Buyer Consultation Guide", "fontSize": 42, "fontWeight": "bold", "color": "#ffffff", "textAlign": "center"},
        {"id": "el-3", "type": "text", "x": 40, "y": 500, "width": 736, "height": 40, "content": "Your Journey to Homeownership Starts Here", "fontSize": 20, "color": "#94a3b8", "textAlign": "center"},
        {"id": "el-4", "type": "logo", "x": 308, "y": 600, "width": 200, "height": 70, "logoType": "light"}
      ]
    }
  ]'::JSONB
);
