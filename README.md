# HenMo AI Platform

Advanced AI Development Hub with comprehensive code analysis, media generation, and intelligent debugging capabilities.

## 🚀 Features

### Core AI Capabilities
- **Advanced Code Analysis** - Security scanning, performance optimization, bug detection
- **Multi-Language Support** - 11+ programming languages (JavaScript, TypeScript, Python, Java, C#, Go, Rust, PHP, SQL, C++, C)
- **Real-time Code Review** - SAST scanning, secrets detection, IaC security analysis
- **Intelligent Debugging** - Error analysis, root cause identification, solution suggestions
- **Code Generation** - Full applications, APIs, databases, infrastructure code

### Media Generation
- **Video Creation** - Demo videos, app showcases, version release videos
- **Image Generation** - Custom AI images, company branding, product screenshots
- **Watermark System** - Automatic HenMo AI branding on all generated media

### Development Tools
- **File Operations** - Read, write, create, modify files and directories
- **Command Execution** - Safe bash/cmd execution with restrictions
- **IDE Integration** - VS Code operations, terminal access, workspace management
- **Git Operations** - Version control, branching, merging, commit management

### Enterprise Features
- **Multi-level Admin System** - Super Admin → Country Admins → Moderators → Users
- **Secure Authentication** - JWT tokens, rate limiting, account lockout
- **Role-based Access Control** - Granular permissions system
- **Analytics Dashboard** - Comprehensive usage tracking and reporting

## 📋 Project Structure

```
henmo-ai/
├── apps/
│   ├── api/                 # Backend API (Node.js/Express)
│   │   ├── src/
│   │   │   ├── controllers/ # API controllers
│   │   │   ├── services/    # Business logic
│   │   │   ├── routes/      # API routes
│   │   │   ├── middleware/  # Authentication, validation
│   │   │   └── server.js    # Main server file
│   │   └── package.json
│   └── hub/                 # Frontend (Next.js/React)
│       ├── app/             # App router pages
│       ├── components/      # React components
│       ├── lib/             # Utilities and stores
│       └── package.json
├── docker-compose.yml       # Development environment
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd henmo-ai
```

### 2. Backend Setup
```bash
cd apps/api
npm install
```

### 3. Environment Configuration
```bash
cp .env.example .env
# Edit .env with your configuration
```

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `ANTHROPIC_API_KEY` - Anthropic Claude API key
- `OPENAI_API_KEY` - OpenAI API key (optional)

### 4. Database Setup
```bash
# Create database
createdb henmo_ai

# Test connection
npm run test-db

# Run migrations (if available)
npm run migrate
```

### 5. Frontend Setup
```bash
cd ../hub/hub
npm install
```

### 6. Start Development Servers
```bash
# Backend (Terminal 1)
cd apps/api
npm run dev

# Frontend (Terminal 2) 
cd apps/hub/hub
npm run dev
```

## 🧪 Testing

### Automated Testing
```bash
# Run startup check
cd apps/api
npm run setup

# Run all tests
npm test
```

### Manual Testing Checklist

#### Critical Tests (Must Pass)
- [ ] User Registration/Login
- [ ] JWT Token Validation
- [ ] Database Connection
- [ ] Health Check API
- [ ] Dashboard Loading

#### High Priority Tests
- [ ] Code Analysis API
- [ ] Security Scanning
- [ ] File Operations
- [ ] Media Generation
- [ ] User Management

#### Test Credentials
- **Email**: ugochukwuhenry16@gmail.com
- **Password**: 1995Mobuchi@
- **Role**: super_admin

### API Testing
```bash
# Health check
curl http://localhost:3001/api/health

# Code analysis
curl -X POST http://localhost:3001/api/ai-capabilities/analyze/code \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"code": "console.log(\"Hello World\")", "language": "javascript"}'
```

## 🔧 Configuration

### Database Schema
The project uses PostgreSQL with the following main tables:
- `users` - User accounts and authentication
- `admin_invitations` - Admin invitation system
- `conversations` - Chat history
- `memories` - AI memory storage
- `analytics` - Usage tracking

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

#### AI Capabilities
- `POST /api/ai-capabilities/analyze/code` - Code analysis
- `POST /api/ai-capabilities/debug/error` - Error debugging
- `POST /api/ai-capabilities/generate/code` - Code generation

#### Media Generation
- `POST /api/media/video/demo` - Generate demo video
- `POST /api/media/image/generate` - Generate custom image
- `POST /api/media/image/branding` - Generate company branding

## 🚀 Deployment

### Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Statistics

- **Total Lines of Code**: 26,000+
- **Features Implemented**: 50+
- **Programming Languages Supported**: 11+
- **Development Time**: 8 months
- **API Endpoints**: 40+
- **Frontend Pages**: 20+

## 🔒 Security Features

- JWT-based authentication
- Rate limiting (100 requests/minute)
- Account lockout (5 failed attempts)
- Role-based access control
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## 🎯 Performance Optimizations

- Lazy loading components
- Memoized React components
- Database query optimization
- Caching strategies
- Bundle size optimization
- Image optimization

## 📝 Development Notes

### Code Quality
- ESLint configuration
- Prettier formatting
- TypeScript for frontend
- Comprehensive error handling
- Logging and monitoring

### Testing Strategy
- Unit tests with Jest
- Integration tests
- API endpoint testing
- Frontend component testing
- End-to-end testing

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is proprietary software developed by Henry M. Ugochukwu.

## 👨‍💻 Creator

**Henry M. Ugochukwu**
- Software Engineer
- 100+ sleepless nights
- 26,000+ lines of code
- 8 months of development

---

Built with ❤️ by HenMo AI Team