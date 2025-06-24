-- HydroGPT Database Initialization Script
-- Run this on your Railway PostgreSQL database

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create tables (you'll need to import your actual data)
-- This is a template - replace with your actual schema

-- Example sublocation_statistics table structure
-- (You'll need to export this from your Windows PostgreSQL)
CREATE TABLE IF NOT EXISTS sublocation_statistics (
    id SERIAL PRIMARY KEY,
    sublocation_name VARCHAR(255) NOT NULL,
    avg_combined_accessibility FLOAT,
    total_population INTEGER,
    water_points_count INTEGER,
    high_capacity_water_points INTEGER,
    medium_capacity_water_points INTEGER,
    low_capacity_water_points INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example sublocations table structure
CREATE TABLE IF NOT EXISTS sublocations (
    id SERIAL PRIMARY KEY,
    slname VARCHAR(255),
    locname VARCHAR(255),
    geom GEOMETRY(MULTIPOLYGON, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example waterpoints table structure  
CREATE TABLE IF NOT EXISTS waterpoints (
    id SERIAL PRIMARY KEY,
    source VARCHAR(255),
    water_sour VARCHAR(255),
    capacitysc INTEGER,
    status VARCHAR(100),
    geom GEOMETRY(POINT, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sublocations_slname ON sublocations(slname);
CREATE INDEX IF NOT EXISTS idx_sublocations_geom ON sublocations USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_waterpoints_geom ON waterpoints USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_stats_sublocation ON sublocation_statistics(sublocation_name);

-- Insert sample data for testing (replace with your actual data)
INSERT INTO sublocation_statistics (sublocation_name, avg_combined_accessibility, total_population, water_points_count, high_capacity_water_points, medium_capacity_water_points, low_capacity_water_points) VALUES
('MAKIMA', 0.968, 3245, 3, 0, 1, 2),
('KARABA', 1.45, 2890, 5, 2, 2, 1),
('KIAMBERE', 1.34, 4120, 5, 2, 2, 1)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE sublocation_statistics IS 'Pre-computed water accessibility statistics for each sublocation';
COMMENT ON TABLE sublocations IS 'Geographic boundaries of sublocations with spatial data';
COMMENT ON TABLE waterpoints IS 'Water infrastructure points with capacity ratings';