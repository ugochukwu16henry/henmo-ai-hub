-- Admin System Migration
-- Run this in your PostgreSQL database

-- Update user_role enum to include admin roles
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin', 'super_admin');
    ELSE
        -- Add new roles if they don't exist
        BEGIN
            ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'moderator';
            ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin';
            ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';
        EXCEPTION
            WHEN duplicate_object THEN NULL;
        END;
    END IF;
END $$;

-- Add admin-related columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS assigned_country VARCHAR(100),
ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS invitation_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS invitation_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS invitation_accepted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS can_invite_others BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS login_ip VARCHAR(45),
ADD COLUMN IF NOT EXISTS session_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS two_factor_secret VARCHAR(32),
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE;

-- Create admin_invitations table
CREATE TABLE IF NOT EXISTS admin_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invited_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    country VARCHAR(100),
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_invitations_token ON admin_invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_email ON admin_invitations(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_country ON users(assigned_country);

-- Set Henry as Super Admin with secure credentials
UPDATE users 
SET 
    role = 'super_admin',
    can_invite_others = TRUE,
    assigned_country = 'Global',
    username = 'ugochukwuhenry',
    password = '$2a$12$PGjOKfWpoy80cWbjA1XLIO24SMeEH4pV1ybNQgHOwWrWIxsaFHJzW'
WHERE email = 'ugochukwuhenry16@gmail.com' OR username = 'ugochukwuhenry';

-- If Henry's account doesn't exist, create it
INSERT INTO users (id, name, email, username, password, role, assigned_country, can_invite_others, created_at)
SELECT 
    uuid_generate_v4(),
    'Henry Maobughichi Ugochukwu',
    'ugochukwuhenry16@gmail.com',
    'ugochukwuhenry',
    '$2a$12$PGjOKfWpoy80cWbjA1XLIO24SMeEH4pV1ybNQgHOwWrWIxsaFHJzW',
    'super_admin',
    'Global',
    TRUE,
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM users 
    WHERE email = 'ugochukwuhenry16@gmail.com' 
    OR username = 'ugochukwuhenry'
);