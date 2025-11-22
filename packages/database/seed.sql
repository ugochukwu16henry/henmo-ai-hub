-- ===========================================
-- HenMo AI - Seed Data
-- ===========================================
-- Run this after schema.sql to populate initial data

-- ===========================================
-- COUNTRIES (African focus + global)
-- ===========================================
INSERT INTO countries (name, code, is_active) VALUES
('Nigeria', 'NGA', TRUE),
('Ghana', 'GHA', TRUE),
('Kenya', 'KEN', TRUE),
('South Africa', 'ZAF', TRUE),
('Rwanda', 'RWA', TRUE),
('Egypt', 'EGY', TRUE),
('United States', 'USA', TRUE),
('United Kingdom', 'GBR', TRUE),
('India', 'IND', TRUE),
('Brazil', 'BRA', TRUE)
ON CONFLICT (code) DO NOTHING;

-- ===========================================
-- NIGERIAN STATES (Primary market)
-- ===========================================
INSERT INTO states (country_id, name, code) VALUES
(1, 'Lagos', 'LA'),
(1, 'Abuja FCT', 'FC'),
(1, 'Rivers', 'RI'),
(1, 'Akwa Ibom', 'AK'),
(1, 'Kano', 'KN'),
(1, 'Oyo', 'OY'),
(1, 'Enugu', 'EN'),
(1, 'Delta', 'DE'),
(1, 'Kaduna', 'KD'),
(1, 'Anambra', 'AN')
ON CONFLICT DO NOTHING;

-- ===========================================
-- MAJOR NIGERIAN CITIES
-- ===========================================
INSERT INTO cities (state_id, name, timezone) VALUES
-- Lagos State
(1, 'Lagos Island', 'Africa/Lagos'),
(1, 'Ikeja', 'Africa/Lagos'),
(1, 'Victoria Island', 'Africa/Lagos'),
(1, 'Lekki', 'Africa/Lagos'),
(1, 'Surulere', 'Africa/Lagos'),
-- Abuja
(2, 'Abuja Central', 'Africa/Lagos'),
(2, 'Garki', 'Africa/Lagos'),
(2, 'Wuse', 'Africa/Lagos'),
-- Rivers
(3, 'Port Harcourt', 'Africa/Lagos'),
-- Akwa Ibom
(4, 'Uyo', 'Africa/Lagos'),
(4, 'Eket', 'Africa/Lagos'),
-- Kano
(5, 'Kano City', 'Africa/Lagos')
ON CONFLICT DO NOTHING;

-- ===========================================
-- DEFAULT ADMIN USER
-- ===========================================
-- Password: Admin@123456 (change this immediately after setup!)
-- Hash generated with bcrypt (cost factor 12)
INSERT INTO users (
    email, 
    password_hash, 
    name, 
    role, 
    status, 
    country, 
    city,
    email_verified,
    subscription_tier
) VALUES (
    'admin@henmo.ai',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4t8f0N1H6M.O/Vyu',
    'HenMo Admin',
    'super_admin',
    'active',
    'Nigeria',
    'Lagos',
    TRUE,
    'enterprise'
)
ON CONFLICT (email) DO NOTHING;

-- ===========================================
-- SAMPLE STREETS FOR TESTING
-- ===========================================
INSERT INTO streets (name, city_id, area, latitude, longitude) VALUES
('Adeola Odeku Street', 3, 'Victoria Island', 6.4281, 3.4226),
('Allen Avenue', 2, 'Ikeja', 6.6018, 3.3515),
('Ahmadu Bello Way', 3, 'Victoria Island', 6.4299, 3.4195),
('Awolowo Road', 1, 'Ikoyi', 6.4544, 3.4331),
('Broad Street', 1, 'Lagos Island', 6.4541, 3.3894),
('Aba Road', 9, 'Port Harcourt', 4.8156, 7.0498),
('Ikot Ekpene Road', 10, 'Uyo', 5.0377, 7.9128),
('Ibrahim Taiwo Road', 12, 'Kano', 12.0022, 8.5919)
ON CONFLICT DO NOTHING;

-- ===========================================
-- TABLE COMMENTS
-- ===========================================
COMMENT ON TABLE users IS 'Main user accounts table';
COMMENT ON TABLE conversations IS 'AI chat conversation sessions';
COMMENT ON TABLE messages IS 'Individual messages within conversations';
COMMENT ON TABLE ai_memory IS 'User personal knowledge base for RAG';
COMMENT ON TABLE contributions IS 'Street image contribution submissions';
COMMENT ON TABLE verifications IS 'Peer verification records';
COMMENT ON TABLE plugins IS 'HenMo Plugin marketplace';
COMMENT ON TABLE streets IS 'Street location data';

-- ===========================================
-- SUCCESS MESSAGE
-- ===========================================
DO $$ BEGIN RAISE NOTICE 'HenMo AI Seed data inserted successfully!'; END $$;