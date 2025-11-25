-- Simple admin system setup
CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin', 'super_admin');

-- Add admin columns to users table
ALTER TABLE users 
ADD COLUMN username VARCHAR(50) UNIQUE,
ADD COLUMN assigned_country VARCHAR(100),
ADD COLUMN invited_by UUID REFERENCES users(id),
ADD COLUMN invitation_token VARCHAR(255),
ADD COLUMN invitation_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN invitation_accepted BOOLEAN DEFAULT FALSE,
ADD COLUMN can_invite_others BOOLEAN DEFAULT FALSE,
ADD COLUMN failed_login_attempts INTEGER DEFAULT 0,
ADD COLUMN locked_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN login_ip VARCHAR(45),
ADD COLUMN session_token VARCHAR(255),
ADD COLUMN two_factor_secret VARCHAR(32),
ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE;

-- Create admin_invitations table
CREATE TABLE admin_invitations (
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

-- Create indexes
CREATE INDEX idx_invitations_token ON admin_invitations(token);
CREATE INDEX idx_invitations_email ON admin_invitations(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_country ON users(assigned_country);

-- Insert Henry as Super Admin
INSERT INTO users (id, name, email, username, password, role, assigned_country, can_invite_others, created_at)
VALUES (
    uuid_generate_v4(),
    'Henry Maobughichi Ugochukwu',
    'ugochukwuhenry16@gmail.com',
    'ugochukwuhenry',
    '$2a$12$PGjOKfWpoy80cWbjA1XLIO24SMeEH4pV1ybNQgHOwWrWIxsaFHJzW',
    'super_admin',
    'Global',
    TRUE,
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    username = EXCLUDED.username,
    password = EXCLUDED.password,
    role = EXCLUDED.role,
    assigned_country = EXCLUDED.assigned_country,
    can_invite_others = EXCLUDED.can_invite_others;