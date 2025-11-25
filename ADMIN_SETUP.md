# HenMo AI Admin System Setup

## 🎯 Overview
Multi-level admin system with invitation-only access for HenMo AI platform.

### Hierarchy
```
Super Admin (Henry) → Country Admins → Moderators → Users
```

## 🚀 Setup Instructions

### 1. Database Migration
Run the admin system migration to set up tables and roles:

```bash
cd apps/api
node run-migration.js
```

This will:
- Create `user_role` enum with admin roles
- Add admin columns to `users` table  
- Create `admin_invitations` table
- Set Henry Maobughichi Ugochukwu as Super Admin

### 2. Backend Setup
The admin routes are automatically included in the API. Make sure your backend is running:

```bash
cd apps/api
npm start
```

### 3. Frontend Setup
The admin UI is integrated into the dashboard. Start the frontend:

```bash
cd apps/hub/hub
npm run dev
```

## 👥 User Roles & Permissions

### Super Admin (Henry Maobughichi Ugochukwu)
- **Email**: henryugochukwu@gmail.com
- **Powers**: 
  - ✅ Full system access
  - ✅ Create/remove Country Admins
  - ✅ Access all countries' data
  - ✅ System configuration
  - ✅ Cannot be deleted

### Country Admin
- **Powers**:
  - ✅ Manage users in assigned country only
  - ✅ View country-specific analytics
  - ✅ Invite moderators for their country
  - ✅ Content moderation
  - ❌ Cannot access other countries
  - ❌ Cannot see financial data

### Moderator
- **Powers**:
  - ✅ Content moderation
  - ✅ User support
  - ❌ Cannot delete users
  - ❌ Cannot access admin panel

## 🔑 Admin Features

### 1. Admin Dashboard (`/admin`)
- User statistics
- Quick actions
- Role-based navigation

### 2. Invitation System (`/admin/invitations`)
- Send invitations by email
- Role assignment (Admin/Moderator)
- Country assignment
- Token-based security
- 7-day expiration

### 3. User Management (`/admin/users`)
- View/filter users by country/role
- Update user roles
- Delete users (with permissions)
- Pagination support

### 4. Public Invitation Acceptance (`/invite/[token]`)
- Verify invitation tokens
- Account creation flow
- Password setup
- Automatic role assignment

## 🛡️ Security Features

### Access Control
- Route-level permission checks
- Role-based UI rendering
- Country-specific data filtering
- Token-based invitations

### Permission Matrix
| Action | Super Admin | Country Admin | Moderator |
|--------|-------------|---------------|-----------|
| Invite Country Admin | ✅ | ❌ | ❌ |
| Invite Moderator | ✅ | ✅ (own country) | ❌ |
| View All Users | ✅ | ❌ | ❌ |
| View Country Users | ✅ | ✅ (own country) | ❌ |
| Delete Users | ✅ | ✅ (regular users in country) | ❌ |
| System Settings | ✅ | ❌ | ❌ |

## 📧 Invitation Flow

### Step 1: Send Invitation
1. Admin goes to `/admin/invitations`
2. Fills form: email, role, country
3. System generates unique token
4. Email sent with invitation link

### Step 2: Accept Invitation
1. Recipient clicks link: `henmo.ai/invite/abc123xyz`
2. Lands on invitation page
3. Sees invitation details
4. Creates password
5. Account activated with assigned role

## 🗄️ Database Schema

### Updated `users` table:
```sql
ALTER TABLE users ADD COLUMN assigned_country VARCHAR(100);
ALTER TABLE users ADD COLUMN invited_by UUID REFERENCES users(id);
ALTER TABLE users ADD COLUMN can_invite_others BOOLEAN DEFAULT FALSE;
```

### New `admin_invitations` table:
```sql
CREATE TABLE admin_invitations (
    id UUID PRIMARY KEY,
    invited_by UUID REFERENCES users(id),
    email VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    country VARCHAR(100),
    token VARCHAR(255) UNIQUE,
    expires_at TIMESTAMP,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 🎨 UI Components

### Admin Navigation
- Automatically shows for admin users
- Role-based menu items
- Country indicator
- Permission badges

### Invitation Management
- Send invitation dialog
- Pending invitations list
- Copy invitation links
- Cancel invitations

### User Management
- Filterable user list
- Role assignment
- Country assignment (Super Admin only)
- Bulk actions

## 🔧 API Endpoints

### Admin Routes (`/api/v1/admin/`)
```
POST   /invitations          # Send invitation
GET    /invitations          # List sent invitations  
DELETE /invitations/:id      # Cancel invitation
GET    /verify-invitation/:token  # Verify token (public)
POST   /accept-invitation    # Accept invitation (public)
GET    /users               # List users (filtered by country)
PUT    /users/:id/role      # Change user role
DELETE /users/:id           # Delete user
GET    /stats               # Admin dashboard stats
```

## 🚦 Next Steps

### Phase 1: Core System ✅
- [x] Database schema
- [x] Backend API
- [x] Admin dashboard
- [x] Invitation system

### Phase 2: Enhanced Features
- [ ] Email notifications
- [ ] Audit logging
- [ ] Advanced user management
- [ ] Country-specific analytics

### Phase 3: Advanced Admin Tools
- [ ] Bulk user operations
- [ ] System monitoring
- [ ] Performance analytics
- [ ] Security reports

## 🔍 Testing

### Test Super Admin Access
1. Visit `/admin` - should see full dashboard
2. Go to `/admin/invitations` - can invite both admins and moderators
3. Check `/admin/users` - can see all users

### Test Country Admin
1. Create country admin via invitation
2. Login and visit `/admin` - should see country-specific data
3. Can only invite moderators for assigned country

### Test Invitation Flow
1. Send invitation from admin panel
2. Copy invitation link
3. Open in incognito/different browser
4. Complete account creation
5. Verify role assignment

## 📞 Support

For issues or questions about the admin system:
- Check logs in `apps/api/logs/`
- Verify database connection
- Ensure all migrations ran successfully
- Contact Henry Maobughichi Ugochukwu (Super Admin)

---

**Security Note**: Never share invitation tokens publicly. They provide direct access to create admin accounts.