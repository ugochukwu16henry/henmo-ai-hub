-- ===========================================
-- HenMo AI - Complete Database Schema
-- ===========================================
-- PostgreSQL 15+ (No external extensions required)

-- Enable built-in extensions only
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===========================================
-- ENUMS
-- ===========================================
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'contributor', 'verifier', 'developer', 'admin', 'super_admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE contribution_status AS ENUM ('pending', 'verified', 'rejected', 'needs_review');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE verification_verdict AS ENUM ('approved', 'rejected', 'needs_review', 'flagged');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE subscription_tier AS ENUM ('free', 'starter', 'pro', 'enterprise');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE ai_provider AS ENUM ('openai', 'anthropic', 'google', 'local');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ===========================================
-- USERS & AUTHENTICATION
-- ===========================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    status user_status DEFAULT 'pending_verification',
    country VARCHAR(100),
    city VARCHAR(100),
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'en',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    subscription_tier subscription_tier DEFAULT 'free',
    reputation_score INTEGER DEFAULT 0,
    total_contributions INTEGER DEFAULT 0,
    total_verifications INTEGER DEFAULT 0,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info JSONB,
    ip_address INET,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS password_resets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- AI MEMORY & CONVERSATIONS
-- ===========================================
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    mode VARCHAR(50) DEFAULT 'general',
    ai_provider ai_provider DEFAULT 'anthropic',
    model_used VARCHAR(100),
    message_count INTEGER DEFAULT 0,
    token_count INTEGER DEFAULT 0,
    is_archived BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Memory - Using JSONB for embeddings instead of vector type
CREATE TABLE IF NOT EXISTS ai_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    content TEXT NOT NULL,
    content_type VARCHAR(50) DEFAULT 'note',
    embedding JSONB,
    tags TEXT[],
    is_pinned BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- LOCATIONS & STREETS
-- ===========================================
CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(3) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS states (
    id SERIAL PRIMARY KEY,
    country_id INTEGER NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    state_id INTEGER NOT NULL REFERENCES states(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    population INTEGER,
    timezone VARCHAR(50)
);

-- Streets - Using lat/lng instead of PostGIS geometry
CREATE TABLE IF NOT EXISTS streets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    city_id INTEGER REFERENCES cities(id),
    area VARCHAR(255),
    postal_code VARCHAR(20),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- STREET CONTRIBUTIONS & IMAGES
-- ===========================================
CREATE TABLE IF NOT EXISTS contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    street_id UUID REFERENCES streets(id) ON DELETE SET NULL,
    status contribution_status DEFAULT 'pending',
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    taken_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    device_info JSONB,
    weather_conditions VARCHAR(100),
    verification_count INTEGER DEFAULT 0,
    approval_count INTEGER DEFAULT 0,
    rejection_count INTEGER DEFAULT 0,
    reward_amount DECIMAL(10, 2) DEFAULT 0,
    reward_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contribution_id UUID NOT NULL REFERENCES contributions(id) ON DELETE CASCADE,
    s3_key VARCHAR(500) NOT NULL,
    s3_bucket VARCHAR(255),
    thumbnail_key VARCHAR(500),
    original_filename VARCHAR(255),
    mime_type VARCHAR(100),
    file_size INTEGER,
    width INTEGER,
    height INTEGER,
    exif_data JSONB,
    ai_analysis JSONB,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS image_tags (
    id SERIAL PRIMARY KEY,
    image_id UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,
    tag VARCHAR(100) NOT NULL,
    confidence FLOAT,
    source VARCHAR(50) DEFAULT 'user'
);

-- ===========================================
-- VERIFICATION SYSTEM
-- ===========================================
CREATE TABLE IF NOT EXISTS verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contribution_id UUID NOT NULL REFERENCES contributions(id) ON DELETE CASCADE,
    verifier_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    verdict verification_verdict NOT NULL,
    confidence_score FLOAT,
    comment TEXT,
    location_match BOOLEAN,
    time_match BOOLEAN,
    quality_score INTEGER CHECK (quality_score >= 1 AND quality_score <= 5),
    reward_amount DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- PAYMENTS & SUBSCRIPTIONS
-- ===========================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    provider VARCHAR(50) NOT NULL,
    provider_ref VARCHAR(255),
    payment_type VARCHAR(50) NOT NULL,
    status payment_status DEFAULT 'pending',
    metadata JSONB DEFAULT '{}',
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier subscription_tier NOT NULL,
    provider VARCHAR(50),
    provider_subscription_id VARCHAR(255),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payout_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NGN',
    bank_name VARCHAR(100),
    account_number VARCHAR(50),
    account_name VARCHAR(100),
    status payment_status DEFAULT 'pending',
    processed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- PLUGINS & EXTENSIONS
-- ===========================================
CREATE TABLE IF NOT EXISTS plugins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    developer_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    version VARCHAR(20) DEFAULT '1.0.0',
    icon_url TEXT,
    repository_url TEXT,
    documentation_url TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    install_count INTEGER DEFAULT 0,
    rating_average FLOAT DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    price DECIMAL(10, 2) DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_plugins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plugin_id UUID NOT NULL REFERENCES plugins(id) ON DELETE CASCADE,
    is_enabled BOOLEAN DEFAULT TRUE,
    settings JSONB DEFAULT '{}',
    installed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, plugin_id)
);

-- ===========================================
-- API KEYS & USAGE
-- ===========================================
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    key_hash VARCHAR(255) NOT NULL UNIQUE,
    key_prefix VARCHAR(10) NOT NULL,
    scopes TEXT[] DEFAULT '{}',
    rate_limit INTEGER DEFAULT 1000,
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS api_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER,
    response_time_ms INTEGER,
    tokens_used INTEGER DEFAULT 0,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- AUDIT & LOGGING
-- ===========================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    context JSONB DEFAULT '{}',
    stack_trace TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_country ON users(country);

CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created ON conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);

CREATE INDEX IF NOT EXISTS idx_ai_memory_user ON ai_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_memory_tags ON ai_memory USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_streets_city ON streets(city_id);
CREATE INDEX IF NOT EXISTS idx_streets_location ON streets(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_contributions_user ON contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_street ON contributions(street_id);
CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status);
CREATE INDEX IF NOT EXISTS idx_contributions_location ON contributions(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_images_contribution ON images(contribution_id);
CREATE INDEX IF NOT EXISTS idx_verifications_contribution ON verifications(contribution_id);
CREATE INDEX IF NOT EXISTS idx_verifications_verifier ON verifications(verifier_id);

CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

CREATE INDEX IF NOT EXISTS idx_api_usage_key ON api_usage(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_created ON api_usage(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- ===========================================
-- TRIGGERS FOR UPDATED_AT
-- ===========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS conversations_updated_at ON conversations;
CREATE TRIGGER conversations_updated_at BEFORE UPDATE ON conversations
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS ai_memory_updated_at ON ai_memory;
CREATE TRIGGER ai_memory_updated_at BEFORE UPDATE ON ai_memory
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS streets_updated_at ON streets;
CREATE TRIGGER streets_updated_at BEFORE UPDATE ON streets
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS contributions_updated_at ON contributions;
CREATE TRIGGER contributions_updated_at BEFORE UPDATE ON contributions
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS subscriptions_updated_at ON subscriptions;
CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON subscriptions
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS plugins_updated_at ON plugins;
CREATE TRIGGER plugins_updated_at BEFORE UPDATE ON plugins
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===========================================
-- SUCCESS MESSAGE
-- ===========================================
DO $$ BEGIN RAISE NOTICE 'HenMo AI Schema created successfully!'; END $$;