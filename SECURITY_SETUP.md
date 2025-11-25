# 🔐 HenMo AI Security Setup

## Admin Credentials
- **Username**: `ugochukwuhenry`
- **Email**: `ugochukwuhenry16@gmail.com`
- **Password**: `1995Mobuchi@`
- **Role**: Super Admin
- **Country**: Global

## 🛡️ Security Features Implemented

### 1. Account Security
- **Password Hashing**: bcrypt with 12 salt rounds
- **Account Lockout**: 5 failed attempts = 30 minutes lockout
- **Session Management**: Secure token-based authentication
- **Password Requirements**: Minimum 8 characters

### 2. Anti-Bot Protection
- **User Agent Detection**: Blocks suspicious bots/crawlers
- **Rate Limiting**: 5 login attempts per 15 minutes
- **Admin Rate Limiting**: 30 requests per minute for admin routes
- **Input Validation**: All inputs sanitized and validated

### 3. Network Security
- **IP Whitelisting**: Admin routes restricted by IP (configurable)
- **Security Headers**: Helmet.js with CSP protection
- **HTTPS Enforcement**: Production security headers
- **Request Logging**: All admin access logged

### 4. Session Security
- **Token Expiration**: Sessions expire on inactivity
- **Secure Storage**: Tokens stored securely
- **Auto Logout**: Invalid sessions redirect to login
- **Single Session**: New login invalidates old sessions

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
cd apps/api
npm install helmet express-rate-limit express-validator bcryptjs
```

### 2. Run Database Migration
```bash
cd apps/api
node run-migration.js
```

### 3. Start Secure Backend
```bash
cd apps/api
npm start
```

### 4. Start Frontend
```bash
cd apps/hub/hub
npm run dev
```

## 🔑 Login Process

1. Visit: `http://localhost:3000/login`
2. Enter credentials:
   - Username: `ugochukwuhenry`
   - Password: `1995Mobuchi@`
3. System validates and creates secure session
4. Redirects to admin dashboard

## 🚨 Security Measures Against Attacks

### Bot/AI Protection
- User agent filtering blocks automated tools
- Rate limiting prevents brute force attacks
- CAPTCHA-like behavior detection
- Suspicious pattern recognition

### Hacker Prevention
- Account lockout after failed attempts
- IP-based access control
- Session token validation
- SQL injection prevention
- XSS protection via CSP headers

### Network Security
- HTTPS enforcement in production
- Secure cookie settings
- CORS protection
- Request size limits

## 📊 Security Monitoring

### Logged Events
- All login attempts (success/failure)
- Account lockouts
- Suspicious user agents
- Admin actions
- IP access attempts

### Log Locations
- `apps/api/logs/security.log`
- `apps/api/logs/admin.log`
- Database audit trail

## ⚙️ Configuration

### IP Whitelist (Production)
Edit `apps/api/src/middleware/security.js`:
```javascript
const adminIPWhitelist = [
  '127.0.0.1',        // Localhost
  '::1',              // IPv6 localhost
  'YOUR_OFFICE_IP',   // Add your office IP
  'YOUR_HOME_IP'      // Add your home IP
];
```

### Rate Limits
```javascript
// Login attempts: 5 per 15 minutes
// Admin requests: 30 per minute
// Configurable in security.js
```

## 🔧 Advanced Security (Optional)

### Two-Factor Authentication
Database ready for 2FA:
- `two_factor_secret` column
- `two_factor_enabled` column

### Additional Hardening
- VPN requirement
- Hardware key authentication
- Biometric verification
- Time-based access restrictions

## 🚨 Emergency Access

### Account Recovery
If locked out:
1. Wait 30 minutes for auto-unlock
2. Or run SQL: `UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE username = 'ugochukwuhenry'`

### Reset Password
```sql
-- Generate new hash with: node generate-password.js
UPDATE users SET password = 'NEW_HASH' WHERE username = 'ugochukwuhenry';
```

## 📋 Security Checklist

- [x] Secure password hashing
- [x] Account lockout protection
- [x] Rate limiting
- [x] Bot detection
- [x] Session management
- [x] Input validation
- [x] Security headers
- [x] Access logging
- [x] IP restrictions
- [x] Auto-logout on invalid session

## 🔍 Testing Security

### Test Account Lockout
1. Try wrong password 5 times
2. Account should lock for 30 minutes
3. Check logs for lockout event

### Test Rate Limiting
1. Make rapid login attempts
2. Should get rate limit error
3. Wait 15 minutes to reset

### Test Bot Detection
1. Use curl or automated tool
2. Should get "Access denied" error
3. Check logs for bot detection

## 📞 Security Support

For security issues:
- Check logs first
- Verify database connection
- Ensure all migrations ran
- Contact Henry Maobughichi Ugochukwu

---

**⚠️ IMPORTANT**: This system is designed to be highly secure. No AI, bot, or unauthorized user should be able to access the admin panel. All access is monitored and logged.